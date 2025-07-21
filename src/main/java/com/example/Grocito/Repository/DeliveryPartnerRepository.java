package com.example.Grocito.Repository;

import com.example.Grocito.Entity.DeliveryPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    
    Optional<DeliveryPartner> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<DeliveryPartner> findByPincodeAndIsActiveTrue(String pincode);
    
    List<DeliveryPartner> findByStatusAndIsActiveTrue(String status);
    
    List<DeliveryPartner> findByPincodeAndStatusAndIsActiveTrue(String pincode, String status);
}