package com.example.Grocito.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.Product;
import com.example.Grocito.Services.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerConfig.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("Fetching all products");
        List<Product> products = productService.getAllProducts();
        logger.debug("Retrieved {} products", products.size());
        return ResponseEntity.ok(products);
    }
    
    // Get products by pincode
    @GetMapping("/pincode/{pincode}")
    public ResponseEntity<List<Product>> getProductsByPincode(@PathVariable String pincode) {
        logger.info("Fetching products for pincode: {}", pincode);
        List<Product> products = productService.getProductsByPincode(pincode);
        logger.debug("Retrieved {} products for pincode: {}", products.size(), pincode);
        return ResponseEntity.ok(products);
    }
    
    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        logger.info("Fetching product with ID: {}", id);
        return productService.getProductById(id)
                .map(product -> {
                    logger.debug("Found product: {}", product.getName());
                    return ResponseEntity.ok(product);
                })
                .orElseGet(() -> {
                    logger.warn("Product not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    // Create new product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        logger.info("Creating new product: {}", product.getName());
        Product createdProduct = productService.createProduct(product);
        logger.info("Product created successfully with ID: {}", createdProduct.getId());
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    
    // Update existing product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        logger.info("Updating product with ID: {}", id);
        return productService.getProductById(id)
                .map(existingProduct -> {
                    product.setId(id);
                    logger.debug("Updating product: {} (ID: {})", product.getName(), id);
                    Product updatedProduct = productService.updateProduct(product);
                    logger.info("Product updated successfully: {}", updatedProduct.getName());
                    return ResponseEntity.ok(updatedProduct);
                })
                .orElseGet(() -> {
                    logger.warn("Cannot update - product not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting product with ID: {}", id);
        return productService.getProductById(id)
                .map(product -> {
                    logger.debug("Found product to delete: {} (ID: {})", product.getName(), id);
                    productService.deleteProduct(id);
                    logger.info("Product deleted successfully: ID {}", id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> {
                    logger.warn("Cannot delete - product not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    // Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }
    
    // Get products by category and pincode
    @GetMapping("/category/{category}/pincode/{pincode}")
    public ResponseEntity<List<Product>> getProductsByCategoryAndPincode(
            @PathVariable String category, 
            @PathVariable String pincode) {
        return ResponseEntity.ok(productService.getProductsByCategoryAndPincode(category, pincode));
    }
    
    // Get paginated products by pincode
    @GetMapping("/paginated/pincode/{pincode}")
    public ResponseEntity<Page<Product>> getPaginatedProductsByPincode(
            @PathVariable String pincode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(productService.getProductsByPincode(pincode, page, size, sortBy));
    }
    
    // Get paginated products by category
    @GetMapping("/paginated/category/{category}")
    public ResponseEntity<Page<Product>> getPaginatedProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(productService.getProductsByCategory(category, page, size, sortBy));
    }
    
    // Search products by keyword
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }
    
    // Search products by keyword and pincode
    @GetMapping("/search/pincode/{pincode}")
    public ResponseEntity<List<Product>> searchProductsByPincode(
            @RequestParam String keyword,
            @PathVariable String pincode) {
        return ResponseEntity.ok(productService.searchProductsByPincode(keyword, pincode));
    }
    
    // Update product stock
    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateProductStock(
            @PathVariable Long id,
            @RequestParam int stock) {
        try {
            Product updatedProduct = productService.updateProductStock(id, stock);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


