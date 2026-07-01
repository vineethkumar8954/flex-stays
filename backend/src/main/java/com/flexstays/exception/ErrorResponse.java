package com.flexstays.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private Map<String, String> fieldErrors;
    private LocalDateTime timestamp;

    public ErrorResponse() {}

    public static ErrorResponse of(int status, String error, String message) {
        ErrorResponse r = new ErrorResponse();
        r.status    = status;
        r.error     = error;
        r.message   = message;
        r.timestamp = LocalDateTime.now();
        return r;
    }

    public static ErrorResponse of(int status, String error, String message, Map<String, String> fieldErrors) {
        ErrorResponse r = of(status, error, message);
        r.fieldErrors = fieldErrors;
        return r;
    }

    public int getStatus()                        { return status; }
    public String getError()                      { return error; }
    public String getMessage()                    { return message; }
    public Map<String, String> getFieldErrors()   { return fieldErrors; }
    public LocalDateTime getTimestamp()           { return timestamp; }
    public void setStatus(int v)                  { this.status = v; }
    public void setError(String v)                { this.error = v; }
    public void setMessage(String v)              { this.message = v; }
    public void setFieldErrors(Map<String,String> v) { this.fieldErrors = v; }
    public void setTimestamp(LocalDateTime v)     { this.timestamp = v; }
}
