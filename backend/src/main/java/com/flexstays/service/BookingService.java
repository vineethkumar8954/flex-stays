package com.flexstays.service;

import com.flexstays.dto.request.BookingRequest;
import com.flexstays.dto.response.BookingResponse;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request, String guestEmail);
    List<BookingResponse> getBookingsByEmail(String email);
    BookingResponse getBookingById(Long id, String requesterEmail);
    void cancelBooking(Long id, String requesterEmail);
    List<BookingResponse> getAllBookings();
    boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut);
}
