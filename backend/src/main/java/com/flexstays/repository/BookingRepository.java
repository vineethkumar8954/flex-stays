package com.flexstays.repository;

import com.flexstays.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingRef(String bookingRef);
    List<Booking> findByUserEmailOrderByCreatedAtDesc(String email);
    List<Booking> findByStatus(Booking.BookingStatus status);
    @Query("SELECT b FROM Booking b WHERE b.checkIn = :date")
    List<Booking> findByCheckIn(@Param("date") LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.checkOut = :date")
    List<Booking> findByCheckOut(@Param("date") LocalDate date);

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.room.id = :roomId
          AND b.status IN ('CONFIRMED','CHECKED_IN')
          AND b.checkIn < :checkOut
          AND b.checkOut > :checkIn
    """)
    boolean existsOverlappingBooking(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'CAPTURED' AND DATE(p.paidAt) = :date")
    java.math.BigDecimal sumRevenueByDate(@Param("date") LocalDate date);
}
