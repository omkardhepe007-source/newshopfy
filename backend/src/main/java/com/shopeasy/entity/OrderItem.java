package com.shopeasy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * OrderItem Entity - A snapshot of a product added to an order.
 * We store productName and price directly (not just FK) so order history
 * remains accurate even if the product is later edited or deleted.
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    // Snapshot fields - captured at time of order
    @Column(nullable = false)
    private String productName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal productPrice;

    @Column(nullable = false)
    private Integer quantity;

    public BigDecimal getSubtotal() {
        return productPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
