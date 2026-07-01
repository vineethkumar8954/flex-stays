package com.flexstays.dto.response;

public class ApiResponse<T> {
    private boolean success;
    private String  message;
    private T       data;

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data    = data;
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.message = message;
        r.data    = data;
        return r;
    }

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.message = "OK";
        r.data    = data;
        return r;
    }

    public static ApiResponse<Void> ok(String message) {
        ApiResponse<Void> r = new ApiResponse<>();
        r.success = true;
        r.message = message;
        return r;
    }

    public boolean isSuccess() { return success; }
    public String  getMessage() { return message; }
    public T       getData()    { return data; }
    public void setSuccess(boolean success) { this.success = success; }
    public void setMessage(String message)  { this.message = message; }
    public void setData(T data)             { this.data = data; }
}
