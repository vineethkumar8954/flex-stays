package com.flexstays.repository;

import com.flexstays.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByRazorpayPaymentId(String paymentId);

    @Query("SELECT COALESCE(SUM(p.amount),0) FROM Payment p WHERE p.status='CAPTURED' AND DATE(p.paidAt) = :date")
    BigDecimal sumRevenueByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(p.amount),0) FROM Payment p WHERE p.status='CAPTURED' AND DATE(p.paidAt) BETWEEN :from AND :to")
    BigDecimal sumRevenueBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
