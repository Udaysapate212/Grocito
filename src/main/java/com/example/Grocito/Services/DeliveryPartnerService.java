package com.example.Grocito.Services;

import com.example.Grocito.Entity.DeliveryPartner;
import com.example.Grocito.Repository.DeliveryPartnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryPartnerService {
    private final Logger logger = LoggerFactory.getLogger(DeliveryPartnerService.class);
    
    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;
    
    public DeliveryPartner registerPartner(DeliveryPartner partner) {
        logger.info("Registering new delivery partner: {}", partner.getFullName());
        
        partner.setVerificationStatus("PENDING");
        partner.setAccountStatus("ACTIVE");
        partner.setAvailabilityStatus("OFFLINE");
        partner.setIsAvailable(false);
        partner.setTotalDeliveries(0);
        partner.setSuccessfulDeliveries(0);
        partner.setAverageRating(0.0);
        partner.setTotalEarnings(0.0);
        partner.setCreatedAt(LocalDateTime.now());
        partner.setUpdatedAt(LocalDateTime.now());
        
        return deliveryPartnerRepository.save(partner);
    }
    
    public List<DeliveryPartner> getAllDeliveryPartners(String userRole, String userPincode) {
        if ("ADMIN".equals(userRole) && userPincode != null) {
            return deliveryPartnerRepository.findByAssignedPincode(userPincode);
        } else {
            return deliveryPartnerRepository.findAll();
        }
    }
    
    public Optional<DeliveryPartner> getDeliveryPartnerById(Long id, String userRole, String userPincode) {
        Optional<DeliveryPartner> partnerOpt = deliveryPartnerRepository.findById(id);
        
        if (partnerOpt.isPresent() && "ADMIN".equals(userRole) && userPincode != null) {
            DeliveryPartner partner = partnerOpt.get();
            if (!userPincode.equals(partner.getAssignedPincode())) {
                return Optional.empty();
            }
        }
        
        return partnerOpt;
    }
    
    public DeliveryPartner updateAvailability(Long partnerId, boolean isAvailable, String availabilityStatus) {
        Optional<DeliveryPartner> partnerOpt = deliveryPartnerRepository.findById(partnerId);
        if (!partnerOpt.isPresent()) {
            throw new RuntimeException("Delivery partner not found with ID: " + partnerId);
        }
        
        DeliveryPartner partner = partnerOpt.get();
        partner.setIsAvailable(isAvailable);
        partner.setAvailabilityStatus(availabilityStatus);
        partner.setLastActiveAt(LocalDateTime.now());
        partner.setUpdatedAt(LocalDateTime.now());
        
        return deliveryPartnerRepository.save(partner);
    }
    
    public List<DeliveryPartner> getAvailablePartnersForPincode(String pincode) {
        return deliveryPartnerRepository
                .findByAssignedPincodeAndIsAvailableTrueAndVerificationStatusAndAccountStatus(
                        pincode, "VERIFIED", "ACTIVE");
    }
}
