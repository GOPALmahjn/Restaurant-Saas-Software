package com.velvetbloom.ar.domain.analytics;

import com.velvetbloom.ar.domain.menu.MenuItem;
import com.velvetbloom.ar.domain.menu.MenuItemRepository;
import com.velvetbloom.ar.domain.order.Order;
import com.velvetbloom.ar.domain.order.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository, OrderRepository orderRepository,
                            MenuItemRepository menuItemRepository) {
        this.analyticsRepository = analyticsRepository;
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    private Analytics today(UUID restaurantId) {
        LocalDate date = LocalDate.now();
        return analyticsRepository.findByRestaurantIdAndDate(restaurantId, date)
                .orElseGet(() -> {
                    Analytics a = new Analytics();
                    a.setRestaurantId(restaurantId);
                    a.setDate(date);
                    return a;
                });
    }

    @Transactional
    public void incrementArView(UUID restaurantId) {
        Analytics a = today(restaurantId);
        a.setArViewCount(a.getArViewCount() + 1);
        analyticsRepository.save(a);
    }

    @Transactional
    public void recordOrder(UUID restaurantId, Order order) {
        Analytics a = today(restaurantId);
        a.setRevenue(a.getRevenue() + order.getTotalAmount());
        a.setOrderCount(a.getOrderCount() + 1);
        a.setCustomerCount(a.getCustomerCount() + 1);
        List<Analytics.TopItem> top = new ArrayList<>(a.getTopItems());
        for (Order.Line line : order.getItems()) {
            top.add(new Analytics.TopItem(line.menuItem(), line.name(), line.quantity(), line.subtotal()));
        }
        a.setTopItems(top);
        int orders = a.getOrderCount();
        a.setAverageOrderValue(orders > 0 ? a.getRevenue() / orders : 0);
        analyticsRepository.save(a);
    }

    public Map<String, Object> getDashboardStats(UUID restaurantId) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        Analytics todayStats = analyticsRepository.findByRestaurantIdAndDate(restaurantId, today).orElse(null);
        Object[] monthAgg = analyticsRepository.sumSince(restaurantId, monthStart);

        Map<String, Object> todayMap = new LinkedHashMap<>();
        todayMap.put("revenue", todayStats != null ? todayStats.getRevenue() : 0);
        todayMap.put("orderCount", todayStats != null ? todayStats.getOrderCount() : 0);
        todayMap.put("customerCount", todayStats != null ? todayStats.getCustomerCount() : 0);
        todayMap.put("arViewCount", todayStats != null ? todayStats.getArViewCount() : 0);

        Map<String, Object> monthMap = new LinkedHashMap<>();
        monthMap.put("revenue", num(monthAgg, 0));
        monthMap.put("orders", num(monthAgg, 1));
        monthMap.put("customers", num(monthAgg, 2));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("today", todayMap);
        result.put("thisMonth", monthMap);
        result.put("totalOrders", orderRepository.countByRestaurantId(restaurantId));
        result.put("pendingOrders", orderRepository.countByRestaurantIdAndStatusIn(
                restaurantId, List.of("pending", "confirmed", "preparing")));
        result.put("totalMenuItems", menuItemRepository.countAvailable(restaurantId));
        return result;
    }

    public List<Analytics> getRevenueChart(UUID restaurantId, String period) {
        LocalDate today = LocalDate.now();
        LocalDate start = switch (period == null ? "week" : period) {
            case "month" -> today.withDayOfMonth(1);
            case "year" -> today.withDayOfYear(1);
            default -> today.minusDays(7);
        };
        return analyticsRepository.findByRestaurantIdAndDateBetweenOrderByDateAsc(restaurantId, start, today);
    }

    public List<MenuItem> getTopItems(UUID restaurantId) {
        return menuItemRepository.findTopByOrders(restaurantId, org.springframework.data.domain.PageRequest.of(0, 10));
    }

    private Number num(Object[] row, int idx) {
        if (row == null || row.length <= idx || row[idx] == null) return 0;
        return (Number) row[idx];
    }
}
