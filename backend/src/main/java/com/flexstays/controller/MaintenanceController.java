package com.flexstays.controller;

import com.flexstays.dto.response.ApiResponse;
import com.flexstays.service.MaintenanceService;
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
@RequestMapping("/maintenance")
@PreAuthorize("hasAnyRole('ADMIN','MAINTENANCE')")
@Tag(name = "Maintenance", description = "Maintenance ticket management")
@SecurityRequirement(name = "Bearer Authentication")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @Autowired
    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/tickets")
    @Operation(summary = "Get all maintenance tickets")
    public ResponseEntity<ApiResponse<?>> getAllTickets(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.getAllTickets(status)));
    }

    @GetMapping("/tickets/{id}")
    @Operation(summary = "Get ticket by ID")
    public ResponseEntity<ApiResponse<?>> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.getTicketById(id)));
    }

    @PostMapping("/tickets")
    @Operation(summary = "Create a new maintenance ticket")
    public ResponseEntity<ApiResponse<?>> createTicket(
            @RequestBody CreateTicketRequest req,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket created", maintenanceService.createTicket(req.getRoomNumber(), req.getIssueType(), req.getPriority(), req.getTitle(), req.getDescription(), staff.getUsername())));
    }

    @PatchMapping("/tickets/{id}/assign")
    @Operation(summary = "Assign ticket to technician")
    public ResponseEntity<ApiResponse<?>> assignTicket(
            @PathVariable Long id,
            @RequestParam String technicianEmail) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket assigned", maintenanceService.assignTicket(id, technicianEmail)));
    }

    @PatchMapping("/tickets/{id}/resolve")
    @Operation(summary = "Resolve a maintenance ticket")
    public ResponseEntity<ApiResponse<?>> resolveTicket(
            @PathVariable Long id,
            @RequestParam String resolutionNotes,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket resolved", maintenanceService.resolveTicket(id, resolutionNotes, staff.getUsername())));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Maintenance dashboard summary")
    public ResponseEntity<ApiResponse<?>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.getDashboardSummary()));
    }

    static class CreateTicketRequest {
        private String roomNumber;
        private String issueType;
        private String priority;
        private String title;
        private String description;

        public String getRoomNumber()  { return roomNumber;  }
        public String getIssueType()   { return issueType;   }
        public String getPriority()    { return priority;    }
        public String getTitle()       { return title;       }
        public String getDescription() { return description; }

        public void setRoomNumber(String v)  { this.roomNumber = v;  }
        public void setIssueType(String v)   { this.issueType = v;   }
        public void setPriority(String v)    { this.priority = v;    }
        public void setTitle(String v)       { this.title = v;       }
        public void setDescription(String v) { this.description = v; }
    }
}
