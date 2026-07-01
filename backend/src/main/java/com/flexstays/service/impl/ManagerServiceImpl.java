package com.flexstays.service.impl;

import com.flexstays.entity.Event;
import com.flexstays.entity.Staff;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.BookingRepository;
import com.flexstays.repository.EventRepository;
import com.flexstays.repository.PaymentRepository;
import com.flexstays.repository.RoomRepository;
import com.flexstays.repository.StaffRepository;
import com.flexstays.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ManagerServiceImpl implements ManagerService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public ManagerServiceImpl(PaymentRepository paymentRepository, BookingRepository bookingRepository,
                              EventRepository eventRepository, RoomRepository roomRepository,
                              StaffRepository staffRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
        this.staffRepository = staffRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardSummary() {
        BigDecimal totalRevenueThisMonth = paymentRepository.sumRevenueBetween(
                LocalDate.now().withDayOfMonth(1), LocalDate.now());
        if (totalRevenueThisMonth == null) totalRevenueThisMonth = BigDecimal.ZERO;

        long occupiedRooms = roomRepository.countByStatus(com.flexstays.entity.Room.RoomStatus.OCCUPIED);
        long availableRooms = roomRepository.countByStatus(com.flexstays.entity.Room.RoomStatus.AVAILABLE);
        long pendingEvents = eventRepository.countByStatus(Event.EventStatus.PENDING);

        Map<String, Object> summary = new HashMap<>();
        summary.put("revenueThisMonth", totalRevenueThisMonth);
        summary.put("occupiedRoomsCount", occupiedRooms);
        summary.put("availableRoomsCount", availableRooms);
        summary.put("pendingEventsCount", pendingEvents);
        return summary;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getRevenueReport(int days) {
        Map<String, Object> report = new HashMap<>();
        List<String> dates = new ArrayList<>();
        List<BigDecimal> amounts = new ArrayList<>();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            BigDecimal dayRev = paymentRepository.sumRevenueByDate(date);
            dates.add(date.toString());
            amounts.add(dayRev != null ? dayRev : BigDecimal.ZERO);
        }

        report.put("labels", dates);
        report.put("revenue", amounts);
        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOccupancyReport(int days) {
        Map<String, Object> report = new HashMap<>();
        List<String> dates = new ArrayList<>();
        List<Double> rates = new ArrayList<>();

        long totalRooms = roomRepository.count();
        if (totalRooms == 0) totalRooms = 1; // Prevent division by zero

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            // Mock occupancy rate for analytics dashboard demo
            dates.add(date.toString());
            rates.add(50.0 + (Math.random() * 40.0)); // Random 50%-90% range for demo/presentation
        }

        report.put("labels", dates);
        report.put("occupancyRates", rates);
        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(Event.EventStatus.PENDING);
    }

    @Override
    @Transactional
    public Event approveEvent(Long eventId, Double estimatedCost, String managerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event proposal not found"));

        Staff manager = staffRepository.findByEmail(managerEmail).orElse(null);

        event.setStatus(Event.EventStatus.APPROVED);
        if (estimatedCost != null) {
            event.setEstimatedCost(BigDecimal.valueOf(estimatedCost));
        }
        event.setApprovedBy(manager);
        event.setApprovedAt(java.time.LocalDateTime.now());

        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event rejectEvent(Long eventId, String reason, String managerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event proposal not found"));

        event.setStatus(Event.EventStatus.REJECTED);
        event.setRejectionReason(reason);

        return eventRepository.save(event);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getStaffPerformance() {
        // Mock staff performance report for analytics
        Map<String, Object> perf = new HashMap<>();
        perf.put("housekeepingPerformance", 92.5); // Average cleaning time compliance %
        perf.put("receptionEfficiency", 88.0); // Guest check-in satisfaction score %
        perf.put("maintenanceCompliance", 95.0); // Ticket resolution within SLA %
        return perf;
    }
}
