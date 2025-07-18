package com.example.Grocito.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.Grocito.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPincode(String pincode);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByCategoryAndPincode(String category, String pincode);
    
    Page<Product> findByPincode(String pincode, Pageable pageable);
    
    Page<Product> findByCategory(String category, Pageable pageable);
    
    Page<Product> findByCategoryAndPincode(String category, String pincode, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    @Query("SELECT p FROM Product p WHERE (p.name LIKE %:keyword% OR p.description LIKE %:keyword%) AND p.pincode = :pincode")
    List<Product> searchProductsByPincode(@Param("keyword") String keyword, @Param("pincode") String pincode);
}

