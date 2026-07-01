package com.flexstays.dto.response;

public class AuthResponse {

    private String token;
    private String tokenType;   // "Bearer"
    private String userType;    // "user" or "staff"
    private Long   id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String avatarUrl;
    private String dashboardUrl;

    public AuthResponse() {}

    private AuthResponse(Builder builder) {
        this.token        = builder.token;
        this.tokenType    = builder.tokenType;
        this.userType     = builder.userType;
        this.id           = builder.id;
        this.firstName    = builder.firstName;
        this.lastName     = builder.lastName;
        this.email        = builder.email;
        this.role         = builder.role;
        this.avatarUrl    = builder.avatarUrl;
        this.dashboardUrl = builder.dashboardUrl;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private String tokenType;
        private String userType;
        private Long   id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private String avatarUrl;
        private String dashboardUrl;

        public Builder token(String token)               { this.token = token; return this; }
        public Builder tokenType(String tokenType)       { this.tokenType = tokenType; return this; }
        public Builder userType(String userType)         { this.userType = userType; return this; }
        public Builder id(Long id)                       { this.id = id; return this; }
        public Builder firstName(String firstName)       { this.firstName = firstName; return this; }
        public Builder lastName(String lastName)         { this.lastName = lastName; return this; }
        public Builder email(String email)               { this.email = email; return this; }
        public Builder role(String role)                 { this.role = role; return this; }
        public Builder avatarUrl(String avatarUrl)       { this.avatarUrl = avatarUrl; return this; }
        public Builder dashboardUrl(String dashboardUrl) { this.dashboardUrl = dashboardUrl; return this; }

        public AuthResponse build() { return new AuthResponse(this); }
    }

    public String getToken()        { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType()    { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getUserType()     { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public Long getId()             { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName()    { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName()     { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail()        { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole()         { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatarUrl()    { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getDashboardUrl() { return dashboardUrl; }
    public void setDashboardUrl(String dashboardUrl) { this.dashboardUrl = dashboardUrl; }
}
