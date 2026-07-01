package com.flexstays.service;
import com.flexstays.dto.request.CreateStaffRequest;
import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboardSummary();
    List<?> getAllStaff();
    Object createStaff(CreateStaffRequest req);
    Object updateStaff(Long id, CreateStaffRequest req);
    Object toggleStaffStatus(Long id);
    Object getAuditLogs(int page, int size);
    Object getRevenueAnalytics(int days);
    Object getNotifications();
}
