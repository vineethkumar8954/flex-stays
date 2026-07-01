package com.flexstays.service.impl;

import com.flexstays.dto.response.RoomResponse;
import com.flexstays.entity.Room;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.RoomRepository;
import com.flexstays.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms(String category, String status) {
        List<Room> rooms = roomRepository.findAll();
        if (category != null && !category.isEmpty()) {
            rooms = rooms.stream().filter(r -> r.getCategory().name().equalsIgnoreCase(category)).collect(Collectors.toList());
        }
        if (status != null && !status.isEmpty()) {
            rooms = rooms.stream().filter(r -> r.getStatus().name().equalsIgnoreCase(status)).collect(Collectors.toList());
        }
        return rooms.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return mapToResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getByRoomNumber(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with number: " + roomNumber));
        return mapToResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, int guests) {
        List<Room> rooms = roomRepository.findAvailableRooms(checkIn, checkOut, guests);
        return rooms.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RoomResponse updateRoomStatus(Long id, String status, String housekeeping) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        if (status != null && !status.isEmpty()) {
            room.setStatus(Room.RoomStatus.valueOf(status.toUpperCase()));
        }
        if (housekeeping != null && !housekeeping.isEmpty()) {
            room.setHousekeeping(Room.HousekeepingStatus.valueOf(housekeeping.toUpperCase()));
        }
        roomRepository.save(room);
        return mapToResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getRoomSummary() {
        long available = roomRepository.countByStatus(Room.RoomStatus.AVAILABLE);
        long occupied = roomRepository.countByStatus(Room.RoomStatus.OCCUPIED);
        long maintenance = roomRepository.countByStatus(Room.RoomStatus.MAINTENANCE);
        long dirty = roomRepository.countByHousekeeping(Room.HousekeepingStatus.DIRTY);

        Map<String, Object> summary = new HashMap<>();
        summary.put("available", available);
        summary.put("occupied", occupied);
        summary.put("maintenance", maintenance);
        summary.put("dirty", dirty);
        return summary;
    }

    private RoomResponse mapToResponse(Room room) {
        List<String> amenitiesList = new ArrayList<>();
        if (room.getAmenities() != null) {
            String clean = room.getAmenities().replace("[", "").replace("]", "").replace("\"", "");
            if (!clean.trim().isEmpty()) {
                amenitiesList = Arrays.asList(clean.split(",\\s*"));
            }
        }
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .floor(room.getFloor())
                .category(room.getCategory().name())
                .name(room.getName())
                .description(room.getDescription())
                .pricePerNight(room.getPricePerNight())
                .maxGuests(room.getMaxGuests())
                .imageUrl(room.getImageUrl())
                .status(room.getStatus().name())
                .housekeeping(room.getHousekeeping().name())
                .amenities(amenitiesList)
                .build();
    }
}
