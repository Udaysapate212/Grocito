package com.example.Grocito.Services;

import com.example.Grocito.Entity.DeliveryPartner;
import com.example.Grocito.Entity.Order;
import com.example.Grocito.Entity.OrderAssignment;
import com.example.Grocito.Repository.DeliveryPartnerRepository;
import com.example.Grocito.Repository.OrderAssignmentRepository;
import com.example.Grocito.Repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderAssignmentService {
    private final Logger logger;
    
    @Autowired
    private OrderAssignmentRepository orderAssignmentRepository;
    
    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private DeliveryPartnerService deliveryPartnerService;
    
    public OrderAssignmentService() {
        this.logger = LoggerFactory.getLogger(OrderAssignmentService.class);
    }
    
    /**
     * Automatically assign order to the best available delivery partner
     */
    public OrderAssignment assignOrderAutomatically(Long orderId) {
        logger.info("Auto-assigning order ID: {}", orderId);
        
        // Get the order
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
        
        Order order = orderOpt.get();
        String orderPincode = order.getPincode();
        
        if (orderPincode == null || orderPincode.trim().isEmpty()) {
            throw new RuntimeException("Order pincode is required for assignment");
        }
        
        // Find available delivery partners for this pincode
        List<DeliveryPartner> availablePartners = deliveryPartnerService.getAvailablePartnersForPincode(orderPincode);
        
        if (availablePartners.isEmpty()) {
            throw new RuntimeException("No available delivery partners found for pincode: " + orderPincode);
        }
        
        // Select the best partner (for now, just pick the first available one)
        // In a real implementation, you would consider factors like:
        // - Distance from pickup location
        // - Current workload
        // - Performance rating
        // - Delivery history
        DeliveryPartner selectedPartner = availablePartners.get(0);
        
        return assignOrderToPartner(orderId, selectedPartner.getId());
    }
    
    /**
     * Manually assign order to a specific delivery partner
     */
    public OrderAssignment assignOrderToPartner(Long orderId, Long partnerId) {
        logger.info("Assigning order ID: {} to partner ID: {}", orderId, partnerId);
        
        // Validate order exists
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
        
        // Validate partner exists and is available
        Optional<DeliveryPartner> partnerOpt = deliveryPartnerRepository.findById(partnerId);
        if (!partnerOpt.isPresent()) {
            throw new RuntimeException("Delivery partner not found with ID: " + partnerId);
        }
        
        DeliveryPartner partner = partnerOpt.get();
        Order order = orderOpt.get();
        
        // Check if partner is available and verified
        if (!partner.getIsAvailable()) {
            throw new RuntimeException("Delivery partner is not available");
        }
        
        if (!"VERIFIED".equals(partner.getVerificationStatus())) {
            throw new RuntimeException("Delivery partner is not verified");
        }
        
        if (!"ACTIVE".equals(partner.getAccountStatus())) {
            throw new RuntimeException("Delivery partner account is not active");
        }
        
        // Check if partner's pincode matches order pincode
        if (!partner.getAssignedPincode().equals(order.getPincode())) {
            throw new RuntimeException("Delivery partner is not assigned to this pincode");
        }
        
        // Check if order is already assigned
        Optional<OrderAssignment> existingAssignment = orderAssignmentRepository.findByOrder_Id(orderId);
        if (existingAssignment.isPresent() && "ASSIGNED".equals(existingAssignment.get().getStatus())) {
            throw new RuntimeException("Order is already assigned to another partner");
        }
        
        // Create new assignment
        OrderAssignment assignment = new OrderAssignment();
        assignment.setOrder(order);
        assignment.setDeliveryPartner(partner);
        assignment.setStatus("ASSIGNED");
        assignment.setAssignedAt(LocalDateTime.now());
        
        OrderAssignment savedAssignment = orderAssignmentRepository.save(assignment);
        
        // Update order status
        order.setStatus("ASSIGNED");
        orderRepository.save(order);
        
        // Update partner availability (make them busy)
        deliveryPartnerService.updateAvailability(partnerId, false, "BUSY");
        
        logger.info("Order assigned successfully - Assignment ID: {}", savedAssignment.getId());
        return savedAssignment;
    }
    
    /**
     * Accept order assignment
     */
    public OrderAssignment acceptOrder(Long assignmentId, Long partnerId) {
        logger.info("Partner ID: {} accepting assignment ID: {}", partnerId, assignmentId);
        
        Optional<OrderAssignment> assignmentOpt = orderAssignmentRepository.findById(assignmentId);
        if (!assignmentOpt.isPresent()) {
            throw new RuntimeException("Assignment not found with ID: " + assignmentId);
        }
        
        OrderAssignment assignment = assignmentOpt.get();
        
        // Validate partner
        if (!assignment.getPartnerId().equals(partnerId)) {
            throw new RuntimeException("Assignment is not for this partner");
        }
        
        if (!"ASSIGNED".equals(assignment.getStatus())) {
            throw new RuntimeException("Assignment is not in ASSIGNED status");
        }
        
        // Update assignment
        assignment.setStatus("ACCEPTED");
        assignment.setAcceptedAt(LocalDateTime.now());
        
        OrderAssignment updatedAssignment = orderAssignmentRepository.save(assignment);
        
        // Update order status
        Optional<Order> orderOpt = orderRepository.findById(assignment.getOrderId());
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus("ACCEPTED");
            orderRepository.save(order);
        }
        
        logger.info("Order accepted successfully");
        return updatedAssignment;
    }
    
    /**
     * Reject order assignment
     */
    public void rejectOrder(Long assignmentId, Long partnerId, String rejectionReason) {
        logger.info("Partner ID: {} rejecting assignment ID: {} with reason: {}", partnerId, assignmentId, rejectionReason);
        
        Optional<OrderAssignment> assignmentOpt = orderAssignmentRepository.findById(assignmentId);
        if (!assignmentOpt.isPresent()) {
            throw new RuntimeException("Assignment not found with ID: " + assignmentId);
        }
        
        OrderAssignment assignment = assignmentOpt.get();
        
        // Validate partner
        if (!assignment.getPartnerId().equals(partnerId)) {
            throw new RuntimeException("Assignment is not for this partner");
        }
        
        if (!"ASSIGNED".equals(assignment.getStatus())) {
            throw new RuntimeException("Assignment is not in ASSIGNED status");
        }
        
        // Update assignment
        assignment.setStatus("REJECTED");
        assignment.setRejectedAt(LocalDateTime.now());
        assignment.setRejectionReason(rejectionReason);
        
        orderAssignmentRepository.save(assignment);
        
        // Make partner available again
        deliveryPartnerService.updateAvailability(partnerId, true, "ONLINE");
        
        // Try to reassign the order to another partner
        try {
            assignOrderAutomatically(assignment.getOrderId());
            logger.info("Order reassigned to another partner");
        } catch (Exception e) {
            logger.warn("Failed to reassign order: {}", e.getMessage());
            // Update order status to indicate assignment failure
            Optional<Order> orderOpt = orderRepository.findById(assignment.getOrderId());
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                order.setStatus("ASSIGNMENT_FAILED");
                orderRepository.save(order);
            }
        }
        
        logger.info("Order rejected successfully");
    }
    
    /**
     * Update order status during delivery
     */
    public OrderAssignment updateOrderStatus(Long assignmentId, Long partnerId, String newStatus) {
        logger.info("Partner ID: {} updating assignment ID: {} to status: {}", partnerId, assignmentId, newStatus);
        
        Optional<OrderAssignment> assignmentOpt = orderAssignmentRepository.findById(assignmentId);
        if (!assignmentOpt.isPresent()) {
            throw new RuntimeException("Assignment not found with ID: " + assignmentId);
        }
        
        OrderAssignment assignment = assignmentOpt.get();
        
        // Validate partner
        if (!assignment.getPartnerId().equals(partnerId)) {
            throw new RuntimeException("Assignment is not for this partner");
        }
        
        // Update assignment status
        assignment.setStatus(newStatus);
        
        // Set specific timestamps based on status
        switch (newStatus) {
            case "PICKED_UP":
                assignment.setPickupTime(LocalDateTime.now());
                break;
            case "DELIVERED":
                assignment.setDeliveryTime(LocalDateTime.now());
                // Calculate delivery duration
                if (assignment.getAcceptedAt() != null) {
                    long durationMinutes = java.time.Duration.between(assignment.getAcceptedAt(), LocalDateTime.now()).toMinutes();
                    assignment.setDeliveryDuration((int) durationMinutes);
                }
                // Make partner available again
                deliveryPartnerService.updateAvailability(partnerId, true, "ONLINE");
                break;
            case "CANCELLED":
                // Make partner available again
                deliveryPartnerService.updateAvailability(partnerId, true, "ONLINE");
                break;
        }
        
        OrderAssignment updatedAssignment = orderAssignmentRepository.save(assignment);
        
        // Update order status
        Optional<Order> orderOpt = orderRepository.findById(assignment.getOrderId());
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            orderRepository.save(order);
        }
        
        logger.info("Order status updated successfully to: {}", newStatus);
        return updatedAssignment;
    }
    
    /**
     * Get assignments for a delivery partner
     */
    public List<OrderAssignment> getPartnerAssignments(Long partnerId, String status) {
        logger.debug("Fetching assignments for partner ID: {} with status: {}", partnerId, status);
        
        if (status != null && !status.isEmpty()) {
            return orderAssignmentRepository.findByStatusAndDeliveryPartnerId(status, partnerId);
        } else {
            return orderAssignmentRepository.findByDeliveryPartnerId(partnerId);
        }
    }
    
    /**
     * Get assignment by order ID
     */
    public Optional<OrderAssignment> getAssignmentByOrderId(Long orderId) {
        return orderAssignmentRepository.findByOrder_Id(orderId);
    }
    
    /**
     * Get all assignments with filtering
     */
    public List<OrderAssignment> getAllAssignments(String status, String pincode) {
        logger.debug("Fetching all assignments with status: {} and pincode: {}", status, pincode);
        
        if (status != null && !status.isEmpty()) {
            return orderAssignmentRepository.findByStatus(status);
        } else {
            return orderAssignmentRepository.findAll();
        }
    }
}