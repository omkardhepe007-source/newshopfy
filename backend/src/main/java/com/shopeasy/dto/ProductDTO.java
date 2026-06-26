package com.shopeasy.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ProductDTO - Data Transfer Object for Product.
 * Contains nested Request and Response classes.
 * Using DTOs prevents exposing internal entity structure to clients.
 */
public class ProductDTO {

    /**
     * Request DTO - used when admin creates or updates a product.
     */
    @Data
    public static class Request {
        @NotBlank(message = "Product name is required")
        private String name;

        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
        private BigDecimal price;

        @NotNull(message = "Stock is required")
        @Min(value = 0, message = "Stock cannot be negative")
        private Integer stock;

        private String imageUrl;
    }

    /**
     * Response DTO - returned to clients when fetching product data.
     */
    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String category;
        private BigDecimal price;
        private Integer stock;
        private String imageUrl;
        private boolean active;
        private LocalDateTime createdAt;
    }
}
