package com.flexstays.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity representing the `bookings` table.
 * Central reservation record linking a guest, a room, an optional package,
 * and all financial details.
 */
@Entity
@Table(name = "bookings")
public class Booking {

    // -------------------------------------------------------------------------
    // Enum
    // -------------------------------------------------------------------------

    public enum BookingStatus {
        CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable unique reference, e.g. "BK-20240701-0001". */
    @Column(name = "booking_ref", nullable = false, unique = true)
    private String bookingRef;

    /** The guest who owns this booking. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** The physical room reserved. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    /** Optional hotel package bundled with this booking. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private HotelPackage hotelPackage;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    /** Pre-computed night count (checkOut - checkIn). */
    @Column(name = "nights", nullable = false)
    private Integer nights;

    @Column(name = "adult_count", nullable = false)
    private Integer adultCount;

    @Column(name = "child_count", nullable = false)
    private Integer childCount = 0;

    /** Room charge before taxes (pricePerNight × nights). */
    @Column(name = "room_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal roomPrice;

    /** Additional package charge (0 if no package). */
    @Column(name = "package_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal packagePrice = BigDecimal.ZERO;

    /** Computed tax amount (GST etc.). */
    @Column(name = "taxes", nullable = false, precision = 10, scale = 2)
    private BigDecimal taxes = BigDecimal.ZERO;

    /** Final amount due = roomPrice + packagePrice + taxes. */
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;

    /** Timestamp when the guest physically checked in at the front desk. */
    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    /** Timestamp when the guest checked out. */
    @Column(name = "checked_out_at")
    private LocalDateTime checkedOutAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    /** Staff member who performed the room allocation / check-in. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allocated_by")
    private Staff allocatedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Booking() {}

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

    public Long getId()                                { return id; }
    public void setId(Long id)                         { this.id = id; }

    public String getBookingRef()                      { return bookingRef; }
    public void setBookingRef(String bookingRef)       { this.bookingRef = bookingRef; }

    public User getUser()                              { return user; }
    public void setUser(User user)                     { this.user = user; }

    public Room getRoom()                              { return room; }
    public void setRoom(Room room)                     { this.room = room; }

    public HotelPackage getHotelPackage()              { return hotelPackage; }
    public void setHotelPackage(HotelPackage hotelPackage) { this.hotelPackage = hotelPackage; }

    public LocalDate getCheckIn()                      { return checkIn; }
    public void setCheckIn(LocalDate checkIn)          { this.checkIn = checkIn; }

    public LocalDate getCheckOut()                     { return checkOut; }
    public void setCheckOut(LocalDate checkOut)        { this.checkOut = checkOut; }

    public Integer getNights()                         { return nights; }
    public void setNights(Integer nights)              { this.nights = nights; }

    public Integer getAdultCount()                     { return adultCount; }
    public void setAdultCount(Integer adultCount)      { this.adultCount = adultCount; }

    public Integer getChildCount()                     { return childCount; }
    public void setChildCount(Integer childCount)      { this.childCount = childCount; }

    public BigDecimal getRoomPrice()                   { return roomPrice; }
    public void setRoomPrice(BigDecimal roomPrice)     { this.roomPrice = roomPrice; }

    public BigDecimal getPackagePrice()                   { return packagePrice; }
    public void setPackagePrice(BigDecimal packagePrice)  { this.packagePrice = packagePrice; }

    public BigDecimal getTaxes()                       { return taxes; }
    public void setTaxes(BigDecimal taxes)             { this.taxes = taxes; }

    public BigDecimal getTotalAmount()                    { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount)    { this.totalAmount = totalAmount; }

    public String getSpecialRequests()                    { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public BookingStatus getStatus()                   { return status; }
    public void setStatus(BookingStatus status)        { this.status = status; }

    public LocalDateTime getCheckedInAt()                  { return checkedInAt; }
    public void setCheckedInAt(LocalDateTime checkedInAt)  { this.checkedInAt = checkedInAt; }

    public LocalDateTime getCheckedOutAt()                   { return checkedOutAt; }
    public void setCheckedOutAt(LocalDateTime checkedOutAt)  { this.checkedOutAt = checkedOutAt; }

    public LocalDateTime getCancelledAt()                  { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt)  { this.cancelledAt = cancelledAt; }

    public Staff getAllocatedBy()                       { return allocatedBy; }
    public void setAllocatedBy(Staff allocatedBy)      { this.allocatedBy = allocatedBy; }

    public LocalDateTime getCreatedAt()                { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)  { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)  { this.updatedAt = updatedAt; }
}
