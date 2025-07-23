package com.example.Grocito.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.Order;
import com.example.Grocito.Entity.User;
import com.example.Grocito.Entity.DeliveryPartner;
import com.example.Grocito.Repository.UserRepository;
import com.example.Grocito.Services.OrderService;
import com.example.Grocito.Services.OrderAssignmentService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerConfig.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderAssignmentService orderAssignmentService;

    /**
     * Place an order with the provided order details
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        logger.info("Received request to place a new order");
        try {
            if (order.getUser() == null || order.getUser().getId() == null) {
                logger.warn("Order placement failed: User is required");
                return ResponseEntity.badRequest().body("User is required for placing the order.");
            }

            logger.debug("Finding user with ID: {}", order.getUser().getId());
            User user = userRepository.findById(order.getUser().getId())
                    .orElseThrow(() -> {
                        logger.error("User not found with ID: {}", order.getUser().getId());
                        return new RuntimeException("User not found");
                    });
            order.setUser(user);

            logger.debug("Processing order for user: {}", user.getEmail());
            Order savedOrder = orderService.placeOrder(order);
            logger.info("Order placed successfully with ID: {}", savedOrder.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
        } catch (RuntimeException e) {
            logger.error("Order placement failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Place an order from user's cart
     */
    @PostMapping("/place-from-cart")
    public ResponseEntity<?> placeOrderFromCart(
            @RequestParam Long userId,
            @RequestParam String deliveryAddress) {
        logger.info("Received request to place order from cart for user ID: {}", userId);
        try {
            // Validate input parameters
            if (userId == null) {
                logger.warn("Order from cart failed: User ID is required");
                return ResponseEntity.badRequest().body("User ID is required");
            }
            
            if (deliveryAddress == null || deliveryAddress.trim().isEmpty()) {
                logger.warn("Order from cart failed: Delivery address is required");
                return ResponseEntity.badRequest().body("Delivery address is required");
            }
            
            // Check if user exists and has a valid pincode
            logger.debug("Finding user with ID: {}", userId);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        logger.error("User not found with ID: {}", userId);
                        return new RuntimeException("User not found with id: " + userId);
                    });
            
            if (user.getPincode() == null || user.getPincode().trim().isEmpty()) {
                logger.warn("Order from cart failed: User {} has no valid pincode", user.getEmail());
                return ResponseEntity.badRequest().body("User must have a valid pincode in their profile for delivery. Please update your profile.");
            }
            
            Order savedOrder = orderService.placeOrderFromCart(userId, deliveryAddress.trim());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get all orders for a user
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long id) {
        try {
            List<Order> orders = orderService.getOrdersByUser(id);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get order by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Optional<Order> order = orderService.getOrderById(id);
            if (order.isPresent()) {
                return ResponseEntity.ok(order.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get order summary
     */
    @GetMapping("/{id}/summary")
    public ResponseEntity<?> getOrderSummary(@PathVariable Long id) {
        try {
            Map<String, Object> summary = orderService.getOrderSummary(id);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get all orders (admin function)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Update order status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            String status = statusData.get("status");
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status is required");
            }
            
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Cancel order
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            Order cancelledOrder = orderService.cancelOrder(id);
            return ResponseEntity.ok(cancelledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Assign order to delivery partner automatically
     */
    @PostMapping("/{id}/assign-auto")
    public ResponseEntity<?> assignOrderAutomatically(@PathVariable Long id) {
        try {
            logger.info("Auto-assigning order ID: {}", id);
            
            // Check if order exists and is ready for assignment
            Optional<Order> orderOpt = orderService.getOrderById(id);
            if (!orderOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOpt.get();
            if (!"PLACED".equals(order.getStatus()) && !"PACKED".equals(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order must be in PLACED or PACKED status for assignment");
            }
            
            var assignment = orderAssignmentService.assignOrderAutomatically(id);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
        } catch (RuntimeException e) {
            logger.error("Error auto-assigning order: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Assign order to specific delivery partner
     */
    @PostMapping("/{id}/assign-manual")
    public ResponseEntity<?> assignOrderToPartner(@PathVariable Long id, @RequestBody Map<String, Long> requestData) {
        try {
            Long partnerId = requestData.get("partnerId");
            if (partnerId == null) {
                return ResponseEntity.badRequest().body("Partner ID is required");
            }
            
            logger.info("Manually assigning order ID: {} to partner ID: {}", id, partnerId);
            
            // Check if order exists and is ready for assignment
            Optional<Order> orderOpt = orderService.getOrderById(id);
            if (!orderOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOpt.get();
            if (!"PLACED".equals(order.getStatus()) && !"PACKED".equals(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order must be in PLACED or PACKED status for assignment");
            }
            
            var assignment = orderAssignmentService.assignOrderToPartner(id, partnerId);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
        } catch (RuntimeException e) {
            logger.error("Error manually assigning order: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get order assignment details
     */
    @GetMapping("/{id}/assignment")
    public ResponseEntity<?> getOrderAssignment(@PathVariable Long id) {
        try {
            logger.info("Fetching assignment for order ID: {}", id);
            
            var assignmentOpt = orderAssignmentService.getAssignmentByOrderId(id);
            
            if (assignmentOpt.isPresent()) {
                return ResponseEntity.ok(assignmentOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            logger.error("Error fetching order assignment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Reduce inventory for order items after 2 minutes waiting period
     */
    @PostMapping("/{id}/reduce-inventory")
    public ResponseEntity<?> reduceInventoryForOrder(@PathVariable Long id) {
        try {
            logger.info("Reducing inventory for order ID: {}", id);
            
            // Check if order exists
            Optional<Order> orderOpt = orderService.getOrderById(id);
            if (!orderOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOpt.get();
            
            // Only reduce inventory for non-cancelled orders
            if ("CANCELLED".equals(order.getStatus())) {
                logger.info("Order {} is cancelled, skipping inventory reduction", id);
                return ResponseEntity.ok("Order is cancelled, inventory reduction skipped");
            }
            
            // Reduce inventory for each order item
            orderService.reduceInventoryForOrder(id);
            
            logger.info("Successfully reduced inventory for order ID: {}", id);
            return ResponseEntity.ok("Inventory reduced successfully");
        } catch (RuntimeException e) {
            logger.error("Error reducing inventory for order {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}