package com.localserve.controller;

import com.localserve.dto.ApiResponse;
import com.localserve.dto.JwtResponse;
import com.localserve.dto.LoginRequest;
import com.localserve.dto.RegisterRequest;
import com.localserve.dto.UserDto;
import com.localserve.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        UserDto registeredUser = authService.registerUser(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", registeredUser));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
    }
}
