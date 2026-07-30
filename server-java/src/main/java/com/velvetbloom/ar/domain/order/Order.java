package com.velvetbloom.ar.domain.order;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_number", columnList = "orderNumber", unique = true),
        @Index(name = "idx_order_restaurant", columnList = "restaurant_id")
})
public class Order {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @Column(name = "restaurant_id", nullable = false)
    private UUID restaurantId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Customer customer;

    private Integer tableNumber;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private List<Line> items = new ArrayList<>();

    /** pending | confirmed | preparing | ready | served | completed | cancelled */
    private String status = "pending";

    /** cash | upi | card | online */
    private String paymentMethod = "cash";

    /** pending | paid | failed | refunded */
    private String paymentStatus = "pending";

    private String couponCode;
    private double couponDiscount = 0;
    private double subtotal;
    private double taxAmount = 0;
    private double deliveryCharges = 0;
    private double totalAmount;

    @Column(columnDefinition = "text")
    private String specialInstructions;

    private int estimatedPrepTime = 20;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<TimelineEntry> timeline = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }

    // --- embedded value objects ---
    public record Customer(UUID userId, String name, String phone, String email) {}
    public record LineCustomization(String name, String option, Double price) {}
    public record Line(UUID menuItem, String name, Double price, int quantity, String image,
                       List<LineCustomization> customizations, Double subtotal) {}
    public record TimelineEntry(String status, Instant timestamp, String note) {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public UUID getRestaurantId() { return restaurantId; }
    public void setRestaurantId(UUID restaurantId) { this.restaurantId = restaurantId; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public Integer getTableNumber() { return tableNumber; }
    public void setTableNumber(Integer tableNumber) { this.tableNumber = tableNumber; }
    public List<Line> getItems() { return items; }
    public void setItems(List<Line> items) { this.items = items; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    public double getCouponDiscount() { return couponDiscount; }
    public void setCouponDiscount(double couponDiscount) { this.couponDiscount = couponDiscount; }
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    public double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(double taxAmount) { this.taxAmount = taxAmount; }
    public double getDeliveryCharges() { return deliveryCharges; }
    public void setDeliveryCharges(double deliveryCharges) { this.deliveryCharges = deliveryCharges; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public int getEstimatedPrepTime() { return estimatedPrepTime; }
    public void setEstimatedPrepTime(int estimatedPrepTime) { this.estimatedPrepTime = estimatedPrepTime; }
    public List<TimelineEntry> getTimeline() { return timeline; }
    public void setTimeline(List<TimelineEntry> timeline) { this.timeline = timeline; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
