package com.flexstays.service.impl;

import com.flexstays.dto.request.LoginRequest;
import com.flexstays.dto.request.SignupRequest;
import com.flexstays.dto.response.AuthResponse;
import com.flexstays.entity.User;
import com.flexstays.entity.Staff;
import com.flexstays.exception.BusinessException;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.StaffRepository;
import com.flexstays.repository.UserRepository;
import com.flexstays.security.JwtUtil;
import com.flexstays.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, StaffRepository staffRepository,
                           PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public AuthResponse guestSignup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setIsActive(true);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), "GUEST", "user");
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role("GUEST")
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse guestLogin(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.getIsActive()) {
            throw new BusinessException("Account is deactivated");
        }

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), "GUEST", "user");
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role("GUEST")
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse staffLogin(LoginRequest request) {
        Staff staff = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with email: " + request.getEmail()));

        if (staff.getStatus() != Staff.StaffStatus.ACTIVE) {
            throw new BusinessException("Staff account is not active");
        }

        if (!passwordEncoder.matches(request.getPassword(), staff.getPasswordHash())) {
            throw new BusinessException("Invalid password");
        }

        staff.setLastLoginAt(java.time.LocalDateTime.now());
        staffRepository.save(staff);

        String token = jwtUtil.generateToken(staff.getEmail(), staff.getRole().name(), "staff");
        return AuthResponse.builder()
                .token(token)
                .email(staff.getEmail())
                .role(staff.getRole().name())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse googleAuth(String idToken) {
        // Mock Google Verification for prototype/testing - normally we would use GoogleIdTokenVerifier
        // We will assume the token contains the email or is the email/name for demo/mock purpose.
        // Google accounts must never receive staff roles automatically.
        String email = "guest.google@gmail.com";
        String firstName = "Google";
        String lastName = "User";

        if (idToken != null && idToken.contains("@")) {
            email = idToken;
            firstName = idToken.split("@")[0];
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setIsActive(true);
            userRepository.save(user);
        }

        if (!user.getIsActive()) {
            throw new BusinessException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(user.getEmail(), "GUEST", "user");
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role("GUEST")
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    @Override
    public void sendPasswordResetEmail(String email) {
        // Mock implementation
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        // Mock implementation
    }
}
