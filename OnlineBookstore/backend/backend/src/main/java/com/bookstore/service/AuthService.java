package com.bookstore.service;
import com.bookstore.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class AuthService {
	private final List<User> users = new ArrayList<>();

    public AuthService() {
        users.add(new User("admin", "admin123"));
        users.add(new User("sumanth", "book123"));
    }

    public boolean validateLogin(String username, String password) {
        return users.stream().anyMatch(
                user -> user.getUsername().equals(username) &&
                        user.getPassword().equals(password)
        );
    }
}


