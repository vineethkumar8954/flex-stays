package com.flexstays.service.impl;

import com.flexstays.entity.Booking;
import com.flexstays.entity.Room;
import com.flexstays.entity.Staff;
import com.flexstays.exception.BusinessException;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.BookingRepository;
import com.flexstays.repository.RoomRepository;
import com.flexstays.repository.StaffRepository;
import com.flexstays.service.ReceptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReceptionServiceImpl implements ReceptionService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public ReceptionServiceImpl(BookingRepository bookingRepository, RoomRepository roomRepository, StaffRepository staffRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.staffRepository = staffRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getTodayArrivals() {
        return bookingRepository.findByCheckIn(LocalDate.now());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getTodayDepartures() {
        return bookingRepository.findByCheckOut(LocalDate.now());
    }

    @Override
    @Transactional
    public Booking checkIn(Long bookingId, String roomNumber, String staffEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        Staff staff = staffRepository.findByEmail(staffEmail).orElse(null);

        if (room.getStatus() != Room.RoomStatus.AVAILABLE || room.getHousekeeping() != Room.HousekeepingStatus.CLEAN) {
            throw new BusinessException("Room is not ready or is currently occupied");
        }

        booking.setRoom(room);
        booking.setStatus(Booking.BookingStatus.CHECKED_IN);
        booking.setCheckedInAt(java.time.LocalDateTime.now());
        booking.setAllocatedBy(staff);

        room.setStatus(Room.RoomStatus.OCCUPIED);
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking checkOut(Long bookingId, String staffEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
            throw new BusinessException("Guest is not checked in");
        }

        Room room = booking.getRoom();
        booking.setStatus(Booking.BookingStatus.CHECKED_OUT);
        booking.setCheckedOutAt(java.time.LocalDateTime.now());

        room.setStatus(Room.RoomStatus.AVAILABLE);
        room.setHousekeeping(Room.HousekeepingStatus.DIRTY);
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.AVAILABLE).stream()
                .filter(r -> r.getHousekeeping() == Room.HousekeepingStatus.CLEAN)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardSummary() {
        long arrivals = getTodayArrivals().stream().filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED).count();
        long departures = getTodayDepartures().stream().filter(b -> b.getStatus() == Booking.BookingStatus.CHECKED_IN).count();
        long availableRooms = getAvailableRooms().size();

        Map<String, Object> summary = new HashMap<>();
        summary.put("pendingArrivals", arrivals);
        summary.put("pendingDepartures", departures);
        summary.put("availableRooms", availableRooms);
        return summary;
    }
}
