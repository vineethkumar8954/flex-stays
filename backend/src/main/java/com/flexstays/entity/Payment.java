package com.flexstays.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity representing the `payments` table.
 * Tracks Razorpay payment lifecycle for every booking.
 */
@Entity
@Table(name = "payments")
public class Payment {

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    public enum PaymentMethod {
        UPI, CARD, NET_BANKING, WALLET, EMI, CASH, OTHER
    }

    public enum PaymentStatus {
        PENDING, CAPTURED, FAILED, REFUNDED, PARTIALLY_REFUNDED
    }

    // -------------------------------------------------------------------------
    // Fields
    // -------------------------------------------------------------------------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** One payment record per booking (may evolve to one-to-many for split payments). */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    /** Razorpay order ID – null for CASH payments until order creation. */
    @Column(name = "razorpay_order_id", unique = true)
    private String razorpayOrderId;

    /** Razorpay payment ID returned after successful capture. */
    @Column(name = "razorpay_payment_id", unique = true)
    private String razorpayPaymentId;

    /** HMAC-SHA256 signature for webhook/callback verification. */
    @Column(name = "razorpay_signature")
    private String razorpaySignature;

    /** Amount charged to the guest in base currency. */
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /** ISO 4217 currency code; defaults to INR. */
    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false)
    private PaymentMethod method = PaymentMethod.OTHER;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    /** Amount refunded so far (0 by default). */
    @Column(name = "refund_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal refundAmount = BigDecimal.ZERO;

    /** Razorpay refund ID, populated on successful refund. */
    @Column(name = "refund_id")
    private String refundId;

    /** Timestamp when payment was successfully captured/received. */
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Payment() {}

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

    public Long getId()                                    { return id; }
    public void setId(Long id)                             { this.id = id; }

    public Booking getBooking()                            { return booking; }
    public void setBooking(Booking booking)                { this.booking = booking; }

    public String getRazorpayOrderId()                     { return razorpayOrderId; }
    public void setRazorpayOrderId(String v)               { this.razorpayOrderId = v; }

    public String getRazorpayPaymentId()                   { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String v)             { this.razorpayPaymentId = v; }

    public String getRazorpaySignature()                   { return razorpaySignature; }
    public void setRazorpaySignature(String v)             { this.razorpaySignature = v; }

    public BigDecimal getAmount()                          { return amount; }
    public void setAmount(BigDecimal amount)               { this.amount = amount; }

    public String getCurrency()                            { return currency; }
    public void setCurrency(String currency)               { this.currency = currency; }

    public PaymentMethod getMethod()                       { return method; }
    public void setMethod(PaymentMethod method)            { this.method = method; }

    public PaymentStatus getStatus()                       { return status; }
    public void setStatus(PaymentStatus status)            { this.status = status; }

    public BigDecimal getRefundAmount()                    { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount)   { this.refundAmount = refundAmount; }

    public String getRefundId()                            { return refundId; }
    public void setRefundId(String refundId)               { this.refundId = refundId; }

    public LocalDateTime getPaidAt()                       { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt)            { this.paidAt = paidAt; }

    public LocalDateTime getCreatedAt()                    { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                    { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)      { this.updatedAt = updatedAt; }
}
