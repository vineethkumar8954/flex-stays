package com.flexstays.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * JPA entity representing the `notifications` table.
 * Stores system-wide notifications targeting specific staff roles or all users.
 */
@Entity
@Table(name = "notifications")
public class Notification {

    // -------------------------------------------------------------------------
    // Enum
    // -------------------------------------------------------------------------

    public enum NotificationType {
        BOOKING, CHECKOUT, HOUSEKEEPING, MAINTENANCE, EVENT, DINING, SYSTEM, PAYMENT
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    /** Full notification message body – stored as TEXT for unlimited length. */
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotificationType type;

    /**
     * Comma-separated list of target roles, e.g. "ADMIN,RECEPTION".
     * Use "*" to broadcast to all roles.
     */
    @Column(name = "target_roles")
    private String targetRoles;

    /** Optional foreign key to the related entity (bookingId, eventId, etc.). */
    @Column(name = "ref_id")
    private Long refId;

    /** Discriminator for refId – e.g. "BOOKING", "EVENT", "PAYMENT". */
    @Column(name = "ref_type")
    private String refType;

    /** Read/unread flag – can be extended to a per-user read table if needed. */
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    /** Staff member who triggered or created this notification. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Staff createdBy;

    /** Notifications are immutable once created – no updatedAt. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Notification() {}

    // -------------------------------------------------------------------------
    // Lifecycle callback
    // -------------------------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // -------------------------------------------------------------------------
    // Getters and Setters
    // -------------------------------------------------------------------------

    public Long getId()                                    { return id; }
    public void setId(Long id)                             { this.id = id; }

    public String getTitle()                               { return title; }
    public void setTitle(String title)                     { this.title = title; }

    public String getMessage()                             { return message; }
    public void setMessage(String message)                 { this.message = message; }

    public NotificationType getType()                      { return type; }
    public void setType(NotificationType type)             { this.type = type; }

    public String getTargetRoles()                         { return targetRoles; }
    public void setTargetRoles(String targetRoles)         { this.targetRoles = targetRoles; }

    public Long getRefId()                                 { return refId; }
    public void setRefId(Long refId)                       { this.refId = refId; }

    public String getRefType()                             { return refType; }
    public void setRefType(String refType)                 { this.refType = refType; }

    public boolean isRead()                                { return isRead; }
    public void setRead(boolean isRead)                    { this.isRead = isRead; }

    public Staff getCreatedBy()                            { return createdBy; }
    public void setCreatedBy(Staff createdBy)              { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt()                    { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt = createdAt; }
}
