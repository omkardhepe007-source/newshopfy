package com.shopeasy.service;

import com.shopeasy.dto.AuthDTO;
import com.shopeasy.entity.Role;
import com.shopeasy.entity.User;
import com.shopeasy.repository.CartRepository;
import com.shopeasy.repository.RoleRepository;
import com.shopeasy.repository.UserRepository;
import com.shopeasy.util.JwtUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * AuthServiceTest - Unit tests for AuthService.
 * Tests the registration duplicate check and successful registration flow.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private CartRepository cartRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should throw exception when email already exists")
    void shouldThrowWhenEmailExists() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("test@test.com");
        request.setFullName("Test User");
        request.setPassword("password123");

        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already registered");
    }

    @Test
    @DisplayName("Should register new user successfully")
    void shouldRegisterUserSuccessfully() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("new@test.com");
        request.setFullName("New User");
        request.setPassword("password123");

        Role customerRole = new Role(1L, Role.ERole.ROLE_CUSTOMER);

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(roleRepository.findByName(Role.ERole.ROLE_CUSTOMER)).thenReturn(Optional.of(customerRole));
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        String result = authService.register(request);

        assert(result.contains("successfully"));
        verify(userRepository, times(1)).save(any(User.class));
        verify(cartRepository, times(1)).save(any());
    }
}
