package com.velvetbloom.ar.domain.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MenuItemRepository extends JpaRepository<MenuItem, UUID>, JpaSpecificationExecutor<MenuItem> {

    @Query("select m from MenuItem m where m.restaurantId = :rid and m.isFeatured = true and m.isAvailable = true")
    List<MenuItem> findFeatured(@Param("rid") UUID restaurantId);

    @Query("select m from MenuItem m where m.restaurantId = :rid and m.isRecommended = true and m.isAvailable = true")
    List<MenuItem> findRecommended(@Param("rid") UUID restaurantId);

    @Query("select m from MenuItem m where m.restaurantId = :rid and m.isAvailable = true order by m.totalOrders desc")
    List<MenuItem> findTopByOrders(@Param("rid") UUID restaurantId, org.springframework.data.domain.Pageable pageable);

    @Query("select count(m) from MenuItem m where m.restaurantId = :rid and m.isAvailable = true")
    long countAvailable(@Param("rid") UUID restaurantId);
}
