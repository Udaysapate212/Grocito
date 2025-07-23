package com.example.Grocito.Services;

import com.example.Grocito.Entity.Order;
import com.example.Grocito.Entity.Payment;
import com.example.Grocito.Repository.OrderRepository;
import com.example.Grocito.Repository.PaymentRepository;
import com.example.Grocito.config.LoggerConfig;
import com.razorpay.Order.Status;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SignatureException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Formatter;

@Service
public class PaymentService {

    private static final Logger logger = LoggerConfig.getLogger(PaymentService.class);

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Create a Razorpay order
     */
    public Map<String, Object> createRazorpayOrder(double amount, Long orderId, Long userId, String currency) throws RazorpayException {
        logger.info("Creating Razorpay order for amount: {}, orderId: {}", amount, orderId);

        // Find the order in database
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            logger.error("Order not found with ID: {}", orderId);
            throw new RuntimeException("Order not found with ID: " + orderId);
        }

        Order order = orderOpt.get();
        
        // Validate that the order belongs to the user
        if (!order.getUser().getId().equals(userId)) {
            logger.error("Order {} does not belong to user {}", orderId, userId);
            throw new RuntimeException("Order does not belong to this user");
        }

        // Convert amount to paise (Razorpay expects amount in smallest currency unit)
        int amountInPaise = (int) (amount * 100);

        // Initialize Razorpay client
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // Create order request
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", currency != null ? currency : "INR");
        orderRequest.put("receipt", "order_" + orderId);
        orderRequest.put("payment_capture", 1); // Auto capture payment

        // Create order in Razorpay
        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        logger.info("Razorpay order created with ID: {}", razorpayOrder.get("id"));

        // Save payment record in database
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setCurrency(currency != null ? currency : "INR");
        payment.setRazorpayOrderId(razorpayOrder.get("id"));
        payment.setStatus("CREATED");
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Return order details to frontend
        Map<String, Object> response = new HashMap<>();
        response.put("id", razorpayOrder.get("id"));
        response.put("amount", razorpayOrder.get("amount"));
        response.put("currency", razorpayOrder.get("currency"));
        response.put("status", razorpayOrder.get("status"));
        response.put("key", razorpayKeyId);
        response.put("orderId", orderId);
        response.put("amount_due", razorpayOrder.get("amount_due"));
        response.put("receipt", razorpayOrder.get("receipt"));

        return response;
    }

    /**
     * Verify Razorpay payment signature
     */
    public boolean verifyPaymentSignature(String paymentId, String razorpayOrderId, String signature) throws SignatureException {
        logger.info("Verifying payment signature for paymentId: {}, orderId: {}", paymentId, razorpayOrderId);

        // Generate expected signature
        String data = razorpayOrderId + "|" + paymentId;
        String expectedSignature = generateHmacSha256Signature(data, razorpayKeySecret);

        // Compare signatures
        return expectedSignature.equals(signature);
    }

    /**
     * Generate HMAC-SHA256 signature
     */
    private String generateHmacSha256Signature(String data, String key) throws SignatureException {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKeySpec);
            return toHexString(mac.doFinal(data.getBytes()));
        } catch (Exception e) {
            throw new SignatureException("Failed to generate HMAC-SHA256 signature", e);
        }
    }

    /**
     * Convert byte array to hex string
     */
    private String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    /**
     * Update order payment status
     */
    public void updateOrderPaymentStatus(Long orderId, String paymentId, String razorpayOrderId, String status) {
        logger.info("Updating payment status for orderId: {}, paymentId: {}, status: {}", orderId, paymentId, status);

        // Find the order
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            logger.error("Order not found with ID: {}", orderId);
            throw new RuntimeException("Order not found with ID: " + orderId);
        }

        Order order = orderOpt.get();

        // Update payment record
        Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(razorpayOrderId);
        Payment payment = null;
        if (paymentOpt.isPresent()) {
            payment = paymentOpt.get();
            payment.setPaymentId(paymentId);
            payment.setStatus(status);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        } else {
            logger.warn("Payment record not found for razorpayOrderId: {}", razorpayOrderId);
        }

        // Update order status if payment is successful
        if ("PAID".equals(status)) {
            order.setStatus("PLACED");
            orderRepository.save(order);
            
            // Send payment receipt email
            try {
                logger.info("Sending payment receipt email for successful payment - Order ID: {}", orderId);
                emailService.sendPaymentReceiptEmail(
                    order, 
                    paymentId, 
                    "ONLINE", 
                    payment != null ? payment.getAmount() : order.getTotalAmount()
                );
                
                // Also send order confirmation email if not already sent
                emailService.sendOrderConfirmationEmail(order, "ONLINE", paymentId);
                
            } catch (Exception e) {
                logger.warn("Failed to send payment receipt email for order ID: {}: {}", 
                           orderId, e.getMessage());
                // Don't fail the payment process if email fails
            }
        }
    }

    /**
     * Get payment details
     */
    public Map<String, Object> getPaymentDetails(String paymentId) throws RazorpayException {
        logger.info("Fetching payment details for paymentId: {}", paymentId);

        // Initialize Razorpay client
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // Fetch payment from Razorpay
        com.razorpay.Payment payment = razorpayClient.payments.fetch(paymentId);

        // Convert to map
        Map<String, Object> paymentDetails = new HashMap<>();
        paymentDetails.put("id", payment.get("id"));
        paymentDetails.put("amount", payment.get("amount"));
        paymentDetails.put("currency", payment.get("currency"));
        paymentDetails.put("status", payment.get("status"));
        paymentDetails.put("order_id", payment.get("order_id"));
        paymentDetails.put("method", payment.get("method"));
        paymentDetails.put("created_at", payment.get("created_at"));

        return paymentDetails;
    }

    /**
     * Get payment history for a user
     */
    public List<Map<String, Object>> getUserPayments(Long userId) {
        logger.info("Fetching payment history for userId: {}", userId);

        List<Payment> payments = paymentRepository.findByUserId(userId);
        List<Map<String, Object>> paymentHistory = new ArrayList<>();

        for (Payment payment : payments) {
            Map<String, Object> paymentDetails = new HashMap<>();
            paymentDetails.put("id", payment.getId());
            paymentDetails.put("orderId", payment.getOrderId());
            paymentDetails.put("amount", payment.getAmount());
            paymentDetails.put("currency", payment.getCurrency());
            paymentDetails.put("status", payment.getStatus());
            paymentDetails.put("paymentId", payment.getPaymentId());
            paymentDetails.put("razorpayOrderId", payment.getRazorpayOrderId());
            paymentDetails.put("createdAt", payment.getCreatedAt());
            paymentDetails.put("updatedAt", payment.getUpdatedAt());

            paymentHistory.add(paymentDetails);
        }

        return paymentHistory;
    }
}