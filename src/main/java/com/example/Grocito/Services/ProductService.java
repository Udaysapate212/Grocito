package com.example.Grocito.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.Grocito.Entity.Product;
import com.example.Grocito.Repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    // Get products by pincode
    public List<Product> getProductsByPincode(String pincode) {
        return productRepo.findByPincode(pincode);
    }
    
    // Get all products
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }
    
    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepo.findById(id);
    }
    
    // Create new product
    public Product createProduct(Product product) {
        return productRepo.save(product);
    }
    
    // Update existing product
    public Product updateProduct(Product product) {
        return productRepo.save(product);
    }
    
    // Delete product
    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }
    
    // Get products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepo.findByCategory(category);
    }
    
    // Get products by category and pincode
    public List<Product> getProductsByCategoryAndPincode(String category, String pincode) {
        return productRepo.findByCategoryAndPincode(category, pincode);
    }
    
    // Get paginated products by pincode
    public Page<Product> getProductsByPincode(String pincode, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return productRepo.findByPincode(pincode, pageable);
    }
    
    // Get paginated products by category
    public Page<Product> getProductsByCategory(String category, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return productRepo.findByCategory(category, pageable);
    }
    
    // Get paginated products by category and pincode
    public Page<Product> getProductsByCategoryAndPincode(String category, String pincode, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return productRepo.findByCategoryAndPincode(category, pincode, pageable);
    }
    
    // Search products by keyword
    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }
    
    // Search products by keyword and pincode
    public List<Product> searchProductsByPincode(String keyword, String pincode) {
        return productRepo.searchProductsByPincode(keyword, pincode);
    }
    
    // Update product stock
    public Product updateProductStock(Long productId, int newStock) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        product.setStock(newStock);
        return productRepo.save(product);
    }
}

