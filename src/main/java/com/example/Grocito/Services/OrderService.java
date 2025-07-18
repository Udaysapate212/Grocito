package com.example.Grocito.Services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PLACED");
        
        // Validate user exists
        User user = userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + order.getUser().getId()));
        order.setUser(user);
        
        double orderTotal = 0.0;
        
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProduct().getId()));
            
            // Check if product is in stock
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                        ". Available: " + product.getStock() + ", Requested: " + item.getQuantity());
            }
            
            // Update product stock
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
        // Get user's cart
        List<CartItem> cartItems = cartService.getCartItems(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Create new order
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PLACED");
        order.setDeliveryAddress(deliveryAddress);
        
        // Set pincode from user's profile if not provided in the order
        if (user.getPincode() != null && !user.getPincode().isEmpty()) {
            order.setPincode(user.getPincode());
        } else {
            throw new RuntimeException("Pincode is required for delivery. Please update your profile with a valid pincode.");
        }
        
        List<OrderItem> orderItems = new ArrayList<>();
        double orderTotal = 0.0;
        
        // Convert cart items to order items
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            // Check if product is in stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                        ". Available: " + product.getStock() + ", Requested: " + cartItem.getQuantity());
            }
            
            // Update product stock
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
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Clear the cart after successful order
        cartService.clearCart(userId);
        
        return savedOrder;
    }

    /**
     * Get all orders for a user
     */
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    /**
     * Get order by ID
     */
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
    
    /**
     * Update order status
     */
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    /**
     * Cancel an order
     */
    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        // Only allow cancellation if order is not delivered
        if ("DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel an order that has been delivered");
        }
        
        // Restore product stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        
        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
    
    /**
     * Get order summary
     */
    public Map<String, Object> getOrderSummary(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("orderId", order.getId());
        summary.put("userId", order.getUser().getId());
        summary.put("orderTime", order.getOrderTime());
        summary.put("status", order.getStatus());
        summary.put("deliveryAddress", order.getDeliveryAddress());
        summary.put("totalAmount", order.getTotalAmount());
        
        List<Map<String, Object>> itemDetails = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
            Map<String, Object> detail = new HashMap<>();
            detail.put("productId", item.getProduct().getId());
            detail.put("productName", item.getProduct().getName());
            detail.put("quantity", item.getQuantity());
            detail.put("price", item.getPrice());
            detail.put("subtotal", item.getPrice() * item.getQuantity());
            
            itemDetails.add(detail);
        }
        
        summary.put("items", itemDetails);
        return summary;
    }
    
    /**
     * Get all orders (admin function)
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
