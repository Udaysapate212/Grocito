package com.example.Grocito.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Grocito.Entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByPincode(String pincode);
    List<Order> findByStatus(String status);
    List<Order> findByPincodeAndStatus(String pincode, String status);
    
    // Additional query methods for enhanced filtering
    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE o.pincode = :pincode ORDER BY o.orderTime DESC")
    List<Order> findByPincodeOrderByOrderTimeDesc(@org.springframework.data.repository.query.Param("pincode") String pincode);
    
    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.orderTime DESC")
    List<Order> findByStatusOrderByOrderTimeDesc(@org.springframework.data.repository.query.Param("status") String status);
}

