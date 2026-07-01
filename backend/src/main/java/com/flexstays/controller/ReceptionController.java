package com.flexstays.controller;

import com.flexstays.dto.response.ApiResponse;
import com.flexstays.service.ReceptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reception")
@PreAuthorize("hasAnyRole('ADMIN','RECEPTION')")
@Tag(name = "Reception", description = "Reception desk operations")
@SecurityRequirement(name = "Bearer Authentication")
public class ReceptionController {

    private final ReceptionService receptionService;

    @Autowired
    public ReceptionController(ReceptionService receptionService) {
        this.receptionService = receptionService;
    }

    @GetMapping("/arrivals")
    @Operation(summary = "Today's expected arrivals")
    public ResponseEntity<ApiResponse<?>> getTodayArrivals() {
        return ResponseEntity.ok(ApiResponse.ok(receptionService.getTodayArrivals()));
    }

    @GetMapping("/departures")
    @Operation(summary = "Today's expected departures")
    public ResponseEntity<ApiResponse<?>> getTodayDepartures() {
        return ResponseEntity.ok(ApiResponse.ok(receptionService.getTodayDepartures()));
    }

    @PostMapping("/check-in/{bookingId}")
    @Operation(summary = "Check in a guest")
    public ResponseEntity<ApiResponse<?>> checkIn(
            @PathVariable Long bookingId,
            @RequestParam String roomNumber,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Guest checked in", receptionService.checkIn(bookingId, roomNumber, staff.getUsername())));
    }

    @PostMapping("/check-out/{bookingId}")
    @Operation(summary = "Check out a guest and mark room dirty")
    public ResponseEntity<ApiResponse<?>> checkOut(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Guest checked out", receptionService.checkOut(bookingId, staff.getUsername())));
    }

    @GetMapping("/available-rooms")
    @Operation(summary = "List all currently available rooms for walk-in allocation")
    public ResponseEntity<ApiResponse<?>> getAvailableRooms() {
        return ResponseEntity.ok(ApiResponse.ok(receptionService.getAvailableRooms()));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Reception dashboard summary")
    public ResponseEntity<ApiResponse<?>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(receptionService.getDashboardSummary()));
    }
}
