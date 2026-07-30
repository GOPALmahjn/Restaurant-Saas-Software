package com.velvetbloom.ar.domain.order;

import com.velvetbloom.ar.common.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> create(@RequestBody OrderDtos.CreateOrderRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.createOrder(req), "Order placed successfully"));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ApiResponse<?> getOrders(@PathVariable UUID restaurantId,
                                    @RequestParam(required = false) String status,
                                    @RequestParam(required = false) String search,
                                    @RequestParam(required = false) String startDate,
                                    @RequestParam(required = false) String endDate,
                                    @RequestParam(defaultValue = "1") int page,
                                    @RequestParam(defaultValue = "20") int limit) {
        Page<Order> result = service.getOrders(restaurantId, status, search, startDate, endDate, page, limit);
        return ApiResponse.paginated(result.getContent(),
                ApiResponse.Pagination.of(result.getTotalElements(), page, limit), "Orders fetched");
    }

    @GetMapping("/track/{orderNumber}")
    public ApiResponse<Order> track(@PathVariable String orderNumber) {
        return ApiResponse.ok(service.getByOrderNumber(orderNumber), "Order fetched");
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> getOrder(@PathVariable UUID id) {
        return ApiResponse.ok(service.getOrder(id), "Order fetched");
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Order> updateStatus(@PathVariable UUID id, @RequestBody OrderDtos.UpdateStatusRequest req) {
        return ApiResponse.ok(service.updateStatus(id, req.status(), req.note()), "Order status updated");
    }

    @PostMapping("/validate-coupon")
    public ApiResponse<?> validateCoupon(@RequestBody OrderDtos.ValidateCouponRequest req) {
        return ApiResponse.ok(service.validateCoupon(req), "Coupon applied successfully");
    }
}
