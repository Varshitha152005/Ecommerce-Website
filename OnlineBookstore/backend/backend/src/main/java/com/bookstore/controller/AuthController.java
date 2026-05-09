package com.bookstore.controller;


import com.bookstore.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")

public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        if (username == null || username.trim().isEmpty()) {
            return Map.of("status", "error", "message", "Username is required");
        }

        if (password == null || password.trim().isEmpty()) {
            return Map.of("status", "error", "message", "Password is required");
        }

        if (username.length() < 3) {
            return Map.of("status", "error", "message", "Username must be at least 3 characters");
        }

        if (password.length() < 4) {
            return Map.of("status", "error", "message", "Password must be at least 4 characters");
        }

        if (authService.validateLogin(username, password)) {
            return Map.of("status", "success", "message", "Login successful");
        }

        return Map.of("status", "error", "message", "Invalid username or password");
    }
}


