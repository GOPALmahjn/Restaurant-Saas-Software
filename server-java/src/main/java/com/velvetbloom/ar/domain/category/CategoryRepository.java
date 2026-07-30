package com.velvetbloom.ar.domain.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    @Query("select c from Category c where c.restaurantId = :rid and c.isActive = true order by c.order asc")
    List<Category> findActiveByRestaurant(@Param("rid") UUID restaurantId);

    @Query("select c from Category c where c.restaurantId = :rid order by c.order desc limit 1")
    Optional<Category> findTopOrder(@Param("rid") UUID restaurantId);
}
