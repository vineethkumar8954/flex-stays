package com.flexstays.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * JPA entity representing the `dining_reservations` table.
 * Tracks restaurant table reservations made by hotel guests.
 */
@Entity
@Table(name = "dining_reservations")
public class DiningReservation {

    // -------------------------------------------------------------------------
    // Enum
    // -------------------------------------------------------------------------

    public enum DiningStatus {
        PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique human-readable reference, e.g. "DIN-20240701-001". */
    @Column(name = "reservation_ref", nullable = false, unique = true)
    private String reservationRef;

    /** The guest who made the dining reservation. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Name/label of the restaurant outlet within the hotel. */
    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "reservation_time", nullable = false)
    private LocalTime reservationTime;

    /** Number of guests expected at the table. */
    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    /** Dietary restrictions, allergy info, or special occasion notes. */
    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DiningStatus status = DiningStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public DiningReservation() {}

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // -------------------------------------------------------------------------
    // Getters and Setters
    // -------------------------------------------------------------------------

    public Long getId()                                        { return id; }
    public void setId(Long id)                                 { this.id = id; }

    public String getReservationRef()                          { return reservationRef; }
    public void setReservationRef(String reservationRef)       { this.reservationRef = reservationRef; }

    public User getUser()                                      { return user; }
    public void setUser(User user)                             { this.user = user; }

    public String getRestaurantName()                          { return restaurantName; }
    public void setRestaurantName(String restaurantName)       { this.restaurantName = restaurantName; }

    public LocalDate getReservationDate()                      { return reservationDate; }
    public void setReservationDate(LocalDate reservationDate)  { this.reservationDate = reservationDate; }

    public LocalTime getReservationTime()                      { return reservationTime; }
    public void setReservationTime(LocalTime reservationTime)  { this.reservationTime = reservationTime; }

    public Integer getGuestCount()                             { return guestCount; }
    public void setGuestCount(Integer guestCount)              { this.guestCount = guestCount; }

    public String getSpecialRequests()                         { return specialRequests; }
    public void setSpecialRequests(String specialRequests)     { this.specialRequests = specialRequests; }

    public DiningStatus getStatus()                            { return status; }
    public void setStatus(DiningStatus status)                 { this.status = status; }

    public LocalDateTime getCreatedAt()                        { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)          { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                        { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)          { this.updatedAt = updatedAt; }
}
