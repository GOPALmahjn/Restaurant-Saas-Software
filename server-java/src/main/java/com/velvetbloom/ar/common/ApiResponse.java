package com.velvetbloom.ar.common;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Standard response envelope matching the Node backend and what the React
 * client expects: { success, message, data, pagination? }.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(boolean success, String message, T data, Pagination pagination) {

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "Success", data, null);
    }

    public static <T> ApiResponse<T> paginated(T data, Pagination pagination, String message) {
        return new ApiResponse<>(true, message, data, pagination);
    }

    public static ApiResponse<Object> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    /** Pagination block: { total, page, limit, totalPages }. */
    public record Pagination(long total, int page, int limit, int totalPages) {
        public static Pagination of(long total, int page, int limit) {
            int totalPages = limit > 0 ? (int) Math.ceil((double) total / limit) : 0;
            return new Pagination(total, page, limit, totalPages);
        }
    }
}
