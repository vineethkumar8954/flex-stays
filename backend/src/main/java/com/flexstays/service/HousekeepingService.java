package com.flexstays.service;
import java.util.List;
import java.util.Map;

public interface HousekeepingService {
    List<?> getRoomsByHousekeepingStatus(String status);
    Object startCleaning(String roomNumber, String staffEmail);
    Object completeCleaning(String roomNumber, String staffEmail);
    Map<String, Object> getDashboardSummary();
}
