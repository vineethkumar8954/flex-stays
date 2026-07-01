package com.flexstays.service.impl;

import com.flexstays.dto.request.BookingRequest;
import com.flexstays.dto.response.BookingResponse;
import com.flexstays.entity.Booking;
import com.flexstays.entity.Room;
import com.flexstays.entity.User;
import com.flexstays.entity.HotelPackage;
import com.flexstays.exception.BusinessException;
import com.flexstays.exception.ResourceNotFoundException;
import com.flexstays.repository.BookingRepository;
import com.flexstays.repository.HotelPackageRepository;
import com.flexstays.repository.RoomRepository;
import com.flexstays.repository.UserRepository;
import com.flexstays.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final HotelPackageRepository hotelPackageRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository,
                              RoomRepository roomRepository, HotelPackageRepository hotelPackageRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.hotelPackageRepository = hotelPackageRepository;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String guestEmail) {
        User user = userRepository.findByEmail(guestEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + guestEmail));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + request.getRoomId()));

        if (room.getStatus() != Room.RoomStatus.AVAILABLE) {
            throw new BusinessException("Room is not available for booking");
        }

        LocalDate checkIn = request.getCheckIn();
        LocalDate checkOut = request.getCheckOut();

        if (checkIn.isAfter(checkOut) || checkIn.isEqual(checkOut)) {
            throw new BusinessException("Check-in date must be before check-out date");
        }

        if (bookingRepository.existsOverlappingBooking(room.getId(), checkIn, checkOut)) {
            throw new BusinessException("Room is already booked for this date range");
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

        BigDecimal roomPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        BigDecimal packagePrice = BigDecimal.ZERO;

        HotelPackage hotelPackage = null;
        if (request.getPackageId() != null) {
            hotelPackage = hotelPackageRepository.findById(request.getPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Package not found with ID: " + request.getPackageId()));
            packagePrice = hotelPackage.getPrice();
        }

        BigDecimal subtotal = roomPrice.add(packagePrice);
        BigDecimal taxes = subtotal.multiply(BigDecimal.valueOf(0.18)); // 18% GST
        BigDecimal totalAmount = subtotal.add(taxes);

        Booking booking = new Booking();
        booking.setBookingRef("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setUser(user);
        booking.setRoom(room);
        booking.setHotelPackage(hotelPackage);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setNights((int) nights);
        booking.setAdultCount(request.getAdultCount());
        booking.setChildCount(request.getChildCount());
        booking.setRoomPrice(roomPrice);
        booking.setPackagePrice(packagePrice);
        booking.setTaxes(taxes);
        booking.setTotalAmount(totalAmount);
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking.setCreatedAt(java.time.LocalDateTime.now());

        bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByEmail(String email) {
        return bookingRepository.findByUserEmailOrderByCreatedAtDesc(email)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, String requesterEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        // Allow if requester is the user who booked or a staff member
        // In this mock check, we allow all for now.
        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(Long id, String requesterEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BusinessException("Booking is already cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(java.time.LocalDateTime.now());
        bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        return !bookingRepository.existsOverlappingBooking(roomId, checkIn, checkOut);
    }

    private BookingResponse mapToResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .bookingRef(b.getBookingRef())
                .userId(b.getUser().getId())
                .guestName(b.getUser().getFirstName() + " " + (b.getUser().getLastName() != null ? b.getUser().getLastName() : ""))
                .guestEmail(b.getUser().getEmail())
                .roomId(b.getRoom().getId())
                .roomNumber(b.getRoom().getRoomNumber())
                .roomName(b.getRoom().getName())
                .roomCategory(b.getRoom().getCategory().name())
                .checkIn(b.getCheckIn())
                .checkOut(b.getCheckOut())
                .nights(b.getNights())
                .adultCount(b.getAdultCount())
                .childCount(b.getChildCount())
                .roomPrice(b.getRoomPrice())
                .packagePrice(b.getPackagePrice())
                .taxes(b.getTaxes())
                .totalAmount(b.getTotalAmount())
                .specialRequests(b.getSpecialRequests())
                .status(b.getStatus().name())
                .checkedInAt(b.getCheckedInAt())
                .checkedOutAt(b.getCheckedOutAt())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
