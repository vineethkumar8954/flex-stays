package com.flexstays.controller;

import com.flexstays.dto.response.ApiResponse;
import com.flexstays.service.HousekeepingService;
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
@RequestMapping("/housekeeping")
@PreAuthorize("hasAnyRole('ADMIN','HOUSEKEEPING')")
@Tag(name = "Housekeeping", description = "Room cleaning management")
@SecurityRequirement(name = "Bearer Authentication")
public class HousekeepingController {

    private final HousekeepingService housekeepingService;

    @Autowired
    public HousekeepingController(HousekeepingService housekeepingService) {
        this.housekeepingService = housekeepingService;
    }

    @GetMapping("/rooms/dirty")
    @Operation(summary = "Get all dirty rooms requiring cleaning")
    public ResponseEntity<ApiResponse<?>> getDirtyRooms() {
        return ResponseEntity.ok(ApiResponse.ok(housekeepingService.getRoomsByHousekeepingStatus("DIRTY")));
    }

    @GetMapping("/rooms/cleaning")
    @Operation(summary = "Get rooms currently being cleaned")
    public ResponseEntity<ApiResponse<?>> getCleaningRooms() {
        return ResponseEntity.ok(ApiResponse.ok(housekeepingService.getRoomsByHousekeepingStatus("CLEANING")));
    }

    @GetMapping("/rooms/clean")
    @Operation(summary = "Get all clean rooms")
    public ResponseEntity<ApiResponse<?>> getCleanRooms() {
        return ResponseEntity.ok(ApiResponse.ok(housekeepingService.getRoomsByHousekeepingStatus("CLEAN")));
    }

    @PostMapping("/rooms/{roomNumber}/start-cleaning")
    @Operation(summary = "Start cleaning a room — marks as CLEANING")
    public ResponseEntity<ApiResponse<?>> startCleaning(
            @PathVariable String roomNumber,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Cleaning started", housekeepingService.startCleaning(roomNumber, staff.getUsername())));
    }

    @PostMapping("/rooms/{roomNumber}/complete-cleaning")
    @Operation(summary = "Complete cleaning — marks room as CLEAN and AVAILABLE")
    public ResponseEntity<ApiResponse<?>> completeCleaning(
            @PathVariable String roomNumber,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Room marked clean", housekeepingService.completeCleaning(roomNumber, staff.getUsername())));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Housekeeping dashboard summary")
    public ResponseEntity<ApiResponse<?>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(housekeepingService.getDashboardSummary()));
    }
}
