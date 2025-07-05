package com.example.Grocito.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Grocito.Entity.Product;
import com.example.Grocito.Repository.ProductRepository;
import com.example.Grocito.Services.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/{pincode}")
    public List<Product> getProducts(@PathVariable String pincode) {
        return productService.getProductsByPincode(pincode);
    }
}


