package com.velvetbloom.ar.domain.category;

import com.velvetbloom.ar.common.ApiResponse;
import com.velvetbloom.ar.domain.category.CategoryService.CategoryDtos;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ApiResponse<?> getCategories(@PathVariable UUID restaurantId) {
        return ApiResponse.ok(service.getCategories(restaurantId), "Categories fetched successfully");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> create(@RequestBody CategoryDtos.CreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(req), "Category created successfully"));
    }

    @PutMapping("/reorder")
    public ApiResponse<Object> reorder(@RequestBody CategoryDtos.ReorderRequest req) {
        service.reorder(req.categories());
        return ApiResponse.ok(null, "Categories reordered successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<Category> update(@PathVariable UUID id, @RequestBody CategoryDtos.UpdateRequest req) {
        return ApiResponse.ok(service.update(id, req), "Category updated successfully");
    }

    @PostMapping("/{id}/image")
    public ApiResponse<Category> uploadImage(@PathVariable UUID id, @RequestParam("image") MultipartFile image) {
        return ApiResponse.ok(service.uploadImage(id, image), "Category image uploaded");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Category deleted successfully");
    }
}
