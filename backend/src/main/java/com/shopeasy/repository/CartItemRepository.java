package com.shopeasy.repository;

import com.shopeasy.entity.Cart;
import com.shopeasy.entity.CartItem;
import com.shopeasy.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * CartItemRepository - Manages individual cart item records.
 * findByCartAndProduct checks if a product is already in the cart
 * (used to update quantity instead of adding a duplicate).
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
