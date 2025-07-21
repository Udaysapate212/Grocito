package com.example.Grocito.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Grocito.Entity.DeliveryPartner;

public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    Optional<DeliveryPartner> findByEmail(String email);
    Optional<DeliveryPartner> findByEmailAndPassword(String email, String password);
}