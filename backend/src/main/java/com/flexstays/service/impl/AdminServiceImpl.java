package com.flexstays.service.impl;

import com.flexstays.dto.request.CreateStaffRequest;
import com.flexstays.entity.Staff;
import com.flexstays.entity.AuditLog;
import com.flexstays.exception.BusinessException;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.*;
import com.flexstays.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class AdminServiceImpl implements AdminService {

    private final StaffRepository staffRepository;
    private final AuditLogRepository auditLogRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminServiceImpl(StaffRepository staffRepository, AuditLogRepository auditLogRepository,
                            BookingRepository bookingRepository, RoomRepository roomRepository,
                            PaymentRepository paymentRepository, NotificationRepository notificationRepository,
                            PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.auditLogRepository = auditLogRepository;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.paymentRepository = paymentRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardSummary() {
        long totalBookings = bookingRepository.count();
        long activeStaff = staffRepository.findAll().stream().filter(s -> s.getStatus() == Staff.StaffStatus.ACTIVE).count();
        long dirtyRooms = roomRepository.countByHousekeeping(com.flexstays.entity.Room.HousekeepingStatus.DIRTY);

        BigDecimal revenueToday = paymentRepository.sumRevenueByDate(LocalDate.now());
        if (revenueToday == null) revenueToday = BigDecimal.ZERO;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalBookings", totalBookings);
        summary.put("activeStaff", activeStaff);
        summary.put("dirtyRooms", dirtyRooms);
        summary.put("revenueToday", revenueToday);
        return summary;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    @Transactional
    public Staff createStaff(CreateStaffRequest req) {
        if (staffRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException("Staff email already registered");
        }

        Staff staff = new Staff();
        staff.setFirstName(req.getFirstName());
        staff.setLastName(req.getLastName());
        staff.setEmail(req.getEmail());
        staff.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        staff.setRole(Staff.StaffRole.valueOf(req.getRole().toUpperCase()));
        staff.setStatus(Staff.StaffStatus.ACTIVE);

        return staffRepository.save(staff);
    }

    @Override
    @Transactional
    public Staff updateStaff(Long id, CreateStaffRequest req) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));

        staff.setFirstName(req.getFirstName());
        staff.setLastName(req.getLastName());
        staff.setRole(Staff.StaffRole.valueOf(req.getRole().toUpperCase()));
        if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
            staff.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        return staffRepository.save(staff);
    }

    @Override
    @Transactional
    public Staff toggleStaffStatus(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));

        if (staff.getStatus() == Staff.StaffStatus.ACTIVE) {
            staff.setStatus(Staff.StaffStatus.DEACTIVATED);
        } else {
            staff.setStatus(Staff.StaffStatus.ACTIVE);
        }

        return staffRepository.save(staff);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAuditLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getRevenueAnalytics(int days) {
        Map<String, Object> analytics = new HashMap<>();
        List<String> dates = new ArrayList<>();
        List<BigDecimal> amounts = new ArrayList<>();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            BigDecimal dayRev = paymentRepository.sumRevenueByDate(date);
            dates.add(date.toString());
            amounts.add(dayRev != null ? dayRev : BigDecimal.ZERO);
        }

        analytics.put("labels", dates);
        analytics.put("data", amounts);
        return analytics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<?> getNotifications() {
        return notificationRepository.findByIsReadFalse();
    }
}
