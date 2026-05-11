package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderItemRequest;
import com.example.ecommerce.dto.OrderRequest;
import com.example.ecommerce.dto.OrderResponse;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.PreparedStatement;

@Service
public class CheckoutService {

    private final JdbcTemplate jdbcTemplate;
    private final ProductRepository productRepository;

    public CheckoutService(JdbcTemplate jdbcTemplate, ProductRepository productRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO orders(customer_name, email, phone, address, total_amount, status, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
                    new String[]{"ID"}
            );
            ps.setString(1, request.getCustomerName());
            ps.setString(2, request.getEmail());
            ps.setString(3, request.getPhone());
            ps.setString(4, request.getAddress());
            ps.setBigDecimal(5, BigDecimal.ZERO);
            ps.setString(6, "PLACED");
            return ps;
        }, keyHolder);

        Number key = (Number) keyHolder.getKeys().get("ID");
        Long orderId = key.longValue();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId());
            if (product == null) {
                throw new IllegalArgumentException("Product not found: " + item.getProductId());
            }

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);

            jdbcTemplate.update(
                    "INSERT INTO order_items(order_id, product_id, product_name, unit_price, quantity, line_total) " +
                            "VALUES (?, ?, ?, ?, ?, ?)",
                    orderId,
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    item.getQuantity(),
                    lineTotal
            );
        }

        jdbcTemplate.update("UPDATE orders SET total_amount = ? WHERE id = ?", total, orderId);

        return new OrderResponse(orderId, total, "Order placed successfully");
    }
}