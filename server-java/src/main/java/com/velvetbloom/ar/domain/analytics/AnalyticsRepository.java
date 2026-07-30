package com.velvetbloom.ar.domain.analytics;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AnalyticsRepository extends JpaRepository<Analytics, UUID> {

    Optional<Analytics> findByRestaurantIdAndDate(UUID restaurantId, LocalDate date);

    List<Analytics> findByRestaurantIdAndDateBetweenOrderByDateAsc(UUID restaurantId, LocalDate start, LocalDate end);

    @Query("""
            select coalesce(sum(a.revenue),0), coalesce(sum(a.orderCount),0), coalesce(sum(a.customerCount),0)
            from Analytics a
            where a.restaurantId = :restaurantId and a.date >= :start
            """)
    Object[] sumSince(@Param("restaurantId") UUID restaurantId, @Param("start") LocalDate start);
}
