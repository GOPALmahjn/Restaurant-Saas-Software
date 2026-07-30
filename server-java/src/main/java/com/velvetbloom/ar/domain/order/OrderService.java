package com.velvetbloom.ar.domain.order;

import com.velvetbloom.ar.common.ApiException;
import com.velvetbloom.ar.domain.analytics.AnalyticsService;
import com.velvetbloom.ar.domain.coupon.Coupon;
import com.velvetbloom.ar.domain.coupon.CouponRepository;
import com.velvetbloom.ar.domain.menu.MenuItem;
import com.velvetbloom.ar.domain.menu.MenuItemRepository;
import com.velvetbloom.ar.domain.restaurant.Restaurant;
import com.velvetbloom.ar.domain.restaurant.RestaurantRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final CouponRepository couponRepository;
    private final RestaurantRepository restaurantRepository;
    private final AnalyticsService analyticsService;

    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository,
                        CouponRepository couponRepository, RestaurantRepository restaurantRepository,
                        AnalyticsService analyticsService) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.couponRepository = couponRepository;
        this.restaurantRepository = restaurantRepository;
        this.analyticsService = analyticsService;
    }

    @Transactional
    public Order createOrder(OrderDtos.CreateOrderRequest req) {
        if (req.items() == null || req.items().isEmpty()) {
            throw ApiException.badRequest("Order must contain at least one item");
        }
        double subtotal = 0;
        List<Order.Line> lines = new ArrayList<>();
        for (OrderDtos.ItemInput input : req.items()) {
            MenuItem menuItem = menuItemRepository.findById(input.menuItemId())
                    .filter(MenuItem::isAvailable)
                    .orElseThrow(() -> ApiException.badRequest("Item is not available"));
            double customizationPrice = input.customizations() == null ? 0 :
                    input.customizations().stream().mapToDouble(c -> c.price() == null ? 0 : c.price()).sum();
            double unit = menuItem.getDiscountedPrice() != null ? menuItem.getDiscountedPrice() : menuItem.getPrice();
            double itemTotal = (unit + customizationPrice) * input.quantity();
            subtotal += itemTotal;

            menuItem.setTotalOrders(menuItem.getTotalOrders() + 1);
            menuItemRepository.save(menuItem);

            List<Order.LineCustomization> lineCust = new ArrayList<>();
            if (input.customizations() != null) {
                input.customizations().forEach(c -> lineCust.add(
                        new Order.LineCustomization(c.name(), c.option(), c.price())));
            }
            lines.add(new Order.Line(menuItem.getId(), menuItem.getName(), unit, input.quantity(),
                    menuItem.getThumbnail(), lineCust, itemTotal));
        }

        double couponDiscount = 0;
        String appliedCoupon = null;
        if (req.couponCode() != null && !req.couponCode().isBlank()) {
            Coupon coupon = couponRepository
                    .findByCodeAndRestaurantIdAndIsActiveTrue(req.couponCode().toUpperCase(), req.restaurantId())
                    .orElse(null);
            if (coupon != null && coupon.getUsedCount() < coupon.getUsageLimit()
                    && subtotal >= coupon.getMinimumOrder()) {
                couponDiscount = computeDiscount(coupon, subtotal);
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
                appliedCoupon = coupon.getCode();
            }
        }

        Restaurant restaurant = restaurantRepository.findById(req.restaurantId()).orElse(null);
        double taxRate = restaurant != null ? restaurant.getTaxRate() : 5;
        double deliveryCharges = restaurant != null ? restaurant.getDeliveryCharges() : 0;
        double taxAmount = (subtotal - couponDiscount) * taxRate / 100;
        double totalAmount = subtotal - couponDiscount + taxAmount + deliveryCharges;

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setRestaurantId(req.restaurantId());
        OrderDtos.CustomerInput c = req.customer();
        if (c == null || c.name() == null || c.phone() == null) {
            throw ApiException.badRequest("Customer name and phone are required");
        }
        order.setCustomer(new Order.Customer(c.userId(), c.name(), c.phone(), c.email()));
        order.setTableNumber(req.tableNumber());
        order.setItems(lines);
        order.setPaymentMethod(req.paymentMethod() != null ? req.paymentMethod() : "cash");
        order.setCouponCode(appliedCoupon);
        order.setCouponDiscount(couponDiscount);
        order.setSubtotal(subtotal);
        order.setTaxAmount(taxAmount);
        order.setDeliveryCharges(deliveryCharges);
        order.setTotalAmount(totalAmount);
        order.setSpecialInstructions(req.specialInstructions());
        order.setTimeline(new ArrayList<>(List.of(
                new Order.TimelineEntry("pending", Instant.now(), "Order placed"))));

        Order saved = orderRepository.save(order);
        analyticsService.recordOrder(req.restaurantId(), saved);
        return saved;
    }

    public Page<Order> getOrders(UUID restaurantId, String status, String search,
                                 String startDate, String endDate, int page, int limit) {
        int p = Math.max(page, 1);
        int l = limit > 0 ? limit : 20;
        PageRequest pageable = PageRequest.of(p - 1, l, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Order> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("restaurantId"), restaurantId));
            if (status != null && !status.equals("all")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"),
                        LocalDate.parse(startDate).atStartOfDay().toInstant(ZoneOffset.UTC)));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"),
                        LocalDate.parse(endDate).atTime(23, 59, 59).toInstant(ZoneOffset.UTC)));
            }
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("orderNumber")), "%" + search.toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return orderRepository.findAll(spec, pageable);
    }

    public Order getOrder(UUID id) {
        return orderRepository.findById(id).orElseThrow(() -> ApiException.notFound("Order not found"));
    }

    public Order getByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> ApiException.notFound("Order not found"));
    }

    @Transactional
    public Order updateStatus(UUID id, String status, String note) {
        Order order = getOrder(id);
        order.setStatus(status);
        List<Order.TimelineEntry> timeline = new ArrayList<>(order.getTimeline());
        timeline.add(new Order.TimelineEntry(status, Instant.now(), note != null ? note : "Order " + status));
        order.setTimeline(timeline);
        return orderRepository.save(order);
    }

    public Map<String, Object> validateCoupon(OrderDtos.ValidateCouponRequest req) {
        Coupon coupon = couponRepository
                .findByCodeAndRestaurantIdAndIsActiveTrue(req.code().toUpperCase(), req.restaurantId())
                .orElseThrow(() -> ApiException.badRequest("Invalid coupon code"));
        if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw ApiException.badRequest("Coupon usage limit reached");
        }
        if (coupon.getEndDate() != null && Instant.now().isAfter(coupon.getEndDate())) {
            throw ApiException.badRequest("Coupon has expired");
        }
        if (req.subtotal() < coupon.getMinimumOrder()) {
            throw ApiException.badRequest("Minimum order amount is " + coupon.getMinimumOrder());
        }
        double discount = computeDiscount(coupon, req.subtotal());
        return Map.of("coupon", coupon, "discount", Math.round(discount));
    }

    private double computeDiscount(Coupon coupon, double subtotal) {
        if ("percentage".equals(coupon.getType())) {
            double raw = subtotal * coupon.getValue() / 100;
            return coupon.getMaximumDiscount() != null ? Math.min(raw, coupon.getMaximumDiscount()) : raw;
        }
        return coupon.getValue();
    }

    private String generateOrderNumber() {
        String millis = String.valueOf(System.currentTimeMillis());
        String tail = millis.substring(Math.max(0, millis.length() - 8));
        String rand = Long.toString(ThreadLocalRandom.current().nextLong(36 * 36 * 36 * 36), 36)
                .toUpperCase();
        while (rand.length() < 4) rand = "0" + rand;
        return "ORD" + tail + rand;
    }
}
