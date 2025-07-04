package com.example.Grocito.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Grocito.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPincode(String pincode);
}

