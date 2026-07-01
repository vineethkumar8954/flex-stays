package com.flexstays.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long          id;
    private String        bookingRef;
    private Long          userId;
    private String        guestName;
    private String        guestEmail;
    private Long          roomId;
    private String        roomNumber;
    private String        roomName;
    private String        roomCategory;
    private LocalDate     checkIn;
    private LocalDate     checkOut;
    private int           nights;
    private int           adultCount;
    private int           childCount;
    private BigDecimal    roomPrice;
    private BigDecimal    packagePrice;
    private BigDecimal    taxes;
    private BigDecimal    totalAmount;
    private String        specialRequests;
    private String        status;
    private LocalDateTime checkedInAt;
    private LocalDateTime checkedOutAt;
    private LocalDateTime createdAt;

    public BookingResponse() {}

    private BookingResponse(Builder builder) {
        this.id              = builder.id;
        this.bookingRef      = builder.bookingRef;
        this.userId          = builder.userId;
        this.guestName       = builder.guestName;
        this.guestEmail      = builder.guestEmail;
        this.roomId          = builder.roomId;
        this.roomNumber      = builder.roomNumber;
        this.roomName        = builder.roomName;
        this.roomCategory    = builder.roomCategory;
        this.checkIn         = builder.checkIn;
        this.checkOut        = builder.checkOut;
        this.nights          = builder.nights;
        this.adultCount      = builder.adultCount;
        this.childCount      = builder.childCount;
        this.roomPrice       = builder.roomPrice;
        this.packagePrice    = builder.packagePrice;
        this.taxes           = builder.taxes;
        this.totalAmount     = builder.totalAmount;
        this.specialRequests = builder.specialRequests;
        this.status          = builder.status;
        this.checkedInAt     = builder.checkedInAt;
        this.checkedOutAt    = builder.checkedOutAt;
        this.createdAt       = builder.createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long          id;
        private String        bookingRef;
        private Long          userId;
        private String        guestName;
        private String        guestEmail;
        private Long          roomId;
        private String        roomNumber;
        private String        roomName;
        private String        roomCategory;
        private LocalDate     checkIn;
        private LocalDate     checkOut;
        private int           nights;
        private int           adultCount;
        private int           childCount;
        private BigDecimal    roomPrice;
        private BigDecimal    packagePrice;
        private BigDecimal    taxes;
        private BigDecimal    totalAmount;
        private String        specialRequests;
        private String        status;
        private LocalDateTime checkedInAt;
        private LocalDateTime checkedOutAt;
        private LocalDateTime createdAt;

        public Builder id(Long id)                           { this.id = id; return this; }
        public Builder bookingRef(String bookingRef)         { this.bookingRef = bookingRef; return this; }
        public Builder userId(Long userId)                   { this.userId = userId; return this; }
        public Builder guestName(String guestName)           { this.guestName = guestName; return this; }
        public Builder guestEmail(String guestEmail)         { this.guestEmail = guestEmail; return this; }
        public Builder roomId(Long roomId)                   { this.roomId = roomId; return this; }
        public Builder roomNumber(String roomNumber)         { this.roomNumber = roomNumber; return this; }
        public Builder roomName(String roomName)             { this.roomName = roomName; return this; }
        public Builder roomCategory(String roomCategory)     { this.roomCategory = roomCategory; return this; }
        public Builder checkIn(LocalDate checkIn)            { this.checkIn = checkIn; return this; }
        public Builder checkOut(LocalDate checkOut)          { this.checkOut = checkOut; return this; }
        public Builder nights(int nights)                    { this.nights = nights; return this; }
        public Builder adultCount(int adultCount)            { this.adultCount = adultCount; return this; }
        public Builder childCount(int childCount)            { this.childCount = childCount; return this; }
        public Builder roomPrice(BigDecimal roomPrice)       { this.roomPrice = roomPrice; return this; }
        public Builder packagePrice(BigDecimal packagePrice) { this.packagePrice = packagePrice; return this; }
        public Builder taxes(BigDecimal taxes)               { this.taxes = taxes; return this; }
        public Builder totalAmount(BigDecimal totalAmount)   { this.totalAmount = totalAmount; return this; }
        public Builder specialRequests(String specialRequests) { this.specialRequests = specialRequests; return this; }
        public Builder status(String status)                 { this.status = status; return this; }
        public Builder checkedInAt(LocalDateTime checkedInAt)   { this.checkedInAt = checkedInAt; return this; }
        public Builder checkedOutAt(LocalDateTime checkedOutAt) { this.checkedOutAt = checkedOutAt; return this; }
        public Builder createdAt(LocalDateTime createdAt)   { this.createdAt = createdAt; return this; }

        public BookingResponse build() { return new BookingResponse(this); }
    }

    public Long getId()                    { return id; }
    public void setId(Long id)             { this.id = id; }

    public String getBookingRef()          { return bookingRef; }
    public void setBookingRef(String v)    { this.bookingRef = v; }

    public Long getUserId()                { return userId; }
    public void setUserId(Long v)          { this.userId = v; }

    public String getGuestName()           { return guestName; }
    public void setGuestName(String v)     { this.guestName = v; }

    public String getGuestEmail()          { return guestEmail; }
    public void setGuestEmail(String v)    { this.guestEmail = v; }

    public Long getRoomId()                { return roomId; }
    public void setRoomId(Long v)          { this.roomId = v; }

    public String getRoomNumber()          { return roomNumber; }
    public void setRoomNumber(String v)    { this.roomNumber = v; }

    public String getRoomName()            { return roomName; }
    public void setRoomName(String v)      { this.roomName = v; }

    public String getRoomCategory()        { return roomCategory; }
    public void setRoomCategory(String v)  { this.roomCategory = v; }

    public LocalDate getCheckIn()          { return checkIn; }
    public void setCheckIn(LocalDate v)    { this.checkIn = v; }

    public LocalDate getCheckOut()         { return checkOut; }
    public void setCheckOut(LocalDate v)   { this.checkOut = v; }

    public int getNights()                 { return nights; }
    public void setNights(int v)           { this.nights = v; }

    public int getAdultCount()             { return adultCount; }
    public void setAdultCount(int v)       { this.adultCount = v; }

    public int getChildCount()             { return childCount; }
    public void setChildCount(int v)       { this.childCount = v; }

    public BigDecimal getRoomPrice()       { return roomPrice; }
    public void setRoomPrice(BigDecimal v) { this.roomPrice = v; }

    public BigDecimal getPackagePrice()       { return packagePrice; }
    public void setPackagePrice(BigDecimal v) { this.packagePrice = v; }

    public BigDecimal getTaxes()           { return taxes; }
    public void setTaxes(BigDecimal v)     { this.taxes = v; }

    public BigDecimal getTotalAmount()        { return totalAmount; }
    public void setTotalAmount(BigDecimal v)  { this.totalAmount = v; }

    public String getSpecialRequests()        { return specialRequests; }
    public void setSpecialRequests(String v)  { this.specialRequests = v; }

    public String getStatus()              { return status; }
    public void setStatus(String v)        { this.status = v; }

    public LocalDateTime getCheckedInAt()        { return checkedInAt; }
    public void setCheckedInAt(LocalDateTime v)  { this.checkedInAt = v; }

    public LocalDateTime getCheckedOutAt()       { return checkedOutAt; }
    public void setCheckedOutAt(LocalDateTime v) { this.checkedOutAt = v; }

    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime v)    { this.createdAt = v; }
}
