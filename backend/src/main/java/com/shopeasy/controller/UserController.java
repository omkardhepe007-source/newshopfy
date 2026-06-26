package com.shopeasy.controller;

import com.shopeasy.dto.ApiResponse;
import com.shopeasy.dto.UserDTO;
import com.shopeasy.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * UserController - Profile view and update for authenticated users.
 * GET  /api/users/profile        → View my profile
 * PUT  /api/users/profile        → Update my profile
 * GET  /api/users/admin/all      → Admin: list all users
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management APIs")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<ApiResponse<UserDTO.ProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched",
                userService.getProfile(userDetails.getUsername())));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<ApiResponse<UserDTO.ProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserDTO.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userService.updateProfile(userDetails.getUsername(), request)));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Get all users")
    public ResponseEntity<ApiResponse<List<UserDTO.ProfileResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users fetched",
                userService.getAllUsers()));
    }
}
