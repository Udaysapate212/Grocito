package com.example.Grocito.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.DeliveryPartner;
import com.example.Grocito.Entity.Order;
import com.example.Grocito.Repository.DeliveryPartnerRepository;
import com.example.Grocito.Repository.OrderRepository;

@Service
public class DeliveryPartnerService {

    private static final Logger logger = LoggerConfig.getLogger(DeliveryPartnerService.class);

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepo;
    
    @Autowired
    private OrderRepository orderRepo;
    
    @Autowired
    private EmailService emailService;

    // Register a new delivery partner
    public DeliveryPartner register(DeliveryPartner deliveryPartner) {
        logger.debug("Attempting to register new delivery partner with email: {}", deliveryPartner.getEmail());
        
        // Check if email already exists
        if (deliveryPartnerRepo.findByEmail(deliveryPartner.getEmail()).isPresent()) {
            logger.warn("Registration failed: Email already registered: {}", deliveryPartner.getEmail());
            throw new RuntimeException("Email already registered");
        }
        
        // Set registration date and active status
        deliveryPartner.setRegisteredDate(LocalDate.now());
        deliveryPartner.setActive(true);
        
        DeliveryPartner savedPartner = deliveryPartnerRepo.save(deliveryPartner);
        logger.info("Delivery partner registered successfully with ID: {}", savedPartner.getId());
        return savedPartner;
    }

    // Login delivery partner
    public Optional<DeliveryPartner> login(String email, String password) {
        logger.debug("Attempting login for delivery partner: {}", email);
        Optional<DeliveryPartner> partner = deliveryPartnerRepo.findByEmailAndPassword(email, password);
        
        if (partner.isPresent()) {
            logger.info("Delivery partner logged in successfully: {}", email);
        } else {
            logger.warn("Login failed for delivery partner: {}", email);
        }
        
        return partner;
    }
    
    // Get delivery partner by ID
    public Optional<DeliveryPartner> getDeliveryPartnerById(Long id) {
        logger.debug("Fetching delivery partner with ID: {}", id);
        Optional<DeliveryPartner> partner = deliveryPartnerRepo.findById(id);
        
        if (partner.isPresent()) {
            logger.debug("Found delivery partner: {}", partner.get().getEmail());
        } else {
            logger.debug("Delivery partner not found with ID: {}", id);
        }
        
        return partner;
    }
    
    // Get delivery partner by email
    public Optional<DeliveryPartner> getDeliveryPartnerByEmail(String email) {
        logger.debug("Fetching delivery partner with email: {}", email);
        Optional<DeliveryPartner> partner = deliveryPartnerRepo.findByEmail(email);
        
        if (partner.isPresent()) {
            logger.debug("Found delivery partner with email: {}", email);
        } else {
            logger.debug("Delivery partner not found with email: {}", email);
        }
        
        return partner;
    }
    
    // Update delivery partner profile
    public DeliveryPartner updateProfile(Long partnerId, DeliveryPartner updatedPartner) {
        logger.info("Updating profile for delivery partner ID: {}", partnerId);
        
        DeliveryPartner existingPartner = deliveryPartnerRepo.findById(partnerId)
                .orElseThrow(() -> {
                    logger.error("Profile update failed: Delivery partner not found with ID: {}", partnerId);
                    return new RuntimeException("Delivery partner not found with id: " + partnerId);
                });
        
        logger.debug("Found delivery partner to update: {}", existingPartner.getEmail());
        
        // Update fields that are allowed to be updated
        if (updatedPartner.getFullName() != null && !updatedPartner.getFullName().trim().isEmpty()) {
            logger.debug("Updating full name for delivery partner: {}", existingPartner.getEmail());
            existingPartner.setFullName(updatedPartner.getFullName().trim());
        }
        
        if (updatedPartner.getAddress() != null) {
            logger.debug("Updating address for delivery partner: {}", existingPartner.getEmail());
            existingPartner.setAddress(updatedPartner.getAddress().trim());
        }
        
        if (updatedPartner.getPincode() != null) {
            logger.debug("Updating pincode for delivery partner: {}", existingPartner.getEmail());
            existingPartner.setPincode(updatedPartner.getPincode().trim());
        }
        
        if (updatedPartner.getContactNumber() != null) {
            logger.debug("Updating contact number for delivery partner: {}", existingPartner.getEmail());
            existingPartner.setContactNumber(updatedPartner.getContactNumber().trim());
        }
        
        // Don't allow email change through this method for security reasons
        
        return deliveryPartnerRepo.save(existingPartner);
    }
    
