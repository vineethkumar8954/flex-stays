package com.flexstays.repository;

import com.flexstays.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumber(String roomNumber);
    List<Room> findByStatus(Room.RoomStatus status);
    List<Room> findByHousekeeping(Room.HousekeepingStatus housekeeping);
    List<Room> findByCategory(Room.RoomCategory category);

    @Query("""
        SELECT r FROM Room r
        WHERE r.status = 'AVAILABLE'
          AND r.housekeeping = 'CLEAN'
          AND r.maxGuests >= :guests
          AND r.id NOT IN (
              SELECT b.room.id FROM Booking b
              WHERE b.status IN ('CONFIRMED','CHECKED_IN')
                AND b.checkIn < :checkOut
                AND b.checkOut > :checkIn
          )
    """)
    List<Room> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut,
        @Param("guests") int guests
    );

    long countByStatus(Room.RoomStatus status);
    long countByHousekeeping(Room.HousekeepingStatus housekeeping);
}
