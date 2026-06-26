package com.shopeasy.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * OrderDTO - DTOs for Order operations.
 * PlaceOrderRequest carries the shipping address when customer checks out.
 * OrderResponse is the detailed view returned after placing or viewing an order.
 */
public class OrderDTO {

    @Data
    public static class PlaceOrderRequest {
        private String shippingAddress;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private BigDecimal productPrice;
        private Integer quantity;
        private BigDecimal subtotal;
    }

    @Data
    public static class OrderResponse {
        private Long id;
        private String status;
        private BigDecimal totalAmount;
        private String shippingAddress;
        private List<OrderItemResponse> orderItems;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
