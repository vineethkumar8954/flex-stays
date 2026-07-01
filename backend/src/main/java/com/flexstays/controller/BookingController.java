package com.flexstays.controller;

import com.flexstays.dto.request.BookingRequest;
import com.flexstays.dto.response.ApiResponse;
import com.flexstays.dto.response.BookingResponse;
import com.flexstays.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@Tag(name = "Bookings", description = "Room booking management")
@SecurityRequirement(name = "Bearer Authentication")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ── Create booking ───────────────────────────────────────────────────────
    @PostMapping
    @Operation(summary = "Create a new room booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponse booking = bookingService.createBooking(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Booking created successfully", booking));
    }

    // ── Get my bookings ──────────────────────────────────────────────────────
    @GetMapping("/my")
    @Operation(summary = "Get all bookings for the logged-in guest")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = bookingService.getBookingsByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    // ── Get booking by ID ────────────────────────────────────────────────────
    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponse booking = bookingService.getBookingById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    // ── Cancel booking ───────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        bookingService.cancelBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully"));
    }

    // ── All bookings (Admin/Reception) ───────────────────────────────────────
    @GetMapping
    @Operation(summary = "Get all bookings — Admin/Reception only")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getAllBookings()));
    }

    // ── Room availability check ──────────────────────────────────────────────
    @GetMapping("/availability")
    @Operation(summary = "Check room availability for date range")
    public ResponseEntity<ApiResponse<Boolean>> checkAvailability(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        boolean available = bookingService.isRoomAvailable(roomId, checkIn, checkOut);
        return ResponseEntity.ok(ApiResponse.ok(available ? "Room is available" : "Room is not available for selected dates", available));
    }
}
