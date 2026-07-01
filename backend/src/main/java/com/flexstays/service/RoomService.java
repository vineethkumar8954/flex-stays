package com.flexstays.service;

import com.flexstays.dto.response.RoomResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface RoomService {
    List<RoomResponse> getAllRooms(String category, String status);
    RoomResponse getRoomById(Long id);
    RoomResponse getByRoomNumber(String roomNumber);
    List<RoomResponse> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, int guests);
    RoomResponse updateRoomStatus(Long id, String status, String housekeeping);
    Map<String, Object> getRoomSummary();
}
