package com.flexstays.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity representing the `packages` table.
 * A hotel package bundles room + services at a fixed price for a set duration.
 */
@Entity
@Table(name = "packages")
public class HotelPackage {

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable package name, e.g. "Honeymoon Getaway". */
    @Column(name = "name", nullable = false)
    private String name;

    /** URL-friendly unique identifier, e.g. "honeymoon-getaway". */
    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Package inclusions stored as a JSON string array, e.g.:
     * ["Breakfast","Spa Session","Airport Transfer"]
     */
    @Column(name = "inclusions", columnDefinition = "TEXT")
    private String inclusions;

    /** Total package price in INR (covers all nights + inclusions). */
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Number of nights the package covers. */
    @Column(name = "duration_nights", nullable = false)
    private Integer durationNights;

    /** Free-text category label, e.g. "Romantic", "Family", "Business". */
    @Column(name = "category")
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    /** Soft-delete / visibility flag. */
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public HotelPackage() {}

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

    public String getName()                           { return name; }
    public void setName(String name)                  { this.name = name; }

    public String getSlug()                           { return slug; }
    public void setSlug(String slug)                  { this.slug = slug; }

    public String getDescription()                    { return description; }
    public void setDescription(String description)    { this.description = description; }

    public String getInclusions()                     { return inclusions; }
    public void setInclusions(String inclusions)      { this.inclusions = inclusions; }

    public BigDecimal getPrice()                      { return price; }
    public void setPrice(BigDecimal price)            { this.price = price; }

    public Integer getDurationNights()                { return durationNights; }
    public void setDurationNights(Integer durationNights) { this.durationNights = durationNights; }

    public String getCategory()                       { return category; }
    public void setCategory(String category)          { this.category = category; }

    public String getImageUrl()                       { return imageUrl; }
    public void setImageUrl(String imageUrl)          { this.imageUrl = imageUrl; }

    public boolean isActive()                         { return isActive; }
    public void setActive(boolean isActive)           { this.isActive = isActive; }

    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()               { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
