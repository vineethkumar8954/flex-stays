package com.flexstays.service;
import java.util.List;
import java.util.Map;

public interface ReceptionService {
    List<?> getTodayArrivals();
    List<?> getTodayDepartures();
    Object checkIn(Long bookingId, String roomNumber, String staffEmail);
    Object checkOut(Long bookingId, String staffEmail);
    List<?> getAvailableRooms();
    Map<String, Object> getDashboardSummary();
}
