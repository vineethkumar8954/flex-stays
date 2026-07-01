package com.flexstays.controller;

import com.flexstays.dto.response.ApiResponse;
import com.flexstays.dto.response.RoomResponse;
import com.flexstays.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rooms")
@Tag(name = "Rooms", description = "Room inventory and availability")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    @Operation(summary = "Get all rooms (public)")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAllRooms(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getAllRooms(category, status)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID (public)")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getRoomById(id)));
    }

    @GetMapping("/number/{roomNumber}")
    @Operation(summary = "Get room by room number")
    public ResponseEntity<ApiResponse<RoomResponse>> getByRoomNumber(@PathVariable String roomNumber) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getByRoomNumber(roomNumber)));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available rooms for date range")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "1") int guests) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getAvailableRooms(checkIn, checkOut, guests)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTION','HOUSEKEEPING','MAINTENANCE')")
    @Operation(summary = "Update room status — Staff only")
    public ResponseEntity<ApiResponse<RoomResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String housekeeping) {
        return ResponseEntity.ok(ApiResponse.ok("Room status updated", roomService.updateRoomStatus(id, status, housekeeping)));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','RECEPTION')")
    @Operation(summary = "Get room occupancy summary — Staff only")
    public ResponseEntity<ApiResponse<?>> getRoomSummary() {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getRoomSummary()));
    }
}
