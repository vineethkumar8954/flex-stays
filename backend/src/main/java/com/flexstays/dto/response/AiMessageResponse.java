package com.flexstays.dto.response;

import java.util.List;
import java.util.Map;

public class AiMessageResponse {
    private String text;
    private String intent;
    private Map<String, String> entities;
    private String type; // room, package, event, dining, wine, comparison, action, none
    private List<?> items;
    private String action; // plan-wedding, checkout, redirect, etc.
    private List<String> suggestions;

    public AiMessageResponse() {}

    public AiMessageResponse(String text, String intent, Map<String, String> entities, String type, List<?> items, String action, List<String> suggestions) {
        this.text = text;
        this.intent = intent;
        this.entities = entities;
        this.type = type;
        this.items = items;
        this.action = action;
        this.suggestions = suggestions;
    }

    // Getters & Setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }
    public Map<String, String> getEntities() { return entities; }
    public void setEntities(Map<String, String> entities) { this.entities = entities; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public List<?> getItems() { return items; }
    public void setItems(List<?> items) { this.items = items; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
}
