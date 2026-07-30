package com.velvetbloom.ar.domain.review;

import com.velvetbloom.ar.common.ApiResponse;
import com.velvetbloom.ar.security.AppUserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping("/menu-item/{menuItemId}")
    public ApiResponse<?> getReviews(@PathVariable UUID menuItemId,
                                     @RequestParam(defaultValue = "1") int page,
                                     @RequestParam(defaultValue = "10") int limit) {
        Page<Review> result = service.getReviews(menuItemId, page, limit);
        return ApiResponse.paginated(result.getContent(),
                ApiResponse.Pagination.of(result.getTotalElements(), page, limit), "Reviews fetched");
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<ApiResponse<Review>> create(
            @RequestParam UUID menuItemId,
            @RequestParam UUID restaurantId,
            @RequestParam int rating,
            @RequestParam String comment,
            @RequestParam String userName,
            @RequestParam(required = false) String userAvatar,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal AppUserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        Review review = service.createReview(menuItemId, restaurantId, rating, comment, userName, userAvatar, userId, images);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(review, "Review submitted successfully"));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> delete(@PathVariable UUID id) {
        service.deleteReview(id);
        return ApiResponse.ok(null, "Review deleted");
    }
}
