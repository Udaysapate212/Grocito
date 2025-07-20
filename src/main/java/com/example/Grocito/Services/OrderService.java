package com.example.Grocito.Services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.Cart;
import com.example.Grocito.Entity.CartItem;
import com.example.Grocito.Entity.Order;
import com.example.Grocito.Entity.OrderItem;
import com.example.Grocito.Entity.Product;
import com.example.Grocito.Entity.User;
import com.example.Grocito.Repository.OrderItemRepository;
import com.example.Grocito.Repository.OrderRepository;
import com.example.Grocito.Repository.ProductRepository;
import com.example.Grocito.Repository.UserRepository;

@Service
public class OrderService {

    private static final Logger logger = LoggerConfig.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CartService cartService;

    /**
     * Place an order with the provided order details
     */
    @Transactional
    public Order placeOrder(Order order) {
        logger.info("Processing new order for user ID: {}", order.getUser().getId());
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PLACED");
        
        // Validate user exists
        logger.debug("Validating user exists with ID: {}", order.getUser().getId());
        User user = userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> {
                    logger.error("Order placement failed: User not found with ID: {}", order.getUser().getId());
                    return new RuntimeException("User not found with id: " + order.getUser().getId());
                });
        order.setUser(user);
        logger.debug("User validated: {} (ID: {})", user.getEmail(), user.getId());
        
        double orderTotal = 0.0;
        logger.debug("Processing {} items in order", order.getItems().size());
        
        for (OrderItem item : order.getItems()) {
            logger.debug("Processing order item for product ID: {}, quantity: {}", item.getProduct().getId(), item.getQuantity());
            Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> {
                    logger.error("Order placement failed: Product not found with ID: {}", item.getProduct().getId());
                    return new RuntimeException("Product not found with id: " + item.getProduct().getId());
                });
            
