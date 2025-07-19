package com.example.Grocito.Services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Grocito.Entity.User;
import com.example.Grocito.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    // Register a new user
    public User register(User user) {
        // Check if email already exists
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        
        user.setRegisteredDate(LocalDate.now());
        return userRepo.save(user);
    }

    // Login user
    public Optional<User> login(String email, String password) {
        return userRepo.findByEmail(email)
                       .filter(u -> u.getPassword().equals(password));
    }
    
    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }
    
    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }
    
    // Update user profile
    public User updateProfile(Long userId, User updatedUser) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Update fields that are allowed to be updated
        if (updatedUser.getFullName() != null && !updatedUser.getFullName().trim().isEmpty()) {
            existingUser.setFullName(updatedUser.getFullName().trim());
        }
        
        if (updatedUser.getAddress() != null) {
            existingUser.setAddress(updatedUser.getAddress().trim());
        }
        
        if (updatedUser.getPincode() != null) {
            existingUser.setPincode(updatedUser.getPincode().trim());
        }
        
        if (updatedUser.getContactNumber() != null) {
            existingUser.setContactNumber(updatedUser.getContactNumber().trim());
        }
        
        // Don't allow email change through this method for security reasons
        
        return userRepo.save(existingUser);
    }
    
    // Change password
    public User changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Verify old password
        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Incorrect password");
        }
        
        user.setPassword(newPassword);
        return userRepo.save(user);
    }
    
    // Update user role (admin function)
    public User updateUserRole(Long userId, String newRole) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Validate role
        if (!newRole.equals("USER") && !newRole.equals("ADMIN") && !newRole.equals("DELIVERY_PARTNER")) {
            throw new RuntimeException("Invalid role: " + newRole);
        }
        
        user.setRole(newRole);
        return userRepo.save(user);
    }
    
    // Get all users (admin function)
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
    
    // Delete user (admin function or account deletion)
    public void deleteUser(Long userId) {
        if (!userRepo.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        userRepo.deleteById(userId);
    }
}
