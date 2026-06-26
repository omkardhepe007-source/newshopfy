package com.shopeasy.repository;

import com.shopeasy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - JPA repository for User entity.
 * Spring Data JPA auto-generates implementation at runtime.
 * findByEmail is used during login and JWT validation.
 * existsByEmail prevents duplicate registrations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
