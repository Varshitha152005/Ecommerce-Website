package com.bookstore.controller;

import com.bookstore.model.Book;
import com.bookstore.service.BookService;
import com.bookstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private CartService cartService;

    @GetMapping("/books")
    public List<Book> getBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping("/cart/{id}")
    public String addToCart(@PathVariable int id) {
        Book book = bookService.getBookById(id);
        if (book == null) {
            return "Book not found";
        }
        cartService.addToCart(book);
        return "Added to cart";
    }

    @GetMapping("/cart")
    public List<Book> getCart() {
        return cartService.getCart();
    }
    @DeleteMapping("/cart/{id}")
    public String removeFromCart(@PathVariable int id) {
        cartService.removeFromCart(id);
        return "Book removed from cart";
    }

    @DeleteMapping("/cart/clear")
    public String clearCart() {
        cartService.clear();
        return "Cart cleared";
    }

    @GetMapping("/cart/total")
    public double getTotalPrice() {
        return cartService.getTotalPrice();
    }

    @PostMapping("/checkout")
    public String checkout() {
        cartService.clear();
        return "✅ Order placed successfully!";
    }
}