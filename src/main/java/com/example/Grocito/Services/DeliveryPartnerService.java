package com.example.Grocito.Services;

import com.example.Grocito.Entity.DeliveryPartner;
import com.example.Grocito.Entity.Order;
import com.example.Grocito.Repository.DeliveryPartnerRepository;
import com.example.Grocito.dto.DeliveryPartnerDTO;
import com.example.Grocito.dto.DeliveryPartnerLoginDTO;
import com.example.Grocito.dto.DeliveryPartnerLoginResponseDTO;
import com.example.Grocito.dto.DeliveryPartnerRegistrationDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DeliveryPartnerService {

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;
    
    // Register a new delivery partner
    public DeliveryPartnerDTO registerDeliveryPartner(DeliveryPartnerRegistrationDTO registrationDTO) {
        // Check if email already exists
        if (deliveryPartnerRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        // Create new delivery partner
        DeliveryPartner deliveryPartner = new DeliveryPartner();
        deliveryPartner.setFullName(registrationDTO.getFullName());
        deliveryPartner.setEmail(registrationDTO.getEmail());
        deliveryPartner.setPassword(registrationDTO.getPassword()); // Store password as plain text
        deliveryPartner.setContactNumber(registrationDTO.getContactNumber());
        deliveryPartner.setAddress(registrationDTO.getAddress());
        deliveryPartner.setPincode(registrationDTO.getPincode());
        deliveryPartner.setRegisteredDate(LocalDateTime.now());
        deliveryPartner.setActive(true);
        deliveryPartner.setStatus("OFFLINE");
        
        // Save to database
        DeliveryPartner savedPartner = deliveryPartnerRepository.save(deliveryPartner);
        
        // Convert to DTO and return
        return convertToDTO(savedPartner);
    }
    
    // Login delivery partner
    public DeliveryPartnerLoginResponseDTO loginDeliveryPartner(DeliveryPartnerLoginDTO loginDTO) {
        // Find delivery partner by email
        DeliveryPartner deliveryPartner = deliveryPartnerRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Check password (plain text comparison)
        if (!loginDTO.getPassword().equals(deliveryPartner.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Check if account is active
        if (!deliveryPartner.isActive()) {
            throw new RuntimeException("Account is deactivated. Please contact support.");
        }
        
        // Generate token (in a real application, use JWT or other token mechanism)
        String token = generateToken(deliveryPartner);
        
        // Return login response
        return new DeliveryPartnerLoginResponseDTO(token, convertToDTO(deliveryPartner));
    }
    
    // Get delivery partner by ID
    public DeliveryPartnerDTO getDeliveryPartnerById(Long id) {
        DeliveryPartner deliveryPartner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery partner not found"));
        
        return convertToDTO(deliveryPartner);
    }
    
    // Update delivery partner profile
    public DeliveryPartnerDTO updateDeliveryPartnerProfile(Long id, DeliveryPartnerDTO partnerDTO) {
        DeliveryPartner deliveryPartner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery partner not found"));
        
        // Update fields
        deliveryPartner.setFullName(partnerDTO.getFullName());
        deliveryPartner.setContactNumber(partnerDTO.getContactNumber());
        deliveryPartner.setAddress(partnerDTO.getAddress());
        deliveryPartner.setPincode(partnerDTO.getPincode());
        
        // Save updated partner
        DeliveryPartner updatedPartner = deliveryPartnerRepository.save(deliveryPartner);
        
        return convertToDTO(updatedPartner);
    }
    
    // Change delivery partner password
    public void changePassword(Long id, String oldPassword, String newPassword) {
        DeliveryPartner deliveryPartner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery partner not found"));
        
        // Verify old password (plain text comparison)
        if (!oldPassword.equals(deliveryPartner.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update password (store as plain text)
        deliveryPartner.setPassword(newPassword);
        deliveryPartnerRepository.save(deliveryPartner);
    }
    
    // Update delivery partner status
    public DeliveryPartnerDTO updateStatus(Long id, String status) {
        DeliveryPartner deliveryPartner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery partner not found"));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid status. Must be ACTIVE, OFFLINE, or BUSY");
        }
        
        // Update status
        deliveryPartner.setStatus(status);
        DeliveryPartner updatedPartner = deliveryPartnerRepository.save(deliveryPartner);
        
        return convertToDTO(updatedPartner);
    }
    
    // Get all delivery partners
    public List<DeliveryPartnerDTO> getAllDeliveryPartners() {
        return deliveryPartnerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get available delivery partners by pincode
    public List<DeliveryPartnerDTO> getAvailableDeliveryPartnersByPincode(String pincode) {
        return deliveryPartnerRepository.findByPincodeAndStatusAndIsActiveTrue(pincode, "ACTIVE").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Helper method to convert Entity to DTO
    private DeliveryPartnerDTO convertToDTO(DeliveryPartner deliveryPartner) {
        return new DeliveryPartnerDTO(
                deliveryPartner.getId(),
                deliveryPartner.getFullName(),
                deliveryPartner.getEmail(),
                deliveryPartner.getContactNumber(),
                deliveryPartner.getAddress(),
                deliveryPartner.getPincode(),
                deliveryPartner.getRegisteredDate(),
                deliveryPartner.isActive(),
                deliveryPartner.getStatus()
        );
    }
    
    // Helper method to validate status
    private boolean isValidStatus(String status) {
        return status != null && (status.equals("ACTIVE") || status.equals("OFFLINE") || status.equals("BUSY"));
    }
    
    // Helper method to generate token (in a real application, use JWT)
    private String generateToken(DeliveryPartner deliveryPartner) {
        // This is a simple token generation for demonstration
        // In a real application, use JWT or other secure token mechanism
        return "dp-token-" + deliveryPartner.getId() + "-" + System.currentTimeMillis();
    }
}