package com.shopeasy.repository;

import com.shopeasy.entity.Cart;
import com.shopeasy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * CartRepository - Each user has exactly one cart.
 * findByUser is the primary lookup used in CartService.
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
