package com.example.Grocito.Services;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.Product;
import com.example.Grocito.Repository.ProductRepository;

@Service
public class ProductService {

    private static final Logger logger = LoggerConfig.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepo;

    // Get products by pincode
    public List<Product> getProductsByPincode(String pincode) {
        logger.debug("Fetching products for pincode: {}", pincode);
        List<Product> products = productRepo.findByPincode(pincode);
        logger.debug("Found {} products for pincode: {}", products.size(), pincode);
        return products;
    }
    
    // Get all products
    public List<Product> getAllProducts() {
        logger.debug("Fetching all products");
        List<Product> products = productRepo.findAll();
        logger.debug("Found {} total products", products.size());
        return products;
    }
    
    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        logger.debug("Fetching product with ID: {}", id);
        Optional<Product> product = productRepo.findById(id);
        if (product.isPresent()) {
            logger.debug("Found product: {} (ID: {})", product.get().getName(), id);
        } else {
            logger.debug("Product not found with ID: {}", id);
        }
        return product;
    }
    
    // Create new product
    public Product createProduct(Product product) {
        logger.info("Creating new product: {}", product.getName());
        Product savedProduct = productRepo.save(product);
        logger.info("Product created successfully with ID: {}", savedProduct.getId());
        return savedProduct;
    }
    
    // Update existing product
    public Product updateProduct(Product product) {
        logger.info("Updating product with ID: {}", product.getId());
        Product updatedProduct = productRepo.save(product);
        logger.info("Product updated successfully: {} (ID: {})", updatedProduct.getName(), updatedProduct.getId());
        return updatedProduct;
    }
    
    // Delete product
    public void deleteProduct(Long id) {
        logger.info("Deleting product with ID: {}", id);
        productRepo.deleteById(id);
        logger.info("Product deleted successfully: ID {}", id);
    }
    
    // Get products by category
    public List<Product> getProductsByCategory(String category) {
        logger.debug("Fetching products for category: {}", category);
        List<Product> products = productRepo.findByCategory(category);
        logger.debug("Found {} products for category: {}", products.size(), category);
        return products;
    }
    
    // Get products by category and pincode
    public List<Product> getProductsByCategoryAndPincode(String category, String pincode) {
        logger.debug("Fetching products for category: {} and pincode: {}", category, pincode);
        List<Product> products = productRepo.findByCategoryAndPincode(category, pincode);
        logger.debug("Found {} products for category: {} and pincode: {}", products.size(), category, pincode);
        return products;
    }
    
    // Get paginated products by pincode
    public Page<Product> getProductsByPincode(String pincode, int page, int size, String sortBy) {
        logger.debug("Fetching paginated products for pincode: {}, page: {}, size: {}, sortBy: {}", pincode, page, size, sortBy);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> productPage = productRepo.findByPincode(pincode, pageable);
        logger.debug("Found {} products (page {} of {}) for pincode: {}", 
                productPage.getNumberOfElements(), 
                productPage.getNumber() + 1, 
                productPage.getTotalPages(), 
                pincode);
        return productPage;
    }
    
    // Get paginated products by category
    public Page<Product> getProductsByCategory(String category, int page, int size, String sortBy) {
        logger.debug("Fetching paginated products for category: {}, page: {}, size: {}, sortBy: {}", category, page, size, sortBy);
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

