package com.shopeasy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * UserDTO - DTOs for user profile management.
 * UpdateRequest allows users to change profile info (not password/email here).
 * ProfileResponse is what gets returned when viewing a profile.
 */
public class UserDTO {

    @Data
    public static class UpdateRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        private String mobileNumber;

        private String address;
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private String fullName;
        private String email;
        private String mobileNumber;
        private String address;
        private String role;
        private LocalDateTime createdAt;
    }
}
