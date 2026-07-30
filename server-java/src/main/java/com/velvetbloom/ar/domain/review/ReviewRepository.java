package com.velvetbloom.ar.domain.review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    @Query("select r from Review r where r.menuItem = :menuItem and r.isApproved = true order by r.createdAt desc")
    Page<Review> findApprovedByMenuItem(@Param("menuItem") UUID menuItem, Pageable pageable);

    @Query("select r from Review r where r.menuItem = :menuItem and r.isApproved = true")
    List<Review> findApprovedByMenuItem(@Param("menuItem") UUID menuItem);
}
