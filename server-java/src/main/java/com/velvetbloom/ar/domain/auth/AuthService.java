package com.velvetbloom.ar.domain.auth;

import com.velvetbloom.ar.common.ApiException;
import com.velvetbloom.ar.domain.user.User;
import com.velvetbloom.ar.domain.user.UserRepository;
import com.velvetbloom.ar.security.JwtService;
import com.velvetbloom.ar.security.RefreshTokenStore;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenStore refreshStore;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, RefreshTokenStore refreshStore) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshStore = refreshStore;
    }

    @Transactional
    public AuthDtos.AuthResult register(AuthDtos.RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw ApiException.badRequest("Email already registered");
        }
        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setPhone(req.phone());
        user.setRole("customer");
        userRepository.save(user);
        return issueTokens(user);
    }

    @Transactional
    public AuthDtos.AuthResult login(AuthDtos.LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));
        if (!user.isActive()) {
            throw ApiException.unauthorized("Account is deactivated");
        }
        user.setLastLogin(Instant.now());
        userRepository.save(user);
        return issueTokens(user);
    }

    @Transactional
    public AuthDtos.AuthResult adminLogin(AuthDtos.LoginRequest req) {
        User user = userRepository.findByEmailAndRoleIn(req.email(), List.of("admin", "superadmin"))
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> ApiException.unauthorized("Invalid credentials"));
        user.setLastLogin(Instant.now());
        userRepository.save(user);
        return issueTokens(user);
    }

    public AuthDtos.AuthResult refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw ApiException.unauthorized("No refresh token");
        }
        UUID userId;
        try {
            userId = jwtService.parseRefreshToken(refreshToken);
        } catch (Exception e) {
            throw ApiException.unauthorized("Invalid or expired token");
        }
        if (!refreshStore.matches(userId, refreshToken)) {
            throw ApiException.unauthorized("Invalid refresh token");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("Invalid refresh token"));
        return issueTokens(user);
    }

    public void logout(UUID userId) {
        refreshStore.delete(userId);
    }

    public User getMe(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));
    }

    @Transactional
    public User updateProfile(UUID userId, AuthDtos.UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        if (req.name() != null) user.setName(req.name());
        if (req.phone() != null) user.setPhone(req.phone());
        if (req.preferences() != null) user.setPreferences(req.preferences());
        return userRepository.save(user);
    }

    /** Issue access + refresh tokens and persist the refresh token in Redis. */
    private AuthDtos.AuthResult issueTokens(User user) {
        String access = jwtService.generateAccessToken(user.getId(), user.getRole());
        String refresh = jwtService.generateRefreshToken(user.getId());
        refreshStore.save(user.getId(), refresh, jwtService.getRefreshTtlMs());
        return new AuthDtos.AuthResult(user, access, refresh);
    }
}
