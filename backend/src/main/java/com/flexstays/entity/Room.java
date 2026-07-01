package com.flexstays.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity representing the `rooms` table.
 * Tracks room configuration, pricing, amenities, and operational status.
 */
@Entity
@Table(name = "rooms")
public class Room {

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    public enum RoomCategory {
        STANDARD, DELUXE, EXECUTIVE_SUITE, PRESIDENTIAL_SUITE
    }

    public enum RoomStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_ORDER
    }

    public enum HousekeepingStatus {
        CLEAN, DIRTY, CLEANING
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique room identifier (e.g. "101", "PH-01"). */
    @Column(name = "room_number", nullable = false, unique = true)
    private String roomNumber;

    @Column(name = "floor", nullable = false)
    private Integer floor;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private RoomCategory category;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** Nightly rate in the system's base currency (INR). */
    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(name = "max_guests", nullable = false)
    private Integer maxGuests;

    /**
     * Amenities stored as a JSON string array, e.g.:
     * ["WiFi","AC","Mini-bar","Jacuzzi"]
     */
    @Column(name = "amenities", columnDefinition = "TEXT")
    private String amenities;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "housekeeping", nullable = false)
    private HousekeepingStatus housekeeping = HousekeepingStatus.CLEAN;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Room() {}

    public Room(Long id, String roomNumber, Integer floor, RoomCategory category,
                String name, String description, BigDecimal pricePerNight,
                Integer maxGuests, String amenities, String imageUrl,
                RoomStatus status, HousekeepingStatus housekeeping,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id           = id;
        this.roomNumber   = roomNumber;
        this.floor        = floor;
        this.category     = category;
        this.name         = name;
        this.description  = description;
        this.pricePerNight = pricePerNight;
        this.maxGuests    = maxGuests;
        this.amenities    = amenities;
        this.imageUrl     = imageUrl;
        this.status       = status;
        this.housekeeping = housekeeping;
        this.createdAt    = createdAt;
        this.updatedAt    = updatedAt;
    }

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

    public Long getId()                               { return id; }
    public void setId(Long id)                        { this.id = id; }

    public String getRoomNumber()                     { return roomNumber; }
    public void setRoomNumber(String roomNumber)      { this.roomNumber = roomNumber; }

    public Integer getFloor()                         { return floor; }
    public void setFloor(Integer floor)               { this.floor = floor; }

    public RoomCategory getCategory()                 { return category; }
    public void setCategory(RoomCategory category)    { this.category = category; }

    public String getName()                           { return name; }
    public void setName(String name)                  { this.name = name; }

    public String getDescription()                    { return description; }
    public void setDescription(String description)    { this.description = description; }

    public BigDecimal getPricePerNight()              { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public Integer getMaxGuests()                     { return maxGuests; }
    public void setMaxGuests(Integer maxGuests)       { this.maxGuests = maxGuests; }

    public String getAmenities()                      { return amenities; }
    public void setAmenities(String amenities)        { this.amenities = amenities; }

    public String getImageUrl()                       { return imageUrl; }
    public void setImageUrl(String imageUrl)          { this.imageUrl = imageUrl; }

    public RoomStatus getStatus()                     { return status; }
    public void setStatus(RoomStatus status)          { this.status = status; }

    public HousekeepingStatus getHousekeeping()                    { return housekeeping; }
    public void setHousekeeping(HousekeepingStatus housekeeping)   { this.housekeeping = housekeeping; }

    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()               { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
