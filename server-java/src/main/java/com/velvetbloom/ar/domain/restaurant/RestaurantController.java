package com.velvetbloom.ar.domain.restaurant;

import com.velvetbloom.ar.common.ApiResponse;
import com.velvetbloom.ar.security.AppUserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService service;

    public RestaurantController(RestaurantService service) {
        this.service = service;
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<Restaurant> getBySlug(@PathVariable String slug) {
        return ApiResponse.ok(service.getBySlug(slug), "Restaurant fetched successfully");
    }

    @GetMapping("/{id}/qr-codes")
    public ApiResponse<?> allQrCodes(@PathVariable UUID id) {
        return ApiResponse.ok(service.generateAllTableQrCodes(id), "QR Codes generated");
    }

    @GetMapping("/{id}")
    public ApiResponse<Restaurant> getById(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id), "Restaurant fetched successfully");
    }

    @GetMapping("/{restaurantId}/qr/{tableNumber}")
    public ApiResponse<?> tableQr(@PathVariable UUID restaurantId, @PathVariable int tableNumber) {
        return ApiResponse.ok(service.generateTableQrCode(restaurantId, tableNumber), "QR Code generated");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Restaurant>> create(@RequestBody Restaurant restaurant,
                                                          @AuthenticationPrincipal AppUserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(restaurant, principal.getId()), "Restaurant created successfully"));
    }

    @PutMapping("/{id}")
    public ApiResponse<Restaurant> update(@PathVariable UUID id, @RequestBody Restaurant restaurant) {
        return ApiResponse.ok(service.update(id, restaurant), "Restaurant updated successfully");
    }

    @PostMapping("/{id}/images")
    public ApiResponse<Restaurant> uploadImages(@PathVariable UUID id,
                                                @RequestParam(value = "logo", required = false) MultipartFile logo,
                                                @RequestParam(value = "cover", required = false) MultipartFile cover) {
        return ApiResponse.ok(service.uploadImages(id, logo, cover), "Images uploaded successfully");
    }
}
