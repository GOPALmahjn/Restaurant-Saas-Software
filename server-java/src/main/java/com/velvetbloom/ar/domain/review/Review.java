package com.velvetbloom.ar.domain.review;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reviews", indexes = @Index(name = "idx_review_menu", columnList = "menu_item_id"))
public class Review {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "menu_item_id", nullable = false)
    private UUID menuItem;

    @Column(name = "restaurant_id", nullable = false)
    private UUID restaurantId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private ReviewUser user;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false, length = 500)
    private String comment;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> images = new ArrayList<>();

    private boolean isVerified = false;
    private boolean isApproved = true;
    private int helpful = 0;

    @Column(name = "order_id")
    private UUID orderId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }

    public record ReviewUser(UUID userId, String name, String avatar) {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getMenuItem() { return menuItem; }
    public void setMenuItem(UUID menuItem) { this.menuItem = menuItem; }
    public UUID getRestaurantId() { return restaurantId; }
    public void setRestaurantId(UUID restaurantId) { this.restaurantId = restaurantId; }
    public ReviewUser getUser() { return user; }
    public void setUser(ReviewUser user) { this.user = user; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
    public boolean isApproved() { return isApproved; }
    public void setApproved(boolean approved) { isApproved = approved; }
    public int getHelpful() { return helpful; }
    public void setHelpful(int helpful) { this.helpful = helpful; }
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