            // Check if product is in stock
            if (product.getStock() < item.getQuantity()) {
                logger.warn("Insufficient stock for product: {} (ID: {}). Available: {}, Requested: {}", 
                        product.getName(), product.getId(), product.getStock(), item.getQuantity());
                throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                        ". Available: " + product.getStock() + ", Requested: " + item.getQuantity());
            }
            
            // Update product stock
            logger.debug("Updating stock for product: {} (ID: {}). Old stock: {}, New stock: {}", 
                    product.getName(), product.getId(), product.getStock(), (product.getStock() - item.getQuantity()));
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
            
            // Set product and order reference
            item.setProduct(product);
            item.setOrder(order);
            
            // Calculate item price and add to order total
            item.setPrice(product.getPrice());
            orderTotal += product.getPrice() * item.getQuantity();
        }
        
        order.setTotalAmount(orderTotal);
        return orderRepository.save(order);
    }
    
    /**
     * Place an order from user's cart
     */
    @Transactional
    public Order placeOrderFromCart(Long userId, String deliveryAddress) {
        logger.info("Processing order from cart for user ID: {}", userId);
        
        // Get user's cart
        logger.debug("Retrieving cart items for user ID: {}", userId);
        List<CartItem> cartItems = cartService.getCartItems(userId);
        if (cartItems.isEmpty()) {
            logger.warn("Order placement failed: Cart is empty for user ID: {}", userId);
            throw new RuntimeException("Cart is empty");
        }
        logger.debug("Found {} items in cart for user ID: {}", cartItems.size(), userId);
        
        // Validate user exists
        logger.debug("Validating user exists with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("Order placement failed: User not found with ID: {}", userId);
                    return new RuntimeException("User not found with id: " + userId);
                });
        logger.debug("User validated: {} (ID: {})", user.getEmail(), user.getId());
        
        // Create new order
        logger.debug("Creating new order for user ID: {}", userId);
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PLACED");
        order.setDeliveryAddress(deliveryAddress);
        
        // Set pincode from user's profile if not provided in the order
        logger.debug("Setting pincode for delivery from user profile");
        if (user.getPincode() != null && !user.getPincode().isEmpty()) {
            order.setPincode(user.getPincode());
            logger.debug("Pincode set to: {}", user.getPincode());
        } else {
            logger.warn("Order placement failed: Pincode missing in user profile for user ID: {}", userId);
            throw new RuntimeException("Pincode is required for delivery. Please update your profile with a valid pincode.");
        }
        
        List<OrderItem> orderItems = new ArrayList<>();
        double orderTotal = 0.0;
        
        // Convert cart items to order items
        logger.debug("Converting {} cart items to order items", cartItems.size());
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            logger.debug("Processing cart item for product: {} (ID: {}), quantity: {}", 
                    product.getName(), product.getId(), cartItem.getQuantity());
            
            // Check if product is in stock
            if (product.getStock() < cartItem.getQuantity()) {
                logger.warn("Insufficient stock for product: {} (ID: {}). Available: {}, Requested: {}", 
                        product.getName(), product.getId(), product.getStock(), cartItem.getQuantity());
                throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                        ". Available: " + product.getStock() + ", Requested: " + cartItem.getQuantity());
            }
            
            // Update product stock
            logger.debug("Updating stock for product: {} (ID: {}). Old stock: {}, New stock: {}", 
                    product.getName(), product.getId(), product.getStock(), (product.getStock() - cartItem.getQuantity()));
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
            
            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);
            
            orderItems.add(orderItem);
            orderTotal += product.getPrice() * cartItem.getQuantity();
        }
        
        order.setItems(orderItems);
        order.setTotalAmount(orderTotal);
        logger.debug("Order total calculated: ${}", orderTotal);
        
        // Save order
        logger.debug("Saving order to database");
        Order savedOrder = orderRepository.save(order);
        logger.info("Order successfully placed with ID: {} for user ID: {}, total amount: ${}", 
                savedOrder.getId(), userId, orderTotal);
        
        // Clear the cart after successful order
        logger.debug("Clearing cart for user ID: {}", userId);
        cartService.clearCart(userId);
        
        return savedOrder;
    }

    /**
     * Get all orders for a user
     */
    public List<Order> getOrdersByUser(Long userId) {
        logger.info("Retrieving all orders for user ID: {}", userId);
        List<Order> orders = orderRepository.findByUserId(userId);
        logger.debug("Found {} orders for user ID: {}", orders.size(), userId);
        return orders;
    }
    
    /**
     * Get order by ID
     */
    public Optional<Order> getOrderById(Long orderId) {
        logger.info("Retrieving order with ID: {}", orderId);
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            logger.debug("Order found with ID: {}", orderId);
        } else {
            logger.debug("Order not found with ID: {}", orderId);
        }
        return order;
    }
    
    /**
     * Update order status
     */
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        logger.info("Updating status to '{}' for order ID: {}", status, orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    logger.error("Status update failed: Order not found with ID: {}", orderId);
                    return new RuntimeException("Order not found with id: " + orderId);
                });
        
        logger.debug("Changing order status from '{}' to '{}' for order ID: {}", 
                order.getStatus(), status, orderId);
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        logger.info("Order status successfully updated to '{}' for order ID: {}", status, orderId);
        return updatedOrder;
    }
    
    /**
     * Cancel an order
     */
    @Transactional
    public Order cancelOrder(Long orderId) {
        logger.info("Processing cancellation request for order ID: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    logger.error("Cancellation failed: Order not found with ID: {}", orderId);
                    return new RuntimeException("Order not found with id: " + orderId);
                });
        
        // Only allow cancellation if order is not delivered
        if ("DELIVERED".equals(order.getStatus())) {
            logger.warn("Cancellation rejected: Order ID: {} is already delivered", orderId);
            throw new RuntimeException("Cannot cancel an order that has been delivered");
        }
        
        // Restore product stock
        logger.debug("Restoring stock for {} items in cancelled order ID: {}", order.getItems().size(), orderId);
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            logger.debug("Restoring stock for product: {} (ID: {}). Old stock: {}, New stock: {}", 
                    product.getName(), product.getId(), product.getStock(), (product.getStock() + item.getQuantity()));
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        
        logger.debug("Setting order status to 'CANCELLED' for order ID: {}", orderId);
        order.setStatus("CANCELLED");
        Order cancelledOrder = orderRepository.save(order);
        logger.info("Order successfully cancelled for order ID: {}", orderId);
        return cancelledOrder;
    }
    
    /**
     * Get order summary
     */
    public Map<String, Object> getOrderSummary(Long orderId) {
        logger.info("Generating order summary for order ID: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    logger.error("Summary generation failed: Order not found with ID: {}", orderId);
                    return new RuntimeException("Order not found with id: " + orderId);
                });
        
        logger.debug("Creating summary map for order ID: {}", orderId);
        Map<String, Object> summary = new HashMap<>();
        summary.put("orderId", order.getId());
        summary.put("userId", order.getUser().getId());
        summary.put("orderTime", order.getOrderTime());
        summary.put("status", order.getStatus());
        summary.put("deliveryAddress", order.getDeliveryAddress());
        summary.put("totalAmount", order.getTotalAmount());
        
        logger.debug("Adding item details to summary for order ID: {}", orderId);
        List<Map<String, Object>> itemDetails = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
            Map<String, Object> detail = new HashMap<>();
            detail.put("productId", item.getProduct().getId());
            detail.put("productName", item.getProduct().getName());
            detail.put("quantity", item.getQuantity());
            detail.put("price", item.getPrice());
            detail.put("subtotal", item.getPrice() * item.getQuantity());
            
            itemDetails.add(detail);
            logger.debug("Added item to summary: {} (ID: {}), quantity: {}, price: ${}", 
                    item.getProduct().getName(), item.getProduct().getId(), item.getQuantity(), item.getPrice());
        }
        
        summary.put("items", itemDetails);
        logger.debug("Order summary generated successfully for order ID: {}", orderId);
        return summary;
    }
    
    /**
     * Get all orders (admin function)
     */
    public List<Order> getAllOrders() {
        logger.info("Retrieving all orders (admin function)");
        List<Order> orders = orderRepository.findAll();
        logger.debug("Found {} total orders in the system", orders.size());
        return orders;
    }
}
