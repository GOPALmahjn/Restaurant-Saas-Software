package com.velvetbloom.ar.domain.analytics;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "analytics",
        uniqueConstraints = @UniqueConstraint(name = "uq_analytics_restaurant_date", columnNames = {"restaurant_id", "date"}))
public class Analytics {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "restaurant_id", nullable = false)
    private UUID restaurantId;

    @Column(nullable = false)
    private LocalDate date;

    private double revenue = 0;
    private int orderCount = 0;
    private int customerCount = 0;
    private double averageOrderValue = 0;
    private int arViewCount = 0;
    private int menuViewCount = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<TopItem> topItems = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<CategoryBreakdown> categoryBreakdown = new ArrayList<>();

    public record TopItem(UUID menuItem, String name, Integer count, Double revenue) {}
    public record CategoryBreakdown(UUID category, String name, Integer count, Double revenue) {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getRestaurantId() { return restaurantId; }
    public void setRestaurantId(UUID restaurantId) { this.restaurantId = restaurantId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public double getRevenue() { return revenue; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
    public int getOrderCount() { return orderCount; }
    public void setOrderCount(int orderCount) { this.orderCount = orderCount; }
    public int getCustomerCount() { return customerCount; }
    public void setCustomerCount(int customerCount) { this.customerCount = customerCount; }
    public double getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }
    public int getArViewCount() { return arViewCount; }
    public void setArViewCount(int arViewCount) { this.arViewCount = arViewCount; }
    public int getMenuViewCount() { return menuViewCount; }
    public void setMenuViewCount(int menuViewCount) { this.menuViewCount = menuViewCount; }
    public List<TopItem> getTopItems() { return topItems; }
    public void setTopItems(List<TopItem> topItems) { this.topItems = topItems; }
    public List<CategoryBreakdown> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryBreakdown> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }
}
