package com.flexstays.controller;

import com.flexstays.dto.response.ApiResponse;
import com.flexstays.service.ManagerService;
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
@RequestMapping("/manager")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
@Tag(name = "Manager", description = "Manager analytics and event approvals")
@SecurityRequirement(name = "Bearer Authentication")
public class ManagerController {

    private final ManagerService managerService;

    @Autowired
    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Manager dashboard — revenue, occupancy, events KPIs")
    public ResponseEntity<ApiResponse<?>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(managerService.getDashboardSummary()));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Revenue analytics — daily and monthly breakdown")
    public ResponseEntity<ApiResponse<?>> getRevenue(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.ok(managerService.getRevenueReport(days)));
    }

    @GetMapping("/occupancy")
    @Operation(summary = "Occupancy analytics — daily occupancy rate")
    public ResponseEntity<ApiResponse<?>> getOccupancy(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.ok(managerService.getOccupancyReport(days)));
    }

    @GetMapping("/events/pending")
    @Operation(summary = "Get all pending event approval requests")
    public ResponseEntity<ApiResponse<?>> getPendingEvents() {
        return ResponseEntity.ok(ApiResponse.ok(managerService.getPendingEvents()));
    }

    @PostMapping("/events/{eventId}/approve")
    @Operation(summary = "Approve an event request")
    public ResponseEntity<ApiResponse<?>> approveEvent(
            @PathVariable Long eventId,
            @RequestParam(required = false) Double estimatedCost,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Event approved", managerService.approveEvent(eventId, estimatedCost, staff.getUsername())));
    }

    @PostMapping("/events/{eventId}/reject")
    @Operation(summary = "Reject an event request")
    public ResponseEntity<ApiResponse<?>> rejectEvent(
            @PathVariable Long eventId,
            @RequestParam String reason,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Event rejected", managerService.rejectEvent(eventId, reason, staff.getUsername())));
    }

    @GetMapping("/staff-performance")
    @Operation(summary = "Staff performance summary")
    public ResponseEntity<ApiResponse<?>> getStaffPerformance() {
        return ResponseEntity.ok(ApiResponse.ok(managerService.getStaffPerformance()));
    }
}
