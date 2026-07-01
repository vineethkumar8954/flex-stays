package com.flexstays.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CreateStaffRequest {

    @NotBlank private String firstName;
    private String lastName;
    @NotBlank @Email private String email;
    @NotBlank private String password;
    @NotBlank private String role; // ADMIN, RECEPTION, HOUSEKEEPING, MAINTENANCE, MANAGER

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
