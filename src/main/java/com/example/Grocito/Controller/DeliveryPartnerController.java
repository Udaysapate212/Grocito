package com.example.Grocito.Controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.DeliveryPartner;
import com.example.Grocito.Entity.Order;
import com.example.Grocito.Services.DeliveryPartnerService;

@RestController
@RequestMapping("/api/delivery-partners")
@CrossOrigin(origins = "*")
public class DeliveryPartnerController {

    private static final Logger logger = LoggerConfig.getLogger(DeliveryPartnerController.class);

    @Autowired
    private DeliveryPartnerService deliveryPartnerService;

    // Register a new delivery partner
    @PostMapping("/register")
    public ResponseEntity<?> registerDeliveryPartner(@RequestBody DeliveryPartner deliveryPartner) {
        logger.info("Received delivery partner registration request for email: {}", deliveryPartner.getEmail());
        try {
            // Validate required fields
            if (deliveryPartner.getEmail() == null || deliveryPartner.getEmail().trim().isEmpty()) {
                logger.warn("Registration failed: Email is required");
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            if (deliveryPartner.getPassword() == null || deliveryPartner.getPassword().trim().isEmpty()) {
                logger.warn("Registration failed: Password is required");
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            if (deliveryPartner.getFullName() == null || deliveryPartner.getFullName().trim().isEmpty()) {
                logger.warn("Registration failed: Full name is required");
                return ResponseEntity.badRequest().body("Full name is required");
            }
            
            if (deliveryPartner.getContactNumber() == null || deliveryPartner.getContactNumber().trim().isEmpty()) {
                logger.warn("Registration failed: Contact number is required");
                return ResponseEntity.badRequest().body("Contact number is required");
            }
            
            // Trim input fields
            deliveryPartner.setEmail(deliveryPartner.getEmail().trim());
            deliveryPartner.setFullName(deliveryPartner.getFullName().trim());
            deliveryPartner.setContactNumber(deliveryPartner.getContactNumber().trim());
            if (deliveryPartner.getAddress() != null) deliveryPartner.setAddress(deliveryPartner.getAddress().trim());
            if (deliveryPartner.getPincode() != null) deliveryPartner.setPincode(deliveryPartner.getPincode().trim());
            
            logger.debug("Attempting to register delivery partner with email: {}", deliveryPartner.getEmail());
            DeliveryPartner registeredPartner = deliveryPartnerService.register(deliveryPartner);
            
            // Send welcome email
            deliveryPartnerService.sendWelcomeEmail(registeredPartner);
            
            logger.info("Delivery partner registered successfully with ID: {}", registeredPartner.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredPartner);
        } catch (RuntimeException e) {
            logger.error("Registration failed for email: {}, error: {}", deliveryPartner.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Login delivery partner
    @PostMapping("/login")
    public ResponseEntity<?> loginDeliveryPartner(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        logger.info("Delivery partner login attempt for user: {}", email);
        String password = data.get("password");
        
        return deliveryPartnerService.login(email, password)
                .<ResponseEntity<?>>map(partner -> {
                    logger.info("Delivery partner logged in successfully: {}", email);
                    return ResponseEntity.ok(partner);
                })
                .orElseGet(() -> {
                    logger.warn("Failed delivery partner login attempt for user: {}", email);
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                });
    }
    
    // Get delivery partner by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDeliveryPartnerById(@PathVariable Long id) {
        logger.info("Fetching delivery partner with ID: {}", id);
        return deliveryPartnerService.getDeliveryPartnerById(id)
                .map(partner -> {
                    logger.debug("Found delivery partner: {}", partner.getEmail());
                    return ResponseEntity.ok(partner);
                })
                .orElseGet(() -> {
                    logger.warn("Delivery partner not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    // Update delivery partner profile
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateDeliveryPartnerProfile(@PathVariable Long id, @RequestBody DeliveryPartner partner) {
        try {
            // Validate that at least one field is being updated
            if ((partner.getFullName() == null || partner.getFullName().trim().isEmpty()) && 
                (partner.getAddress() == null || partner.getAddress().trim().isEmpty()) && 
                (partner.getPincode() == null || partner.getPincode().trim().isEmpty()) && 
                (partner.getContactNumber() == null || partner.getContactNumber().trim().isEmpty())) {
                return ResponseEntity.badRequest().body("At least one field (fullName, address, pincode, or contactNumber) must be provided for update");
            }
            
            // Trim input fields if they are not null
            if (partner.getFullName() != null) partner.setFullName(partner.getFullName().trim());
            if (partner.getAddress() != null) partner.setAddress(partner.getAddress().trim());
            if (partner.getPincode() != null) partner.setPincode(partner.getPincode().trim());
            if (partner.getContactNumber() != null) partner.setContactNumber(partner.getContactNumber().trim());
            
            DeliveryPartner updatedPartner = deliveryPartnerService.updateProfile(id, partner);
            return ResponseEntity.ok(updatedPartner);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Change delivery partner password
    @PutMapping("/{id}/password")
    public ResponseEntity<?> changeDeliveryPartnerPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwords) {
        try {
            String oldPassword = passwords.get("oldPassword");
            String newPassword = passwords.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Both old and new passwords are required");
            }
            
            DeliveryPartner partner = deliveryPartnerService.changePassword(id, oldPassword, newPassword);
            return ResponseEntity.ok(partner);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    // Get all delivery partners (admin function)
    @GetMapping
    public ResponseEntity<List<DeliveryPartner>> getAllDeliveryPartners() {
        logger.info("Fetching all delivery partners");
        List<DeliveryPartner> deliveryPartners = deliveryPartnerService.getAllDeliveryPartners();
        return ResponseEntity.ok(deliveryPartners);
    }
    
    // Get assigned orders for a delivery partner
    @GetMapping("/{id}/orders")
    public ResponseEntity<?> getAssignedOrders(@PathVariable Long id) {
        try {
            List<Order> orders = deliveryPartnerService.getAssignedOrders(id);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Update order status
    @PutMapping("/{partnerId}/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long partnerId,
            @PathVariable Long orderId,
            @RequestBody Map<String, String> statusData) {
        try {
            String newStatus = statusData.get("status");
            if (newStatus == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }
            
            Order updatedOrder = deliveryPartnerService.updateOrderStatus(partnerId, orderId, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    // Forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        logger.info("Received forgot password request for delivery partner email: {}", email);
        
        if (email == null || email.trim().isEmpty()) {
            logger.warn("Forgot password failed: Email is required");
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        try {
            deliveryPartnerService.resetPassword(email.trim());
            logger.info("Password reset email sent to delivery partner: {}", email);
            return ResponseEntity.ok().body("Password reset email sent successfully");
        } catch (RuntimeException e) {
            logger.error("Forgot password failed for delivery partner email: {}, error: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}