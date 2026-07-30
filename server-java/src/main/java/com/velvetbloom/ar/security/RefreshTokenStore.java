package com.velvetbloom.ar.security;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

/**
 * Redis-backed refresh-token store (Redis Cloud). One active refresh token per
 * user; rotating on refresh invalidates the previous one. Replaces the
 * refreshToken column the Node/Mongo version kept on the user document.
 */
@Component
public class RefreshTokenStore {

    private static final String PREFIX = "refresh:";

    private final StringRedisTemplate redis;

    public RefreshTokenStore(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public void save(UUID userId, String token, long ttlMs) {
        redis.opsForValue().set(PREFIX + userId, token, Duration.ofMillis(ttlMs));
    }

    public boolean matches(UUID userId, String token) {
        String stored = redis.opsForValue().get(PREFIX + userId);
        return stored != null && stored.equals(token);
    }

    public void delete(UUID userId) {
        redis.delete(PREFIX + userId);
    }
}
