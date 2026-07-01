package com.flexstays.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * JPA entity representing the `staff` table.
 * Implements Spring Security's UserDetails for authentication.
 */
@Entity
@Table(name = "staff")
public class Staff implements UserDetails {

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    public enum StaffRole {
        ADMIN, RECEPTION, HOUSEKEEPING, MAINTENANCE, MANAGER
    }

    public enum StaffStatus {
        ACTIVE, DEACTIVATED, ON_LEAVE
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private StaffRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StaffStatus status = StaffStatus.ACTIVE;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Staff() {}

    public Staff(Long id, String firstName, String lastName, String email,
                 String passwordHash, StaffRole role, StaffStatus status,
                 LocalDateTime lastLoginAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id           = id;
        this.firstName    = firstName;
        this.lastName     = lastName;
        this.email        = email;
        this.passwordHash = passwordHash;
        this.role         = role;
        this.status       = status;
        this.lastLoginAt  = lastLoginAt;
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
    // UserDetails implementation
    // -------------------------------------------------------------------------

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /** Returns stored password hash. */
    @Override
    public String getPassword() {
        return passwordHash;
    }

    /** Email serves as the principal username for staff. */
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status == StaffStatus.ACTIVE;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == StaffStatus.ACTIVE;
    }

    // -------------------------------------------------------------------------
    // Getters and Setters
    // -------------------------------------------------------------------------

    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public String getFirstName()                     { return firstName; }
    public void setFirstName(String firstName)       { this.firstName = firstName; }

    public String getLastName()                      { return lastName; }
    public void setLastName(String lastName)         { this.lastName = lastName; }

    public String getEmail()                         { return email; }
    public void setEmail(String email)               { this.email = email; }

    public String getPasswordHash()                  { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public StaffRole getRole()                       { return role; }
    public void setRole(StaffRole role)              { this.role = role; }

    public StaffStatus getStatus()                   { return status; }
    public void setStatus(StaffStatus status)        { this.status = status; }

    public LocalDateTime getLastLoginAt()                  { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt)  { this.lastLoginAt = lastLoginAt; }

    public LocalDateTime getCreatedAt()                    { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                    { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)      { this.updatedAt = updatedAt; }
}
