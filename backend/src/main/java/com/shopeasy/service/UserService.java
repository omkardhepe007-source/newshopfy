package com.shopeasy.service;

import com.shopeasy.dto.UserDTO;
import com.shopeasy.entity.User;
import com.shopeasy.exception.ResourceNotFoundException;
import com.shopeasy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * UserService - Manages user profile operations.
 * getProfile: returns the logged-in user's profile data
 * updateProfile: allows user to update name, mobile, address (not email/password)
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDTO.ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToProfile(user);
    }

    @Transactional
    public UserDTO.ProfileResponse updateProfile(String email, UserDTO.UpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        user.setFullName(request.getFullName());
        user.setMobileNumber(request.getMobileNumber());
        user.setAddress(request.getAddress());

        return mapToProfile(userRepository.save(user));
    }

    // Admin: list all users
    public List<UserDTO.ProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToProfile)
                .collect(Collectors.toList());
    }

    private UserDTO.ProfileResponse mapToProfile(User user) {
        UserDTO.ProfileResponse profile = new UserDTO.ProfileResponse();
        profile.setId(user.getId());
        profile.setFullName(user.getFullName());
        profile.setEmail(user.getEmail());
        profile.setMobileNumber(user.getMobileNumber());
        profile.setAddress(user.getAddress());
        profile.setRole(user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("ROLE_CUSTOMER"));
        profile.setCreatedAt(user.getCreatedAt());
        return profile;
    }
}
