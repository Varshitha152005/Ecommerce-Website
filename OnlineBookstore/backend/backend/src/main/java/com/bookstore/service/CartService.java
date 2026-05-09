package com.bookstore.service;

import com.bookstore.model.Book;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private List<Book> cart = new ArrayList<>();

    public void addToCart(Book book) {
        cart.add(book);
    }

    public List<Book> getCart() {
        return cart;
    }

    public void removeFromCart(int id) {
        cart.removeIf(book -> book.getId() == id);
    }

    public void clear() {
        cart.clear();
    }

    public double getTotalPrice() {
        return cart.stream()
                .mapToDouble(Book::getPrice)
                .sum();
    }
}