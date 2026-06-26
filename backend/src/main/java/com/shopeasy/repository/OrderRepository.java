package com.shopeasy.repository;

import com.shopeasy.entity.Order;
import com.shopeasy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * OrderRepository - Manages order records.
 * findByUserOrderByCreatedAtDesc returns a user's orders newest-first
 * for their order history page.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