    // Change password
    public DeliveryPartner changePassword(Long partnerId, String oldPassword, String newPassword) {
        DeliveryPartner partner = deliveryPartnerRepo.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Delivery partner not found with id: " + partnerId));
        
        // Verify old password
        if (!partner.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Incorrect password");
        }
        
        partner.setPassword(newPassword);
        return deliveryPartnerRepo.save(partner);
    }
    
    // Get all delivery partners
    public List<DeliveryPartner> getAllDeliveryPartners() {
        return deliveryPartnerRepo.findAll();
    }
    
    // Delete delivery partner
    public void deleteDeliveryPartner(Long partnerId) {
        if (!deliveryPartnerRepo.existsById(partnerId)) {
            throw new RuntimeException("Delivery partner not found with id: " + partnerId);
        }
        deliveryPartnerRepo.deleteById(partnerId);
    }
    
    // Send welcome email after registration
    public void sendWelcomeEmail(DeliveryPartner partner) {
        logger.info("Sending welcome email to delivery partner: {}", partner.getEmail());
        emailService.sendWelcomeEmail(partner.getEmail(), partner.getFullName());
    }
    
    // Generate a random temporary password
    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        
        // Generate a password of length 10
        for (int i = 0; i < 10; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        
        return sb.toString();
    }
    
    // Reset password and send email with temporary password
    public void resetPassword(String email) {
        logger.info("Password reset requested for delivery partner email: {}", email);
        
        DeliveryPartner partner = deliveryPartnerRepo.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Password reset failed: Delivery partner not found with email: {}", email);
                    return new RuntimeException("Delivery partner not found with email: " + email);
                });
        
        // Generate temporary password
        String temporaryPassword = generateTemporaryPassword();
        
        // Update partner's password
        partner.setPassword(temporaryPassword);
        deliveryPartnerRepo.save(partner);
        
        // Send email with temporary password
        emailService.sendPasswordResetEmail(partner.getEmail(), partner.getFullName(), temporaryPassword);
        
        logger.info("Password reset successful for delivery partner: {}", email);
    }
    
    // Get assigned orders for a delivery partner
    public List<Order> getAssignedOrders(Long partnerId) {
        // Check if partner exists
        if (!deliveryPartnerRepo.existsById(partnerId)) {
            throw new RuntimeException("Delivery partner not found with id: " + partnerId);
        }
        
        // Use the repository method to find orders by delivery partner ID
        return orderRepo.findByDeliveryPartnerId(partnerId);
    }
    
    // Get orders by status for a delivery partner
    public List<Order> getOrdersByStatus(Long partnerId, String status) {
        // Check if partner exists
        if (!deliveryPartnerRepo.existsById(partnerId)) {
            throw new RuntimeException("Delivery partner not found with id: " + partnerId);
        }
        
        // Use the repository method to find orders by delivery partner ID and status
        return orderRepo.findByDeliveryPartnerIdAndStatus(partnerId, status);
    }
    
    // Update order status
    public Order updateOrderStatus(Long partnerId, Long orderId, String newStatus) {
        DeliveryPartner partner = deliveryPartnerRepo.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Delivery partner not found with id: " + partnerId));
        
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        // Verify that this order is assigned to this delivery partner
        if (order.getDeliveryPartner() == null || !order.getDeliveryPartner().getId().equals(partnerId)) {
            throw new RuntimeException("This order is not assigned to this delivery partner");
        }
        
        // Update status based on the new status
        switch (newStatus) {
            case "OUT_FOR_DELIVERY":
                order.setStatus(newStatus);
                break;
            case "DELIVERED":
                order.setStatus(newStatus);
                order.setDeliveredTime(LocalDateTime.now());
                break;
            default:
                throw new RuntimeException("Invalid status update: " + newStatus);
        }
        
        return orderRepo.save(order);
    }
}