package com.flexstays.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity representing the `events` table.
 * Handles special event booking requests from guests (weddings, corporates, etc.).
 */
@Entity
@Table(name = "events")
public class Event {

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    public enum EventType {
        WEDDING, CORPORATE, BIRTHDAY, VIP_GATHERING, ANNIVERSARY, OTHER
    }

    public enum BudgetTier {
        STANDARD, PREMIUM, LUXURY
    }

    public enum EventStatus {
        PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique human-readable reference, e.g. "EVT-20240701-001". */
    @Column(name = "event_ref", nullable = false, unique = true)
    private String eventRef;

    /** Guest who submitted the event request. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_tier", nullable = false)
    private BudgetTier budgetTier;

    /** Guest's preferred venue within the hotel, e.g. "Grand Ballroom". */
    @Column(name = "venue_preference")
    private String venuePreference;

    @Column(name = "special_notes", columnDefinition = "TEXT")
    private String specialNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EventStatus status = EventStatus.PENDING;

    /** Staff member who approved or rejected this event request. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Staff approvedBy;

    /** Timestamp of approval or rejection. */
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    /** Reason provided when the event is rejected. */
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    /** Quoted estimated cost in INR provided by staff after review. */
    @Column(name = "estimated_cost", precision = 12, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Event() {}

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

    public Long getId()                                   { return id; }
    public void setId(Long id)                            { this.id = id; }

    public String getEventRef()                           { return eventRef; }
    public void setEventRef(String eventRef)              { this.eventRef = eventRef; }

    public User getUser()                                 { return user; }
    public void setUser(User user)                        { this.user = user; }

    public EventType getEventType()                       { return eventType; }
    public void setEventType(EventType eventType)         { this.eventType = eventType; }

    public LocalDate getEventDate()                       { return eventDate; }
    public void setEventDate(LocalDate eventDate)         { this.eventDate = eventDate; }

    public Integer getGuestCount()                        { return guestCount; }
    public void setGuestCount(Integer guestCount)         { this.guestCount = guestCount; }

    public BudgetTier getBudgetTier()                     { return budgetTier; }
    public void setBudgetTier(BudgetTier budgetTier)      { this.budgetTier = budgetTier; }

    public String getVenuePreference()                    { return venuePreference; }
    public void setVenuePreference(String venuePreference) { this.venuePreference = venuePreference; }

    public String getSpecialNotes()                       { return specialNotes; }
    public void setSpecialNotes(String specialNotes)      { this.specialNotes = specialNotes; }

    public EventStatus getStatus()                        { return status; }
    public void setStatus(EventStatus status)             { this.status = status; }

    public Staff getApprovedBy()                          { return approvedBy; }
    public void setApprovedBy(Staff approvedBy)           { this.approvedBy = approvedBy; }

    public LocalDateTime getApprovedAt()                  { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt)   { this.approvedAt = approvedAt; }

    public String getRejectionReason()                    { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public BigDecimal getEstimatedCost()                  { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public LocalDateTime getCreatedAt()                   { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)     { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                   { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)     { this.updatedAt = updatedAt; }
}
