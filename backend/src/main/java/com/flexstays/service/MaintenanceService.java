package com.flexstays.service;
import java.util.List;
import java.util.Map;

public interface MaintenanceService {
    List<?> getAllTickets(String status);
    Object getTicketById(Long id);
    Object createTicket(String roomNumber, String issueType, String priority, String title, String description, String staffEmail);
    Object assignTicket(Long id, String technicianEmail);
    Object resolveTicket(Long id, String resolutionNotes, String staffEmail);
    Map<String, Object> getDashboardSummary();
}
