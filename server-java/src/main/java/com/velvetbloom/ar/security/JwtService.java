package com.velvetbloom.ar.security;

import com.velvetbloom.ar.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/** Issues and validates HS256 access / refresh tokens (jjwt). */
@Service
public class JwtService {

    private final SecretKey accessKey;
    private final SecretKey refreshKey;
    private final long accessTtlMs;
    private final long refreshTtlMs;

    public JwtService(AppProperties props) {
        this.accessKey = Keys.hmacShaKeyFor(props.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
        this.refreshKey = Keys.hmacShaKeyFor(props.getJwt().getRefreshSecret().getBytes(StandardCharsets.UTF_8));
        this.accessTtlMs = props.getJwt().getAccessExpirationMs();
        this.refreshTtlMs = props.getJwt().getRefreshExpirationMs();
    }

    public String generateAccessToken(UUID userId, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + accessTtlMs))
                .signWith(accessKey)
                .compact();
    }

    public String generateRefreshToken(UUID userId) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userId.toString())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + refreshTtlMs))
                .signWith(refreshKey)
                .compact();
    }

    public UUID parseAccessToken(String token) {
        Claims claims = Jwts.parser().verifyWith(accessKey).build().parseSignedClaims(token).getPayload();
        return UUID.fromString(claims.getSubject());
    }

    public UUID parseRefreshToken(String token) {
        Claims claims = Jwts.parser().verifyWith(refreshKey).build().parseSignedClaims(token).getPayload();
        return UUID.fromString(claims.getSubject());
    }

    public long getRefreshTtlMs() {
        return refreshTtlMs;
    }
}
