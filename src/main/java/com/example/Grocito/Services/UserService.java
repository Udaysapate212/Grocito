package com.example.Grocito.Services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Grocito.config.LoggerConfig;
import com.example.Grocito.Entity.User;
import com.example.Grocito.Repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerConfig.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private EmailService emailService;

    // Register a new user
    public User register(User user) {
        logger.debug("Attempting to register new user with email: {}", user.getEmail());
        
        // Check if email already exists
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("Registration failed: Email already registered: {}", user.getEmail());
            throw new RuntimeException("Email already registered");
        }
        
        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            logger.debug("Setting default role 'USER' for new user");
            user.setRole("USER");
        }
        
        user.setRegisteredDate(LocalDate.now());
        User savedUser = userRepo.save(user);
        logger.info("User registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    // Login user
    public Optional<User> login(String email, String password) {
        logger.debug("Attempting login for user: {}", email);
        Optional<User> user = userRepo.findByEmail(email)
                       .filter(u -> u.getPassword().equals(password));
        
        if (user.isPresent()) {
            logger.info("User logged in successfully: {}", email);
        } else {
            logger.warn("Login failed for user: {}", email);
        }
        
        return user;
    }
    
    // Get user by ID
    public Optional<User> getUserById(Long id) {
        logger.debug("Fetching user with ID: {}", id);
        Optional<User> user = userRepo.findById(id);
        
        if (user.isPresent()) {
            logger.debug("Found user: {}", user.get().getEmail());
        } else {
            logger.debug("User not found with ID: {}", id);
        }
        
        return user;
    }
    
    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        logger.debug("Fetching user with email: {}", email);
        Optional<User> user = userRepo.findByEmail(email);
        
        if (user.isPresent()) {
            logger.debug("Found user with email: {}", email);
        } else {
            logger.debug("User not found with email: {}", email);
        }
        
        return user;
    }
    
    // Update user profile
    public User updateProfile(Long userId, User updatedUser) {
        logger.info("Updating profile for user ID: {}", userId);
        
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> {
                    logger.error("Profile update failed: User not found with ID: {}", userId);
                    return new RuntimeException("User not found with id: " + userId);
                });
        
        logger.debug("Found user to update: {}", existingUser.getEmail());
        
        // Update fields that are allowed to be updated
        if (updatedUser.getFullName() != null && !updatedUser.getFullName().trim().isEmpty()) {
            logger.debug("Updating full name for user: {}", existingUser.getEmail());
            existingUser.setFullName(updatedUser.getFullName().trim());
        }
        
        if (updatedUser.getAddress() != null) {
            logger.debug("Updating address for user: {}", existingUser.getEmail());
            existingUser.setAddress(updatedUser.getAddress().trim());
        }
        
        if (updatedUser.getPincode() != null) {
            logger.debug("Updating pincode for user: {}", existingUser.getEmail());
            existingUser.setPincode(updatedUser.getPincode().trim());
        }
        
        if (updatedUser.getContactNumber() != null) {
            logger.debug("Updating contact number for user: {}", existingUser.getEmail());
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
    
    // Send welcome email after registration
    public void sendWelcomeEmail(User user) {
        logger.info("Sending welcome email to: {}", user.getEmail());
        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());
    }
    
    // Generate a random temporary password
    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        
        // Generate a password of length 10
        for (int i = 0; i < 10; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        
        return sb.toString();
    }
    
    // Reset password and send email with temporary password
    public void resetPassword(String email) {
        logger.info("Password reset requested for email: {}", email);
        
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Password reset failed: User not found with email: {}", email);
                    return new RuntimeException("User not found with email: " + email);
                });
        
        // Generate temporary password
        String temporaryPassword = generateTemporaryPassword();
        
        // Update user's password
        user.setPassword(temporaryPassword);
        userRepo.save(user);
        
        // Send email with temporary password
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), temporaryPassword);
        
        logger.info("Password reset successful for user: {}", email);
    }
    
    // Delivery Partner specific methods
    
    // Register a new delivery partner
    public User registerDeliveryPartner(User deliveryPartner) {
        logger.debug("Attempting to register new delivery partner with email: {}", deliveryPartner.getEmail());
        
        // Check if email already exists
        if (userRepo.findByEmail(deliveryPartner.getEmail()).isPresent()) {
            logger.warn("Registration failed: Email already registered: {}", deliveryPartner.getEmail());
            throw new RuntimeException("Email already registered");
        }
        
        // Set role as DELIVERY_PARTNER
        deliveryPartner.setRole("DELIVERY_PARTNER");
        deliveryPartner.setRegisteredDate(LocalDate.now());
        
        User savedUser = userRepo.save(deliveryPartner);
        logger.info("Delivery partner registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }
    
    // Login delivery partner
    public Optional<User> loginDeliveryPartner(String email, String password) {
        logger.debug("Attempting delivery partner login for user: {}", email);
        Optional<User> user = userRepo.findByEmailAndRole(email, "DELIVERY_PARTNER")
                       .filter(u -> u.getPassword().equals(password));
        
        if (user.isPresent()) {
            logger.info("Delivery partner logged in successfully: {}", email);
        } else {
            logger.warn("Delivery partner login failed for user: {}", email);
        }
        
        return user;
    }
    
    // Get all delivery partners
    public List<User> getAllDeliveryPartners() {
        logger.debug("Fetching all delivery partners");
        return userRepo.findByRole("DELIVERY_PARTNER");
    }
    
    // Get delivery partner by ID
    public Optional<User> getDeliveryPartnerById(Long id) {
        logger.debug("Fetching delivery partner with ID: {}", id);
        Optional<User> user = userRepo.findById(id)
                .filter(u -> "DELIVERY_PARTNER".equals(u.getRole()));
        
        if (user.isPresent()) {
            logger.debug("Found delivery partner: {}", user.get().getEmail());
        } else {
            logger.debug("Delivery partner not found with ID: {}", id);
        }
        
        return user;
    }
}
