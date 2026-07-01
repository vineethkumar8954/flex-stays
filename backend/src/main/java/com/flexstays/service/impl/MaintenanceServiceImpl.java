package com.flexstays.service.impl;

import com.flexstays.entity.MaintenanceRequest;
import com.flexstays.entity.Room;
import com.flexstays.entity.Staff;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.MaintenanceRequestRepository;
import com.flexstays.repository.RoomRepository;
import com.flexstays.repository.StaffRepository;
import com.flexstays.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final RoomRepository roomRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public MaintenanceServiceImpl(MaintenanceRequestRepository maintenanceRequestRepository,
                                  RoomRepository roomRepository, StaffRepository staffRepository) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.roomRepository = roomRepository;
        this.staffRepository = staffRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequest> getAllTickets(String status) {
        if (status != null && !status.isEmpty()) {
            return maintenanceRequestRepository.findByStatus(MaintenanceRequest.MaintenanceStatus.valueOf(status.toUpperCase()));
        }
        return maintenanceRequestRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceRequest getTicketById(Long id) {
        return maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance ticket not found"));
    }

    @Override
    @Transactional
    public MaintenanceRequest createTicket(String roomNumber, String issueType, String priority,
                                            String title, String description, String staffEmail) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        Staff reporter = staffRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter staff member not found"));

        MaintenanceRequest req = new MaintenanceRequest();
        req.setTicketRef("MNT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        req.setRoom(room);
        req.setReportedBy(reporter);
        req.setIssueType(MaintenanceRequest.IssueType.valueOf(issueType.toUpperCase()));
        req.setPriority(MaintenanceRequest.Priority.valueOf(priority.toUpperCase()));
        req.setTitle(title);
        req.setDescription(description);
        req.setStatus(MaintenanceRequest.MaintenanceStatus.OPEN);
        req.setCreatedAt(java.time.LocalDateTime.now());

        // Block room from availability if maintenance is critical/high
        if (req.getPriority() == MaintenanceRequest.Priority.CRITICAL || req.getPriority() == MaintenanceRequest.Priority.HIGH) {
            req.setAffectsAvailability(true);
            room.setStatus(Room.RoomStatus.MAINTENANCE);
            roomRepository.save(room);
        }

        return maintenanceRequestRepository.save(req);
    }

    @Override
    @Transactional
    public MaintenanceRequest assignTicket(Long id, String technicianEmail) {
        MaintenanceRequest req = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance ticket not found"));

        Staff tech = staffRepository.findByEmail(technicianEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Technician staff member not found"));

        req.setAssignedTo(tech);
        req.setStatus(MaintenanceRequest.MaintenanceStatus.IN_PROGRESS);
        return maintenanceRequestRepository.save(req);
    }

    @Override
    @Transactional
    public MaintenanceRequest resolveTicket(Long id, String resolutionNotes, String staffEmail) {
        MaintenanceRequest req = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance ticket not found"));

        req.setStatus(MaintenanceRequest.MaintenanceStatus.RESOLVED);
        req.setResolutionNotes(resolutionNotes);
        req.setResolvedAt(java.time.LocalDateTime.now());

        Room room = req.getRoom();
        if (room.getStatus() == Room.RoomStatus.MAINTENANCE) {
            room.setStatus(Room.RoomStatus.AVAILABLE);
            room.setHousekeeping(Room.HousekeepingStatus.CLEAN);
            roomRepository.save(room);
        }

        return maintenanceRequestRepository.save(req);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardSummary() {
        long openTickets = maintenanceRequestRepository.countByStatus(MaintenanceRequest.MaintenanceStatus.OPEN);
        long inProgress = maintenanceRequestRepository.countByStatus(MaintenanceRequest.MaintenanceStatus.IN_PROGRESS);
        long resolved = maintenanceRequestRepository.countByStatus(MaintenanceRequest.MaintenanceStatus.RESOLVED);

        Map<String, Object> summary = new HashMap<>();
        summary.put("openTicketsCount", openTickets);
        summary.put("inProgressTicketsCount", inProgress);
        summary.put("resolvedTicketsCount", resolved);
        return summary;
    }
}
