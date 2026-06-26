package com.shopeasy.repository;

import com.shopeasy.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RoleRepository - Fetches roles by their enum name.
 * Used during user registration to assign ROLE_CUSTOMER by default.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Role.ERole name);
}
