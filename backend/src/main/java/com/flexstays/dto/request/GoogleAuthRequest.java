package com.flexstays.dto.request;

import jakarta.validation.constraints.NotBlank;

/** Validates Google ID token from the frontend */
public class GoogleAuthRequest {
    @NotBlank(message = "Google ID token is required")
    private String idToken;

    public String getIdToken() { return idToken; }
    public void setIdToken(String idToken) { this.idToken = idToken; }
}
