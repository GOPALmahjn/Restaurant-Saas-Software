package com.velvetbloom.ar.domain.review;

import com.velvetbloom.ar.common.ApiException;
import com.velvetbloom.ar.domain.menu.MenuItem;
import com.velvetbloom.ar.domain.menu.MenuItemRepository;
import com.velvetbloom.ar.service.CloudinaryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MenuItemRepository menuItemRepository;
    private final CloudinaryService cloudinary;

    public ReviewService(ReviewRepository reviewRepository, MenuItemRepository menuItemRepository,
                         CloudinaryService cloudinary) {
        this.reviewRepository = reviewRepository;
        this.menuItemRepository = menuItemRepository;
        this.cloudinary = cloudinary;
    }

    public Page<Review> getReviews(UUID menuItemId, int page, int limit) {
        int p = Math.max(page, 1);
        int l = limit > 0 ? limit : 10;
        return reviewRepository.findApprovedByMenuItem(menuItemId, PageRequest.of(p - 1, l));
    }

    @Transactional
    public Review createReview(UUID menuItemId, UUID restaurantId, int rating, String comment,
                               String userName, String userAvatar, UUID userId, List<MultipartFile> images) {
        Review review = new Review();
        review.setMenuItem(menuItemId);
        review.setRestaurantId(restaurantId);
        review.setUser(new Review.ReviewUser(userId, userName, userAvatar));
        review.setRating(rating);
        review.setComment(comment);
        if (images != null && !images.isEmpty()) {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) urls.add(cloudinary.uploadImage(file, "reviews"));
            }
            review.setImages(urls);
        }
        Review saved = reviewRepository.save(review);
        recomputeRating(menuItemId);
        return saved;
    }

    @Transactional
    public void deleteReview(UUID id) {
        if (!reviewRepository.existsById(id)) throw ApiException.notFound("Review not found");
        reviewRepository.deleteById(id);
    }

    private void recomputeRating(UUID menuItemId) {
        List<Review> reviews = reviewRepository.findApprovedByMenuItem(menuItemId);
        if (reviews.isEmpty()) return;
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        menuItemRepository.findById(menuItemId).ifPresent(item -> {
            item.setRating(Math.round(avg * 10) / 10.0);
            item.setTotalReviews(reviews.size());
            menuItemRepository.save(item);
        });
    }
}
