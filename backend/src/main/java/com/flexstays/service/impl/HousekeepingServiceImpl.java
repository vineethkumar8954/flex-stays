package com.flexstays.service.impl;

import com.flexstays.entity.Room;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.RoomRepository;
import com.flexstays.service.HousekeepingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HousekeepingServiceImpl implements HousekeepingService {

    private final RoomRepository roomRepository;

    @Autowired
    public HousekeepingServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> getRoomsByHousekeepingStatus(String status) {
        return roomRepository.findByHousekeeping(Room.HousekeepingStatus.valueOf(status.toUpperCase()));
    }

    @Override
    @Transactional
    public Room startCleaning(String roomNumber, String staffEmail) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setHousekeeping(Room.HousekeepingStatus.CLEANING);
        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public Room completeCleaning(String roomNumber, String staffEmail) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setHousekeeping(Room.HousekeepingStatus.CLEAN);
        room.setStatus(Room.RoomStatus.AVAILABLE);
        return roomRepository.save(room);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardSummary() {
        long dirty = roomRepository.countByHousekeeping(Room.HousekeepingStatus.DIRTY);
        long cleaning = roomRepository.countByHousekeeping(Room.HousekeepingStatus.CLEANING);
        long clean = roomRepository.countByHousekeeping(Room.HousekeepingStatus.CLEAN);

        Map<String, Object> summary = new HashMap<>();
        summary.put("dirtyRoomsCount", dirty);
        summary.put("cleaningRoomsCount", cleaning);
        summary.put("cleanRoomsCount", clean);
        return summary;
    }
}
