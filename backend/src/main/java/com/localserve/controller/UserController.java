package com.localserve.controller;

import com.localserve.dto.ApiResponse;
import com.localserve.dto.UserDto;
import com.localserve.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", userService.getUserProfile(authentication.getName())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@RequestBody UserDto dto, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userService.updateProfile(authentication.getName(), dto)));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("All users retrieved", userService.getAllUsers()));
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<UserDto>>> getProviders() {
        return ResponseEntity.ok(ApiResponse.success("Providers retrieved", userService.getProviders()));
    }
}
