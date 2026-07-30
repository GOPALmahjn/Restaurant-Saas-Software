package com.velvetbloom.ar.domain.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {
    Optional<Order> findByOrderNumber(String orderNumber);
    long countByRestaurantId(UUID restaurantId);
    long countByRestaurantIdAndStatusIn(UUID restaurantId, List<String> statuses);
}
