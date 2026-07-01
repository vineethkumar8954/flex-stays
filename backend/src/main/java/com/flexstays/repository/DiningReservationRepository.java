package com.flexstays.repository;

import com.flexstays.entity.DiningReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DiningReservationRepository extends JpaRepository<DiningReservation, Long> {
    List<DiningReservation> findByUserEmailOrderByReservationDateDesc(String email);
    List<DiningReservation> findByStatus(DiningReservation.DiningStatus status);
}
