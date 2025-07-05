package com.example.Grocito.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Grocito.Entity.Product;
import com.example.Grocito.Repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    public List<Product> getProductsByPincode(String pincode) {
        return productRepo.findByPincode(pincode);
    }
}

