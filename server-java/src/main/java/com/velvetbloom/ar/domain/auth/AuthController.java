package com.velvetbloom.ar.domain.auth;

import com.velvetbloom.ar.common.ApiResponse;
import com.velvetbloom.ar.security.AppUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody AuthDtos.RegisterRequest req) {
        var result = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(result.toData(), "Registration successful"));
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@Valid @RequestBody AuthDtos.LoginRequest req) {
        return ApiResponse.ok(authService.login(req).toData(), "Login successful");
    }

    @PostMapping("/admin/login")
    public ApiResponse<Map<String, Object>> adminLogin(@Valid @RequestBody AuthDtos.LoginRequest req) {
        return ApiResponse.ok(authService.adminLogin(req).toData(), "Admin login successful");
    }

    @PostMapping("/refresh")
    public ApiResponse<Map<String, Object>> refresh(@RequestBody(required = false) AuthDtos.RefreshRequest req) {
        String token = req != null ? req.refreshToken() : null;
        var result = authService.refresh(token);
        return ApiResponse.ok(
                Map.of("accessToken", result.accessToken(), "refreshToken", result.refreshToken()),
                "Token refreshed");
    }

    @PostMapping("/logout")
    public ApiResponse<Object> logout(@AuthenticationPrincipal AppUserPrincipal principal) {
        authService.logout(principal.getId());
        return ApiResponse.ok(null, "Logged out successfully");
    }

    @GetMapping("/me")
    public ApiResponse<?> getMe(@AuthenticationPrincipal AppUserPrincipal principal) {
        return ApiResponse.ok(authService.getMe(principal.getId()), "User fetched successfully");
    }

    @PutMapping("/profile")
    public ApiResponse<?> updateProfile(@AuthenticationPrincipal AppUserPrincipal principal,
                                        @RequestBody AuthDtos.UpdateProfileRequest req) {
        return ApiResponse.ok(authService.updateProfile(principal.getId(), req), "Profile updated successfully");
    }
}
