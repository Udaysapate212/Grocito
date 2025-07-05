package com.example.Grocito.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Grocito.Entity.Order;
import com.example.Grocito.Entity.OrderItem;
import com.example.Grocito.Entity.User;
import com.example.Grocito.Repository.OrderRepository;
import com.example.Grocito.Repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private UserRepository userRepo;

    public Order placeOrder(Order order) {
        order.setOrderTime(LocalDateTime.now());

        User user = userRepo.findById(order.getUser().getId())
                            .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }

        return orderRepo.save(order);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepo.findByUserId(userId);
    }
}
