package com.example.Grocito.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Grocito.Entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}

