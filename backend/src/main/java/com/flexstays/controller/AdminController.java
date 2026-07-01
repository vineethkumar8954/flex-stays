package com.flexstays.controller;

import com.flexstays.dto.response.ApiResponse;
import com.flexstays.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard KPI summary")
    public ResponseEntity<ApiResponse<?>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardSummary()));
    }

    @GetMapping("/staff")
    @Operation(summary = "List all staff members")
    public ResponseEntity<ApiResponse<?>> listStaff() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllStaff()));
    }

    @PostMapping("/staff")
    @Operation(summary = "Create new staff account")
    public ResponseEntity<ApiResponse<?>> createStaff(@RequestBody com.flexstays.dto.request.CreateStaffRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Staff created", adminService.createStaff(req)));
    }

    @PutMapping("/staff/{id}")
    @Operation(summary = "Update staff account")
    public ResponseEntity<ApiResponse<?>> updateStaff(@PathVariable Long id, @RequestBody com.flexstays.dto.request.CreateStaffRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Staff updated", adminService.updateStaff(id, req)));
    }

    @PatchMapping("/staff/{id}/toggle")
    @Operation(summary = "Activate or deactivate a staff account")
    public ResponseEntity<ApiResponse<?>> toggleStaff(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Status toggled", adminService.toggleStaffStatus(id)));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get system audit logs — Admin only")
    public ResponseEntity<ApiResponse<?>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAuditLogs(page, size)));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get revenue analytics")
    public ResponseEntity<ApiResponse<?>> getRevenue(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getRevenueAnalytics(days)));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get admin notifications")
    public ResponseEntity<ApiResponse<?>> getNotifications() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getNotifications()));
    }
}
