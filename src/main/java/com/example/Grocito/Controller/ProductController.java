package com.example.Grocito.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Grocito.Entity.Product;
import com.example.Grocito.Services.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    // Get products by pincode
    @GetMapping("/pincode/{pincode}")
    public ResponseEntity<List<Product>> getProductsByPincode(@PathVariable String pincode) {
        return ResponseEntity.ok(productService.getProductsByPincode(pincode));
    }
    
    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }
    
    // Update existing product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.getProductById(id)
                .map(existingProduct -> {
                    product.setId(id);
                    return ResponseEntity.ok(productService.updateProduct(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> {
                    productService.deleteProduct(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
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


