package com.example.ecommerce.dto;
import java.math.BigDecimal;


public class OrderResponse {
    private Long orderId;
    private BigDecimal totalAmount;
    private String message;

    public OrderResponse() {
    }

    public OrderResponse(Long orderId, BigDecimal totalAmount, String message) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.message = message;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}


