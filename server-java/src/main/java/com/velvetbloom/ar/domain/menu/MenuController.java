package com.velvetbloom.ar.domain.menu;

import com.velvetbloom.ar.common.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService service;

    public MenuController(MenuService service) {
        this.service = service;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ApiResponse<?> getMenuItems(@PathVariable UUID restaurantId,
                                       @RequestParam(required = false) UUID category,
                                       @RequestParam(required = false) String type,
                                       @RequestParam(required = false) String search,
                                       @RequestParam(defaultValue = "createdAt") String sort,
                                       @RequestParam(defaultValue = "1") int page,
                                       @RequestParam(defaultValue = "20") int limit,
                                       @RequestParam(required = false) Boolean featured,
                                       @RequestParam(required = false) Boolean available) {
        Page<MenuItem> result = service.getMenuItems(restaurantId,
                new MenuService.MenuQuery(category, type, search, sort, page, limit, featured, available));
        return ApiResponse.paginated(result.getContent(),
                ApiResponse.Pagination.of(result.getTotalElements(), page, limit), "Menu items fetched");
    }

    @GetMapping("/restaurant/{restaurantId}/featured")
    public ApiResponse<?> featured(@PathVariable UUID restaurantId) {
        return ApiResponse.ok(service.getFeatured(restaurantId), "Featured items fetched");
    }

    @GetMapping("/restaurant/{restaurantId}/recommended")
    public ApiResponse<?> recommended(@PathVariable UUID restaurantId) {
        return ApiResponse.ok(service.getRecommended(restaurantId), "Recommended items fetched");
    }

    @GetMapping("/{id}")
    public ApiResponse<MenuItem> getMenuItem(@PathVariable UUID id) {
        return ApiResponse.ok(service.getMenuItem(id), "Menu item fetched");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItem>> create(@RequestBody MenuItem item) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(item), "Menu item created successfully"));
    }

    @PutMapping("/{id}")
    public ApiResponse<MenuItem> update(@PathVariable UUID id, @RequestBody MenuItem item) {
        return ApiResponse.ok(service.update(id, item), "Menu item updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Menu item deleted successfully");
    }

    @PostMapping("/{id}/images")
    public ApiResponse<MenuItem> uploadImages(@PathVariable UUID id,
                                              @RequestParam("images") List<MultipartFile> images) {
        return ApiResponse.ok(service.uploadImages(id, images), "Images uploaded successfully");
    }

    @PostMapping("/{id}/model")
    public ApiResponse<MenuItem> uploadModel(@PathVariable UUID id,
                                             @RequestParam(value = "glb", required = false) MultipartFile glb,
                                             @RequestParam(value = "usdz", required = false) MultipartFile usdz,
                                             @RequestParam(value = "poster", required = false) MultipartFile poster) {
        return ApiResponse.ok(service.uploadModel(id, glb, usdz, poster), "3D model uploaded successfully");
    }

    @PostMapping("/{id}/ar-view")
    public ApiResponse<Object> trackArView(@PathVariable UUID id) {
        service.trackArView(id);
        return ApiResponse.ok(null, "AR view tracked");
    }
}
