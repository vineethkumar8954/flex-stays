package com.flexstays.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * JPA entity representing the `users` table.
 * Implements Spring Security's UserDetails for authentication.
 */
@Entity
@Table(name = "users")
public class User implements UserDetails {

    // -------------------------------------------------------------------------
    // Enum
    // -------------------------------------------------------------------------

    public enum UserRole {
        GUEST
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Google OAuth2 subject identifier – nullable for email/password users. */
    @Column(name = "google_id")
    private String googleId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role = UserRole.GUEST;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public User() {}

    public User(Long id, String googleId, String firstName, String lastName, String email,
                String passwordHash, String avatarUrl, String phone, UserRole role,
                boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id           = id;
        this.googleId     = googleId;
        this.firstName    = firstName;
        this.lastName     = lastName;
        this.email        = email;
        this.passwordHash = passwordHash;
        this.avatarUrl    = avatarUrl;
        this.phone        = phone;
        this.role         = role;
        this.isActive     = isActive;
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

    /** Returns the stored password hash (used by Spring Security). */
    @Override
    public String getPassword() {
        return passwordHash;
    }

    /** Email is used as the principal username. */
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
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    // -------------------------------------------------------------------------
    // Getters and Setters
    // -------------------------------------------------------------------------

    public Long getId()                            { return id; }
    public void setId(Long id)                     { this.id = id; }

    public String getGoogleId()                    { return googleId; }
    public void setGoogleId(String googleId)       { this.googleId = googleId; }

    public String getFirstName()                   { return firstName; }
    public void setFirstName(String firstName)     { this.firstName = firstName; }

    public String getLastName()                    { return lastName; }
    public void setLastName(String lastName)       { this.lastName = lastName; }

    public String getEmail()                       { return email; }
    public void setEmail(String email)             { this.email = email; }

    public String getPasswordHash()                { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getAvatarUrl()                   { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl)     { this.avatarUrl = avatarUrl; }

    public String getPhone()                       { return phone; }
    public void setPhone(String phone)             { this.phone = phone; }

    public UserRole getRole()                      { return role; }
    public void setRole(UserRole role)             { this.role = role; }

    public boolean getIsActive()                   { return isActive; }
    public void setIsActive(boolean isActive)      { this.isActive = isActive; }

    public LocalDateTime getCreatedAt()            { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()            { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
