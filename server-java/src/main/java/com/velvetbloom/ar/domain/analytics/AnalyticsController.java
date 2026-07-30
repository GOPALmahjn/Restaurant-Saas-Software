package com.velvetbloom.ar.domain.analytics;

import com.velvetbloom.ar.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/restaurant/{restaurantId}/dashboard")
    public ApiResponse<?> dashboard(@PathVariable UUID restaurantId) {
        return ApiResponse.ok(service.getDashboardStats(restaurantId), "Dashboard stats fetched");
    }

    @GetMapping("/restaurant/{restaurantId}/revenue")
    public ApiResponse<?> revenue(@PathVariable UUID restaurantId,
                                  @RequestParam(defaultValue = "week") String period) {
        return ApiResponse.ok(service.getRevenueChart(restaurantId, period), "Revenue chart data fetched");
    }

    @GetMapping("/restaurant/{restaurantId}/top-items")
    public ApiResponse<?> topItems(@PathVariable UUID restaurantId) {
        return ApiResponse.ok(service.getTopItems(restaurantId), "Top items fetched");
    }
}
