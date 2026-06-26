package com.shopeasy.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role Entity - Represents a user role in the system.
 * Each user is assigned a role: ROLE_ADMIN or ROLE_CUSTOMER.
 * Spring Security uses the "ROLE_" prefix for authorization checks.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 20)
    private ERole name;

    public enum ERole {
        ROLE_CUSTOMER,
        ROLE_ADMIN
    }
}
