package com.velvetbloom.ar.domain.order;

import java.util.List;
import java.util.UUID;

/** Request payloads for order endpoints. */
public final class OrderDtos {

    private OrderDtos() {}

    public record CustomizationInput(String name, String option, Double price) {}

    public record ItemInput(UUID menuItemId, int quantity, List<CustomizationInput> customizations) {}

    public record CustomerInput(UUID userId, String name, String phone, String email) {}

    public record CreateOrderRequest(
            UUID restaurantId,
            List<ItemInput> items,
            CustomerInput customer,
            Integer tableNumber,
            String paymentMethod,
            String couponCode,
            String specialInstructions) {}

    public record UpdateStatusRequest(String status, String note) {}

    public record ValidateCouponRequest(String code, UUID restaurantId, double subtotal) {}
}
