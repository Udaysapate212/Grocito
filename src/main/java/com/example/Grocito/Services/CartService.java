// CartService.java
package com.example.Grocito.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Grocito.Entity.Cart;
import com.example.Grocito.Entity.CartItem;
import com.example.Grocito.Entity.Product;
import com.example.Grocito.Entity.User;
import com.example.Grocito.Repository.CartItemRepository;
import com.example.Grocito.Repository.CartRepository;
import com.example.Grocito.Repository.ProductRepository;
import com.example.Grocito.Repository.UserRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Add item to cart with stock validation
    public Cart addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Check if product is in stock
        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                    ". Available: " + product.getStock());
        }

        Cart cart = cartRepository.findByUserId(userId).orElse(null);

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                // Check if the updated quantity exceeds stock
                int newQuantity = item.getQuantity() + quantity;
                if (product.getStock() < newQuantity) {
                    throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                            ". Available: " + product.getStock() + ", Requested: " + newQuantity);
                }
                
                item.setQuantity(newQuantity);
                cart = cartRepository.save(cart);
                return cart;
            }
        }

        CartItem newItem = new CartItem();
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        newItem.setCart(cart);

        cart.getItems().add(newItem);

        return cartRepository.save(cart);
    }

    // Get cart by user
    public Cart getCartByUser(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }
        return cart;
    }

    // Remove item from cart
    public void removeItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    // Clear all items in user's cart
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // Get all cart items of user
    public List<CartItem> getAllItems(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }
        return cart.getItems();
    }

    // Update quantity of a specific cart item with stock validation
    public CartItem updateQuantity(Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + itemId));
        
        Product product = item.getProduct();
        
        // Check if the requested quantity exceeds stock
        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                    ". Available: " + product.getStock() + ", Requested: " + quantity);
        }
        
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    
    // Update quantity by userId and productId
    public CartItem updateCartItemQuantity(Long userId, Long productId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Check if the requested quantity exceeds stock
        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock available for product: " + product.getName() + 
                    ". Available: " + product.getStock() + ", Requested: " + quantity);
        }
        
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                item.setQuantity(quantity);
                return cartItemRepository.save(item);
            }
        }
        
        throw new RuntimeException("Product not found in user's cart");
    }
    
    // Get cart items by userId
    public List<CartItem> getCartItems(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }
        return cart.getItems();
    }

    // Remove a cart item by userId and productId
    public void removeFromCart(Long userId, Long productId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }

        CartItem itemToRemove = null;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                itemToRemove = item;
                break;
            }
        }

        if (itemToRemove != null) {
            cart.getItems().remove(itemToRemove); // remove from cart's list
            cartItemRepository.delete(itemToRemove); // delete from DB
            cartRepository.save(cart); // save updated cart
        } else {
            throw new RuntimeException("Cart item with productId " + productId + " not found in user's cart");
        }
    }
    
    // Calculate cart total
    public double calculateCartTotal(Long userId) {
        List<CartItem> items = getCartItems(userId);
        double total = 0.0;
        
        for (CartItem item : items) {
            total += item.getProduct().getPrice() * item.getQuantity();
        }
        
        return total;
    }
    
    // Get cart summary with product details
    public Map<String, Object> getCartSummary(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        
        List<CartItem> items = cart.getItems();
        List<Map<String, Object>> itemDetails = new ArrayList<>();
        double total = 0.0;
        int itemCount = 0;
        
        for (CartItem item : items) {
            Map<String, Object> detail = new HashMap<>();
            Product product = item.getProduct();
            
            detail.put("itemId", item.getId());
            detail.put("productId", product.getId());
            detail.put("productName", product.getName());
            detail.put("price", product.getPrice());
            detail.put("quantity", item.getQuantity());
            detail.put("subtotal", product.getPrice() * item.getQuantity());
            detail.put("inStock", product.getStock() >= item.getQuantity());
            
            itemDetails.add(detail);
            total += product.getPrice() * item.getQuantity();
            itemCount += item.getQuantity();
        }
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("userId", userId);
        summary.put("items", itemDetails);
        summary.put("totalItems", itemCount);
        summary.put("totalAmount", total);
        
        return summary;
    }
    
    // Validate cart items against current stock
    public List<Map<String, Object>> validateCartItems(Long userId) {
        List<CartItem> items = getCartItems(userId);
        List<Map<String, Object>> validationResults = new ArrayList<>();
        
        for (CartItem item : items) {
            Product product = item.getProduct();
            Map<String, Object> result = new HashMap<>();
            
            result.put("itemId", item.getId());
            result.put("productId", product.getId());
            result.put("productName", product.getName());
            result.put("requestedQuantity", item.getQuantity());
            result.put("availableStock", product.getStock());
            result.put("valid", product.getStock() >= item.getQuantity());
            
            validationResults.add(result);
        }
        
        return validationResults;
    }
}
