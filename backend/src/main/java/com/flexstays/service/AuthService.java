package com.flexstays.service;

import com.flexstays.dto.request.LoginRequest;
import com.flexstays.dto.request.SignupRequest;
import com.flexstays.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse guestSignup(SignupRequest request);
    AuthResponse guestLogin(LoginRequest request);
    AuthResponse staffLogin(LoginRequest request);
    AuthResponse googleAuth(String idToken);
    void sendPasswordResetEmail(String email);
    void resetPassword(String token, String newPassword);
}
