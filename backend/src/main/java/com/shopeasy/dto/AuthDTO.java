package com.shopeasy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * AuthDTO - Contains all DTOs related to authentication.
 * Keeping them in one file reduces the number of files for a fresher project,
 * while still maintaining clean separation of request/response concerns.
 */
public class AuthDTO {

    /**
     * RegisterRequest - Payload sent by client during registration.
     * Validation annotations ensure clean data before hitting the service layer.
     */
    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String mobileNumber;
        private String address;
    }

    /**
     * LoginRequest - Email + Password for login.
     */
    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    /**
     * JwtResponse - Returned to client after successful login.
     * Contains the JWT token and basic user info for the frontend to store.
     */
    @Data
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String fullName;
        private String email;
        private String role;

        public JwtResponse(String token, Long id, String fullName, String email, String role) {
            this.token = token;
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
        }
    }
}
