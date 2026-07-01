package com.flexstays.controller;

import com.flexstays.dto.request.GoogleAuthRequest;
import com.flexstays.dto.request.LoginRequest;
import com.flexstays.dto.request.SignupRequest;
import com.flexstays.dto.response.ApiResponse;
import com.flexstays.dto.response.AuthResponse;
import com.flexstays.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Guest and Staff authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new guest account")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Account created successfully", authService.guestSignup(request)));
    }

    @PostMapping("/login")
    @Operation(summary = "Guest email login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.guestLogin(request)));
    }

    @PostMapping("/staff/login")
    @Operation(summary = "Staff login")
    public ResponseEntity<ApiResponse<AuthResponse>> staffLogin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Staff login successful", authService.staffLogin(request)));
    }

    @PostMapping("/google")
    @Operation(summary = "Login or register via Google OAuth ID token")
    public ResponseEntity<ApiResponse<AuthResponse>> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Google authentication successful", authService.googleAuth(request.getIdToken())));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Send password reset link to email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestParam String email) {
        authService.sendPasswordResetEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("Password reset link sent to " + email));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully"));
    }
}
