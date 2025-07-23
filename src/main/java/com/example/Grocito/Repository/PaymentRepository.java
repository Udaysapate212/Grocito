package com.example.Grocito.Repository;

import com.example.Grocito.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUserId(Long userId);
    
    List<Payment> findByOrderId(Long orderId);
    
    Optional<Payment> findByPaymentId(String paymentId);
    
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}