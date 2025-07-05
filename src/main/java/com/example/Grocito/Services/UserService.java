package com.example.Grocito.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Grocito.Entity.User;
import com.example.Grocito.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public User register(User user) {
        return userRepo.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepo.findByEmail(email)
                       .filter(u -> u.getPassword().equals(password));
    }
}

