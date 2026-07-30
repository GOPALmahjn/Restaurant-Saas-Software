package com.velvetbloom.ar.domain.auth;

import com.velvetbloom.ar.domain.user.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

/** Request/response payloads for the auth endpoints. */
public final class AuthDtos {

    private AuthDtos() {}

    public record RegisterRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password,
            String phone) {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password) {}

    public record RefreshRequest(String refreshToken) {}

    public record UpdateProfileRequest(String name, String phone, User.Preferences preferences) {}

    /** Envelope data for login/register/admin-login: { user, accessToken, refreshToken }. */
    public record AuthResult(User user, String accessToken, String refreshToken) {
        public Map<String, Object> toData() {
            return Map.of("user", user, "accessToken", accessToken, "refreshToken", refreshToken);
        }
    }
}
