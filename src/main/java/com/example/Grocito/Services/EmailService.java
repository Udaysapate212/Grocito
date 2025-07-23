package com.example.Grocito.Services;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Grocito.Entity.Order;
import com.example.Grocito.Entity.OrderItem;
import com.example.Grocito.config.LoggerConfig;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class EmailService {

    private static final Logger logger = LoggerConfig.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${email.service.url:http://localhost:3001}")
    private String emailServiceUrl;

    /**
     * Send a simple email message
     * 
     * @param to      Recipient email address
     * @param subject Email subject
     * @param text    Email body text
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        logger.info("Sending email to: {}", to);
        logger.debug("Email subject: {}", subject);
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("codercompete@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            emailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}, error: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Send welcome email to newly registered user
     * 
     * @param to       User's email address
     * @param fullName User's full name
     */
    public void sendWelcomeEmail(String to, String fullName) {
        String subject = "Welcome to Grocito!";
        String text = "Dear " + fullName + ",\n\n"
                + "Welcome to Grocito! We're excited to have you on board.\n\n"
                + "With Grocito, you can:\n"
                + "- Browse and order groceries based on your location\n"
                + "- Track your orders in real-time\n"
                + "- Enjoy fast delivery to your doorstep\n\n"
                + "If you have any questions or need assistance, please don't hesitate to contact our support team.\n\n"
                + "Happy shopping!\n\n"
                + "The Grocito Team";
        
        sendSimpleMessage(to, subject, text);
    }

    /**
     * Send password reset email with temporary password
     * 
     * @param to              User's email address
     * @param fullName        User's full name
     * @param temporaryPassword Temporary password
     */
    public void sendPasswordResetEmail(String to, String fullName, String temporaryPassword) {
        String subject = "Grocito - Password Reset";
        String text = "Dear " + fullName + ",\n\n"
                + "We received a request to reset your password for your Grocito account.\n\n"
                + "Your temporary password is: " + temporaryPassword + "\n\n"
                + "Please use this temporary password to log in, and then change your password immediately for security reasons.\n\n"
                + "If you did not request a password reset, please contact our support team immediately.\n\n"
                + "Thank you,\n"
                + "The Grocito Team";
        
        sendSimpleMessage(to, subject, text);
    }

    /**
     * Send order confirmation email using the Node.js email service
     * 
     * @param order Order object containing order details
     * @param paymentMethod Payment method used (COD, ONLINE, etc.)
     * @param paymentId Payment ID if online payment
     */
    public void sendOrderConfirmationEmail(Order order, String paymentMethod, String paymentId) {
        logger.info("Sending order confirmation email for order ID: {} to user: {}", 
                   order.getId(), order.getUser().getEmail());
        
        try {
            // Prepare order data for email service
            Map<String, Object> orderData = prepareOrderData(order);
            Map<String, Object> paymentInfo = preparePaymentInfo(paymentMethod, paymentId, order.getTotalAmount());
            
            // Prepare request payload
            Map<String, Object> emailRequest = new HashMap<>();
            emailRequest.put("orderData", orderData);
            emailRequest.put("paymentInfo", paymentInfo);
            emailRequest.put("userEmail", order.getUser().getEmail());
            
            // Send request to email service
            sendEmailServiceRequest("/api/email/send-order-confirmation", emailRequest);
            
            logger.info("Order confirmation email sent successfully for order ID: {}", order.getId());
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email for order ID: {}: {}", 
                        order.getId(), e.getMessage());
            // Don't throw exception to avoid breaking the order flow
        }
    }

    /**
     * Send payment receipt email using the Node.js email service
     * 
     * @param order Order object containing order details
     * @param paymentId Payment ID from payment gateway
     * @param paymentMethod Payment method used
     * @param paidAmount Amount paid
     */
    public void sendPaymentReceiptEmail(Order order, String paymentId, String paymentMethod, Double paidAmount) {
        logger.info("Sending payment receipt email for order ID: {} to user: {}", 
                   order.getId(), order.getUser().getEmail());
        
        try {
            // Prepare order data for email service
            Map<String, Object> orderData = prepareOrderData(order);
            Map<String, Object> paymentInfo = preparePaymentInfo(paymentMethod, paymentId, paidAmount);
            
            // Prepare request payload
            Map<String, Object> emailRequest = new HashMap<>();
            emailRequest.put("orderData", orderData);
            emailRequest.put("paymentInfo", paymentInfo);
            emailRequest.put("userEmail", order.getUser().getEmail());
            
            // Send request to email service
            sendEmailServiceRequest("/api/email/send-payment-receipt", emailRequest);
            
            logger.info("Payment receipt email sent successfully for order ID: {}", order.getId());
        } catch (Exception e) {
            logger.error("Failed to send payment receipt email for order ID: {}: {}", 
                        order.getId(), e.getMessage());
            // Don't throw exception to avoid breaking the payment flow
        }
    }

    /**
     * Prepare order data for email service
     */
    private Map<String, Object> prepareOrderData(Order order) {
        Map<String, Object> orderData = new HashMap<>();
        
        // Order details
        Map<String, Object> orderDetails = new HashMap<>();
        orderDetails.put("id", order.getId());
        orderDetails.put("orderTime", order.getOrderTime().toString());
        orderDetails.put("status", order.getStatus());
        orderDetails.put("totalAmount", order.getTotalAmount());
        orderDetails.put("deliveryAddress", order.getDeliveryAddress());
        orderDetails.put("pincode", order.getPincode());
        
        // Order items
        List<Map<String, Object>> items = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
            Map<String, Object> itemData = new HashMap<>();
            itemData.put("name", item.getProduct().getName());
            itemData.put("quantity", item.getQuantity());
            itemData.put("price", item.getPrice());
            
            // Product details
            Map<String, Object> productData = new HashMap<>();
            productData.put("name", item.getProduct().getName());
            productData.put("price", item.getProduct().getPrice());
            itemData.put("product", productData);
            
            items.add(itemData);
        }
        orderDetails.put("items", items);
        
        // User details
        Map<String, Object> userData = new HashMap<>();
        userData.put("fullName", order.getUser().getFullName());
        userData.put("name", order.getUser().getFullName());
        userData.put("email", order.getUser().getEmail());
        userData.put("pincode", order.getUser().getPincode());
        
        orderData.put("order", orderDetails);
        orderData.put("user", userData);
        
        return orderData;
    }

    /**
     * Prepare payment info for email service
     */
    private Map<String, Object> preparePaymentInfo(String paymentMethod, String paymentId, Double amount) {
        Map<String, Object> paymentInfo = new HashMap<>();
        paymentInfo.put("paymentMethod", paymentMethod != null ? paymentMethod : "COD");
        paymentInfo.put("paymentId", paymentId);
        paymentInfo.put("paidAmount", amount);
        return paymentInfo;
    }

    /**
     * Send request to email service
     */
    private void sendEmailServiceRequest(String endpoint, Map<String, Object> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            
            String url = emailServiceUrl + endpoint;
            logger.debug("Sending email request to: {}", url);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.debug("Email service responded successfully: {}", response.getBody());
            } else {
                logger.warn("Email service returned non-success status: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error communicating with email service: {}", e.getMessage());
            throw new RuntimeException("Email service communication failed: " + e.getMessage());
        }
    }
}