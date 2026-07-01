package com.flexstays.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class RoomResponse {

    private Long        id;
    private String      roomNumber;
    private int         floor;
    private String      category;
    private String      name;
    private String      description;
    private BigDecimal  pricePerNight;
    private int         maxGuests;
    private List<String> amenities;
    private String      imageUrl;
    private String      status;
    private String      housekeeping;

    public RoomResponse() {}

    private RoomResponse(Builder builder) {
        this.id           = builder.id;
        this.roomNumber   = builder.roomNumber;
        this.floor        = builder.floor;
        this.category     = builder.category;
        this.name         = builder.name;
        this.description  = builder.description;
        this.pricePerNight = builder.pricePerNight;
        this.maxGuests    = builder.maxGuests;
        this.amenities    = builder.amenities;
        this.imageUrl     = builder.imageUrl;
        this.status       = builder.status;
        this.housekeeping = builder.housekeeping;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long        id;
        private String      roomNumber;
        private int         floor;
        private String      category;
        private String      name;
        private String      description;
        private BigDecimal  pricePerNight;
        private int         maxGuests;
        private List<String> amenities;
        private String      imageUrl;
        private String      status;
        private String      housekeeping;

        public Builder id(Long id)                          { this.id = id; return this; }
        public Builder roomNumber(String roomNumber)        { this.roomNumber = roomNumber; return this; }
        public Builder floor(int floor)                     { this.floor = floor; return this; }
        public Builder category(String category)            { this.category = category; return this; }
        public Builder name(String name)                    { this.name = name; return this; }
        public Builder description(String description)      { this.description = description; return this; }
        public Builder pricePerNight(BigDecimal price)      { this.pricePerNight = price; return this; }
        public Builder maxGuests(int maxGuests)             { this.maxGuests = maxGuests; return this; }
        public Builder amenities(List<String> amenities)    { this.amenities = amenities; return this; }
        public Builder imageUrl(String imageUrl)            { this.imageUrl = imageUrl; return this; }
        public Builder status(String status)                { this.status = status; return this; }
        public Builder housekeeping(String housekeeping)    { this.housekeeping = housekeeping; return this; }

        public RoomResponse build() { return new RoomResponse(this); }
    }

    public Long getId()                      { return id; }
    public void setId(Long id)               { this.id = id; }

    public String getRoomNumber()            { return roomNumber; }
    public void setRoomNumber(String v)      { this.roomNumber = v; }

    public int getFloor()                    { return floor; }
    public void setFloor(int v)              { this.floor = v; }

    public String getCategory()              { return category; }
    public void setCategory(String v)        { this.category = v; }

    public String getName()                  { return name; }
    public void setName(String v)            { this.name = v; }

    public String getDescription()           { return description; }
    public void setDescription(String v)     { this.description = v; }

    public BigDecimal getPricePerNight()     { return pricePerNight; }
    public void setPricePerNight(BigDecimal v) { this.pricePerNight = v; }

    public int getMaxGuests()                { return maxGuests; }
    public void setMaxGuests(int v)          { this.maxGuests = v; }

    public List<String> getAmenities()       { return amenities; }
    public void setAmenities(List<String> v) { this.amenities = v; }

    public String getImageUrl()              { return imageUrl; }
    public void setImageUrl(String v)        { this.imageUrl = v; }

    public String getStatus()                { return status; }
    public void setStatus(String v)          { this.status = v; }

    public String getHousekeeping()          { return housekeeping; }
    public void setHousekeeping(String v)    { this.housekeeping = v; }
}
