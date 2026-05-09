package com.bookstore.service;
import com.bookstore.model.Book;
import org.springframework.stereotype.Service;

import java.util.*;

@Service

public class BookService {
	private List<Book> books = new ArrayList<>();

    public BookService() {
        books.add(new Book(1, "Java Basics", "James", 500));
        books.add(new Book(2, "Spring Boot", "Rod", 700));
        books.add(new Book(3, "Artificial Intillegence", "Roy", 900));
        books.add(new Book(4, "Core Python", "Rod", 600));
        books.add(new Book(5, "C++ ", "Bjarne", 900));
        books.add(new Book(6, "JavaScript", "Varsh", 700));
        
        
    }

    public List<Book> getAllBooks() {
        return books;
    }

    public Book getBookById(int id) {
        return books.stream()
                .filter(b -> b.getId() == id)
                .findFirst()
                .orElse(null);
    }
}

