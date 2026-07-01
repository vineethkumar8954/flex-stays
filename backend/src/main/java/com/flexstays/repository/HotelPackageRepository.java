package com.flexstays.repository;

import com.flexstays.entity.HotelPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelPackageRepository extends JpaRepository<HotelPackage, Long> {
    Optional<HotelPackage> findBySlug(String slug);
}
