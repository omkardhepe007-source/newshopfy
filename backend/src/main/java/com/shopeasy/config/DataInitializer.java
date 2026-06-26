package com.shopeasy.config;

import com.shopeasy.entity.Cart;
import com.shopeasy.entity.Role;
import com.shopeasy.entity.User;
import com.shopeasy.repository.CartRepository;
import com.shopeasy.repository.RoleRepository;
import com.shopeasy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * DataInitializer - Seeds the database with required data on startup.
 * Implements CommandLineRunner so it runs after the Spring context is ready.
 *
 * Seeds:
 *  1. ROLE_CUSTOMER and ROLE_ADMIN roles
 *  2. Default admin account (admin@shopeasy.com / admin123)
 *
 * Safe to run multiple times — uses existsByEmail and findByName checks.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedRoles();
        seedAdminUser();
    }

    private void seedRoles() {
        if (roleRepository.findByName(Role.ERole.ROLE_CUSTOMER).isEmpty()) {
            roleRepository.save(new Role(null, Role.ERole.ROLE_CUSTOMER));
            log.info("✅ ROLE_CUSTOMER seeded");
        }
        if (roleRepository.findByName(Role.ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(null, Role.ERole.ROLE_ADMIN));
            log.info("✅ ROLE_ADMIN seeded");
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@shopeasy.com")) {
            Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            User admin = User.builder()
                    .fullName("ShopEasy Admin")
                    .email("admin@shopeasy.com")
                    .password(passwordEncoder.encode("admin123"))
                    .mobileNumber("9999999999")
                    .address("ShopEasy HQ")
                    .roles(Set.of(adminRole))
                    .build();

            userRepository.save(admin);
            log.info("✅ Default admin created: admin@shopeasy.com / admin123");
        }
    }
}
