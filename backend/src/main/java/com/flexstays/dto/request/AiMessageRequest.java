package com.flexstays.dto.request;

public class AiMessageRequest {
    private String message;
    private String currentPage;
    private String activeId;
    private String userEmail;
    private String userRole;

    public AiMessageRequest() {}

    public AiMessageRequest(String message, String currentPage, String activeId, String userEmail, String userRole) {
        this.message = message;
        this.currentPage = currentPage;
        this.activeId = activeId;
        this.userEmail = userEmail;
        this.userRole = userRole;
    }

    // Getters & Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCurrentPage() { return currentPage; }
    public void setCurrentPage(String currentPage) { this.currentPage = currentPage; }
    public String getActiveId() { return activeId; }
    public void setActiveId(String activeId) { this.activeId = activeId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
}
