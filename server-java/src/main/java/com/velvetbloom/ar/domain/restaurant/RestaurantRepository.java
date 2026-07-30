package com.velvetbloom.ar.domain.restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface RestaurantRepository extends JpaRepository<Restaurant, UUID> {

    @Query("select r from Restaurant r where r.slug = :slug and r.isActive = true")
    Optional<Restaurant> findActiveBySlug(@Param("slug") String slug);

    boolean existsBySlug(String slug);
}
