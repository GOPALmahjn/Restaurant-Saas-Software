package com.velvetbloom.ar.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/** Mirrors the Node /health endpoint. */
@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "success", true,
                "message", "Restaurant AR API is running",
                "timestamp", Instant.now().toString()
        );
    }
}
