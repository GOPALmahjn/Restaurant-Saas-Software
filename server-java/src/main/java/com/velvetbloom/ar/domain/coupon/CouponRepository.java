package com.velvetbloom.ar.domain.coupon;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CouponRepository extends JpaRepository<Coupon, UUID> {
    Optional<Coupon> findByCodeAndRestaurantIdAndIsActiveTrue(String code, UUID restaurantId);
}
