package com.flexstays.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * JPA entity representing the `maintenance_requests` table.
 * Tracks hotel room defects / issues from report through resolution.
 */
@Entity
@Table(name = "maintenance_requests")
public class MaintenanceRequest {

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    public enum IssueType {
        PLUMBING, ELECTRICAL, HVAC, FURNITURE, CLEANING, PEST, OTHER
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum MaintenanceStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED, DEFERRED
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique ticket reference, e.g. "MNT-20240701-001". */
    @Column(name = "ticket_ref", nullable = false, unique = true)
    private String ticketRef;

    /** The room where the issue was found. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    /** Staff member who reported the issue. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reported_by", nullable = false)
    private Staff reportedBy;

    /** Staff member assigned to fix the issue (may be null until assigned). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private Staff assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", nullable = false)
    private IssueType issueType;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MaintenanceStatus status = MaintenanceStatus.OPEN;

    /**
     * When true, the room should be placed in MAINTENANCE status
     * and not made available for new bookings until resolved.
     */
    @Column(name = "affects_availability", nullable = false)
    private boolean affectsAvailability = false;

    /** Timestamp when the issue was marked RESOLVED. */
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    /** Notes written by the technician upon resolution. */
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public MaintenanceRequest() {}

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

    public String getTicketRef()                               { return ticketRef; }
    public void setTicketRef(String ticketRef)                 { this.ticketRef = ticketRef; }

    public Room getRoom()                                      { return room; }
    public void setRoom(Room room)                             { this.room = room; }

    public Staff getReportedBy()                               { return reportedBy; }
    public void setReportedBy(Staff reportedBy)                { this.reportedBy = reportedBy; }

    public Staff getAssignedTo()                               { return assignedTo; }
    public void setAssignedTo(Staff assignedTo)                { this.assignedTo = assignedTo; }

    public IssueType getIssueType()                            { return issueType; }
    public void setIssueType(IssueType issueType)              { this.issueType = issueType; }

    public Priority getPriority()                              { return priority; }
    public void setPriority(Priority priority)                 { this.priority = priority; }

    public String getTitle()                                   { return title; }
    public void setTitle(String title)                         { this.title = title; }

    public String getDescription()                             { return description; }
    public void setDescription(String description)             { this.description = description; }

    public MaintenanceStatus getStatus()                       { return status; }
    public void setStatus(MaintenanceStatus status)            { this.status = status; }

    public boolean isAffectsAvailability()                     { return affectsAvailability; }
    public void setAffectsAvailability(boolean affectsAvailability) { this.affectsAvailability = affectsAvailability; }

    public LocalDateTime getResolvedAt()                       { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt)        { this.resolvedAt = resolvedAt; }

    public String getResolutionNotes()                         { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes)     { this.resolutionNotes = resolutionNotes; }

    public LocalDateTime getCreatedAt()                        { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)          { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                        { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)          { this.updatedAt = updatedAt; }
}
