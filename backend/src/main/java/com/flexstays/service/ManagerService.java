package com.flexstays.service;
import java.util.List;
import java.util.Map;

public interface ManagerService {
    Map<String, Object> getDashboardSummary();
    Object getRevenueReport(int days);
    Object getOccupancyReport(int days);
    List<?> getPendingEvents();
    Object approveEvent(Long eventId, Double estimatedCost, String managerEmail);
    Object rejectEvent(Long eventId, String reason, String managerEmail);
    Object getStaffPerformance();
}
