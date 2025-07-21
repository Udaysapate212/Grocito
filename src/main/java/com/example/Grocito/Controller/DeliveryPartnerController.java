package com.example.Grocito.Controller;

import com.example.Grocito.Services.DeliveryPartnerService;
import com.example.Grocito.dto.DeliveryPartnerDTO;
import com.example.Grocito.dto.DeliveryPartnerLoginDTO;
import com.example.Grocito.dto.DeliveryPartnerLoginResponseDTO;
import com.example.Grocito.dto.DeliveryPartnerRegistrationDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery-partners")
@CrossOrigin(origins = "*")
public class DeliveryPartnerController {

    @Autowired
    private DeliveryPartnerService deliveryPartnerService;
    
    // Register a new delivery partner
    @PostMapping("/register")
    public ResponseEntity<?> registerDeliveryPartner(@RequestBody DeliveryPartnerRegistrationDTO registrationDTO) {
        try {
            DeliveryPartnerDTO registeredPartner = deliveryPartnerService.registerDeliveryPartner(registrationDTO);
            return new ResponseEntity<>(registeredPartner, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
    
    // Login delivery partner
    @PostMapping("/login")
    public ResponseEntity<?> loginDeliveryPartner(@RequestBody DeliveryPartnerLoginDTO loginDTO) {
        try {
            DeliveryPartnerLoginResponseDTO response = deliveryPartnerService.loginDeliveryPartner(loginDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get delivery partner by ID
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryPartnerDTO> getDeliveryPartnerById(@PathVariable Long id) {
        try {
            DeliveryPartnerDTO partnerDTO = deliveryPartnerService.getDeliveryPartnerById(id);
            return new ResponseEntity<>(partnerDTO, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch delivery partner: " + e.getMessage());
        }
    }
    
    // Update delivery partner profile
    @PutMapping("/{id}/profile")
    public ResponseEntity<DeliveryPartnerDTO> updateDeliveryPartnerProfile(
            @PathVariable Long id, 
            @RequestBody DeliveryPartnerDTO partnerDTO) {
        try {
            DeliveryPartnerDTO updatedPartner = deliveryPartnerService.updateDeliveryPartnerProfile(id, partnerDTO);
            return new ResponseEntity<>(updatedPartner, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile: " + e.getMessage());
        }
    }
    
    // Change password
    @PutMapping("/{id}/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long id, 
            @RequestBody Map<String, String> passwordData) {
        try {
            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                throw new RuntimeException("Old password and new password are required");
            }
            
            deliveryPartnerService.changePassword(id, oldPassword, newPassword);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to change password: " + e.getMessage());
        }
    }
    
    // Update status
    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryPartnerDTO> updateStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusData) {
        try {
            String status = statusData.get("status");
            
            if (status == null) {
                throw new RuntimeException("Status is required");
            }
            
            DeliveryPartnerDTO updatedPartner = deliveryPartnerService.updateStatus(id, status);
            return new ResponseEntity<>(updatedPartner, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update status: " + e.getMessage());
        }
    }
    
    // Get all delivery partners
    @GetMapping
    public ResponseEntity<List<DeliveryPartnerDTO>> getAllDeliveryPartners() {
        try {
            List<DeliveryPartnerDTO> partners = deliveryPartnerService.getAllDeliveryPartners();
            return new ResponseEntity<>(partners, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch delivery partners: " + e.getMessage());
        }
    }
    
    // Get available delivery partners by pincode
    @GetMapping("/available/{pincode}")
    public ResponseEntity<List<DeliveryPartnerDTO>> getAvailableDeliveryPartnersByPincode(@PathVariable String pincode) {
        try {
            List<DeliveryPartnerDTO> partners = deliveryPartnerService.getAvailableDeliveryPartnersByPincode(pincode);
            return new ResponseEntity<>(partners, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch available delivery partners: " + e.getMessage());
        }
    }
    
    // Get assigned orders for a delivery partner
    @GetMapping("/{id}/orders")
    public ResponseEntity<?> getAssignedOrders(@PathVariable Long id) {
        try {
            // This would be implemented with an OrderService
            // For now, return a placeholder response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Order service to be implemented");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch assigned orders: " + e.getMessage());
        }
    }
    
    // Update order status
    @PutMapping("/{partnerId}/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long partnerId,
            @PathVariable Long orderId,
            @RequestBody Map<String, String> statusData) {
        try {
            // This would be implemented with an OrderService
            // For now, return a placeholder response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Order status update service to be implemented");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update order status: " + e.getMessage());
        }
    }
    
    // Exception handler
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleExceptions(RuntimeException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", e.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}