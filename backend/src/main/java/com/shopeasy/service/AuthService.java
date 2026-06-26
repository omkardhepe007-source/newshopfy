package com.shopeasy.service;

import com.shopeasy.dto.AuthDTO;
import com.shopeasy.entity.Cart;
import com.shopeasy.entity.Role;
import com.shopeasy.entity.User;
import com.shopeasy.exception.ResourceNotFoundException;
import com.shopeasy.repository.CartRepository;
import com.shopeasy.repository.RoleRepository;
import com.shopeasy.repository.UserRepository;
import com.shopeasy.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * AuthService - Handles user registration and login.
 *
 * Registration flow:
 *  1. Check for duplicate email
 *  2. Encode password with BCrypt
 *  3. Assign ROLE_CUSTOMER by default
 *  4. Save user + create an empty cart for them
 *
 * Login flow:
 *  1. Authenticate via Spring Security's AuthenticationManager
 *  2. Generate JWT token
 *  3. Return JwtResponse with user info
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public String register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        Role customerRole = roleRepository.findByName(Role.ERole.ROLE_CUSTOMER)
                .orElseThrow(() -> new ResourceNotFoundException("Role CUSTOMER not found. Please seed the database."));

        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobileNumber(request.getMobileNumber())
                .address(request.getAddress())
                .roles(roles)
                .build();

        userRepository.save(user);

        // Auto-create an empty cart for new customers
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        return "User registered successfully!";
    }

    public AuthDTO.JwtResponse login(AuthDTO.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_CUSTOMER");

        return new AuthDTO.JwtResponse(jwt, user.getId(), user.getFullName(), user.getEmail(), role);
    }
}
