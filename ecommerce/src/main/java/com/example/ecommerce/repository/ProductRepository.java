package com.example.ecommerce.repository;

import com.example.ecommerce.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final org.springframework.jdbc.core.RowMapper<Product> rowMapper = (rs, rowNum) -> {
        Product p = new Product();
        p.setId(rs.getLong("id"));
        p.setName(rs.getString("name"));
        p.setCategory(rs.getString("category"));
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getBigDecimal("price"));
        p.setImageUrl(rs.getString("image_url"));
        p.setRating(rs.getDouble("rating"));
        return p;
    };

    public List<Product> findProducts(String q, String category) {
        StringBuilder sql = new StringBuilder("SELECT * FROM products WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (q != null && !q.isBlank()) {
            sql.append(" AND LOWER(name) LIKE ?");
            params.add("%" + q.toLowerCase() + "%");
        }

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            sql.append(" AND LOWER(category) = LOWER(?)");
            params.add(category);
        }

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    public Product findById(Long id) {
        List<Product> products = jdbcTemplate.query(
                "SELECT * FROM products WHERE id = ?",
                rowMapper,
                id
        );

        if (products.isEmpty()) {
            return null;
        }

        return products.get(0);
    }
}