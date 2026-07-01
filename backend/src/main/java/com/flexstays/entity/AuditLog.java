package com.flexstays.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * JPA entity representing the `audit_logs` table.
 * Immutable record of all significant operations performed by staff.
 * No @PreUpdate / updatedAt – audit logs must never be modified.
 */
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    // -------------------------------------------------------------------------
    // Enum
    // -------------------------------------------------------------------------

    public enum AuditModule {
        AUTH, BOOKING, PAYMENT, ROOM, HOUSEKEEPING, MAINTENANCE, EVENT, DINING, STAFF, SYSTEM
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The staff member who performed the action.
     * Nullable – system-generated events have no operator.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id")
    private Staff operatorId;

    /**
     * Denormalized email of the operator at the time of the action.
     * Persisted so logs remain meaningful even after staff record changes.
     */
    @Column(name = "operator_email")
    private String operatorEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "module", nullable = false)
    private AuditModule module;

    /** Short verb/action description, e.g. "CREATE_BOOKING", "CHECK_IN", "APPROVE_EVENT". */
    @Column(name = "action", nullable = false)
    private String action;

    /**
     * Free-form JSON payload capturing the relevant state or diff,
     * e.g. {"bookingRef":"BK-001","roomNumber":"101","guestEmail":"..."}
     */
    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    /** IPv4/IPv6 address of the request originator. */
    @Column(name = "ip_address")
    private String ipAddress;

    /** Creation timestamp – immutable, never updated. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public AuditLog() {}

    public AuditLog(Long id, Staff operatorId, String operatorEmail, AuditModule module,
                    String action, String details, String ipAddress, LocalDateTime createdAt) {
        this.id = id;
        this.operatorId = operatorId;
        this.operatorEmail = operatorEmail;
        this.module = module;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
        this.createdAt = createdAt;
    }

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

    public Long getId()                                      { return id; }
    public void setId(Long id)                               { this.id = id; }

    public Staff getOperatorId()                             { return operatorId; }
    public void setOperatorId(Staff operatorId)              { this.operatorId = operatorId; }

    public String getOperatorEmail()                         { return operatorEmail; }
    public void setOperatorEmail(String operatorEmail)       { this.operatorEmail = operatorEmail; }

    public AuditModule getModule()                           { return module; }
    public void setModule(AuditModule module)                { this.module = module; }

    public String getAction()                                { return action; }
    public void setAction(String action)                     { this.action = action; }

    public String getDetails()                               { return details; }
    public void setDetails(String details)                   { this.details = details; }

    public String getIpAddress()                             { return ipAddress; }
    public void setIpAddress(String ipAddress)               { this.ipAddress = ipAddress; }

    public LocalDateTime getCreatedAt()                      { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)        { this.createdAt = createdAt; }
}
