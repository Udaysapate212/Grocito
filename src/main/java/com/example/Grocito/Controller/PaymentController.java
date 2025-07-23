package com.example.Grocito.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Services.PaymentService;
import com.example.Grocito.dto.OrderRequest;
import com.example.Grocito.dto.PaymentVerificationRequest;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger logger = LoggerConfig.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a Razorpay order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        logger.info("Received request to create Razorpay order for amount: {}, orderId: {}, userId: {}", 
                orderRequest.getAmount(), orderRequest.getOrderId(), orderRequest.getUserId());
        
        try {
            Map<String, Object> order = paymentService.createRazorpayOrder(
                orderRequest.getAmount(), 
                orderRequest.getOrderId(), 
                orderRequest.getUserId(),
                orderRequest.getCurrency()
            );
            
            logger.info("Razorpay order created successfully with ID: {}", order.get("id"));
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Failed to create Razorpay order: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create payment order: " + e.getMessage());
        }
    }

    /**
     * Verify Razorpay payment
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        logger.info("Received payment verification request for paymentId: {}, orderId: {}", 
                request.getPaymentId(), request.getOrderId());
        
        try {
            boolean isValid = paymentService.verifyPaymentSignature(
                request.getPaymentId(),
                request.getOrderId(),
                request.getSignature()
            );
            
            if (isValid) {
                logger.info("Payment verification successful for paymentId: {}", request.getPaymentId());
                
                // Update order status in database
                paymentService.updateOrderPaymentStatus(
                    request.getMerchantOrderId(),
                    request.getPaymentId(),
                    request.getOrderId(),
                    "PAID"
                );
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment verified successfully",
                    "orderId", request.getMerchantOrderId()
                ));
            } else {
                logger.warn("Payment verification failed for paymentId: {}", request.getPaymentId());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                            "success", false,
                            "message", "Payment verification failed"
                        ));
            }
        } catch (Exception e) {
            logger.error("Error during payment verification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Payment verification error: " + e.getMessage()
                    ));
        }
    }
    
    /**
     * Get payment details
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPaymentDetails(@PathVariable String paymentId) {
        logger.info("Fetching payment details for paymentId: {}", paymentId);
        
        try {
            Map<String, Object> paymentDetails = paymentService.getPaymentDetails(paymentId);
            logger.info("Payment details fetched successfully for paymentId: {}", paymentId);
            return ResponseEntity.ok(paymentDetails);
        } catch (Exception e) {
            logger.error("Failed to fetch payment details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch payment details: " + e.getMessage());
        }
    }
    
    /**
     * Get payment history for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPayments(@PathVariable Long userId) {
        logger.info("Fetching payment history for userId: {}", userId);
        
        try {
            var payments = paymentService.getUserPayments(userId);
            logger.info("Found {} payments for userId: {}", payments.size(), userId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            logger.error("Failed to fetch user payments: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch payment history: " + e.getMessage());
        }
    }
}