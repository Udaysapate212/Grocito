package com.example.Grocito.Controller;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.Order;
import com.example.Grocito.Services.EmailService;
import com.example.Grocito.Services.OrderService;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    private static final Logger logger = LoggerConfig.getLogger(EmailController.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderService orderService;

    /**
     * Send order confirmation email
     */
    @PostMapping("/send-order-confirmation")
    public ResponseEntity<?> sendOrderConfirmationEmail(@RequestBody Map<String, Object> request) {
        try {
            Long orderId = Long.valueOf(request.get("orderId").toString());
            String paymentMethod = (String) request.get("paymentMethod");
            String paymentId = (String) request.get("paymentId");

            logger.info("Received request to send order confirmation email for order ID: {}", orderId);

            // Get order details
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (!orderOpt.isPresent()) {
                logger.error("Order not found with ID: {}", orderId);
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Order not found with ID: " + orderId
                ));
            }

            Order order = orderOpt.get();
            
            // Send order confirmation email
            emailService.sendOrderConfirmationEmail(order, paymentMethod, paymentId);
            
            logger.info("Order confirmation email sent successfully for order ID: {}", orderId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order confirmation email sent successfully"
            ));

        } catch (Exception e) {
            logger.error("Error sending order confirmation email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Failed to send order confirmation email: " + e.getMessage()
            ));
        }
    }

    /**
     * Send payment receipt email
     */
    @PostMapping("/send-payment-receipt")
    public ResponseEntity<?> sendPaymentReceiptEmail(@RequestBody Map<String, Object> request) {
        try {
            Long orderId = Long.valueOf(request.get("orderId").toString());
            String paymentMethod = (String) request.get("paymentMethod");
            String paymentId = (String) request.get("paymentId");
            Double paidAmount = Double.valueOf(request.get("paidAmount").toString());

            logger.info("Received request to send payment receipt email for order ID: {}", orderId);

            // Get order details
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (!orderOpt.isPresent()) {
                logger.error("Order not found with ID: {}", orderId);
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Order not found with ID: " + orderId
                ));
            }

            Order order = orderOpt.get();
            
            // Send payment receipt email
            emailService.sendPaymentReceiptEmail(order, paymentId, paymentMethod, paidAmount);
            
            logger.info("Payment receipt email sent successfully for order ID: {}", orderId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment receipt email sent successfully"
            ));

        } catch (Exception e) {
            logger.error("Error sending payment receipt email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Failed to send payment receipt email: " + e.getMessage()
            ));
        }
    }

    /**
     * Send test email
     */
    @PostMapping("/send-test")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, Object> request) {
        try {
            String userEmail = (String) request.get("userEmail");
            
            logger.info("Received request to send test email to: {}", userEmail);

            // Send simple test email using the basic email service
            emailService.sendSimpleMessage(
                userEmail, 
                "Test Email from Grocito", 
                "This is a test email to verify that the email service is working correctly.\n\nTimestamp: " + 
                new java.util.Date().toString()
            );
            
            logger.info("Test email sent successfully to: {}", userEmail);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test email sent successfully"
            ));

        } catch (Exception e) {
            logger.error("Error sending test email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Failed to send test email: " + e.getMessage()
            ));
        }
    }

    /**
     * Send order status update email
     */
    @PostMapping("/send-status-update")
    public ResponseEntity<?> sendOrderStatusUpdateEmail(@RequestBody Map<String, Object> request) {
        try {
            Long orderId = Long.valueOf(request.get("orderId").toString());
            String oldStatus = (String) request.get("oldStatus");
            String newStatus = (String) request.get("newStatus");

            logger.info("Received request to send status update email for order ID: {} ({} -> {})", 
                       orderId, oldStatus, newStatus);

            // Get order details
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (!orderOpt.isPresent()) {
                logger.error("Order not found with ID: {}", orderId);
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Order not found with ID: " + orderId
                ));
            }

            Order order = orderOpt.get();
            
            // Send status update email
            String subject = "Order Status Update - Grocito (Order #" + orderId + ")";
            String message = String.format(
                "Dear %s,\n\n" +
                "Your order #%d status has been updated.\n\n" +
                "Previous Status: %s\n" +
                "New Status: %s\n\n" +
                "Order Details:\n" +
                "- Total Amount: ₹%.2f\n" +
                "- Delivery Address: %s\n\n" +
                "Thank you for choosing Grocito!\n\n" +
                "Best regards,\n" +
                "The Grocito Team",
                order.getUser().getFullName(),
                orderId,
                oldStatus,
                newStatus,
                order.getTotalAmount(),
                order.getDeliveryAddress()
            );

            emailService.sendSimpleMessage(order.getUser().getEmail(), subject, message);
            
            logger.info("Order status update email sent successfully for order ID: {}", orderId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order status update email sent successfully"
            ));

        } catch (Exception e) {
            logger.error("Error sending order status update email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Failed to send order status update email: " + e.getMessage()
            ));
        }
    }
}