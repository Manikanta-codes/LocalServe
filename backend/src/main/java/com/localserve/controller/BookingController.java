package com.localserve.controller;

import com.localserve.dto.ApiResponse;
import com.localserve.dto.BookingDto;
import com.localserve.dto.BookingStatusUpdateRequest;
import com.localserve.model.BookingStatus;
import com.localserve.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(@Valid @RequestBody BookingDto dto, Authentication authentication) {
        BookingDto created = bookingService.createBooking(dto, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", created));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", 
                bookingService.getCustomerBookings(authentication.getName())));
    }

    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getProviderBookings(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Provider bookings retrieved successfully", 
                bookingService.getProviderBookings(authentication.getName())));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved successfully", 
                bookingService.getAllBookings()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(@PathVariable Long id, Authentication authentication) {
        BookingDto cancelled = bookingService.cancelBooking(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", cancelled));
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> acceptBooking(@PathVariable Long id, Authentication authentication) {
        BookingDto updated = bookingService.updateBookingStatus(id, BookingStatus.ACCEPTED, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking accepted successfully", updated));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> rejectBooking(@PathVariable Long id, Authentication authentication) {
        BookingDto updated = bookingService.updateBookingStatus(id, BookingStatus.REJECTED, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully", updated));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> updateBookingStatus(
            @PathVariable Long id, 
            @Valid @RequestBody BookingStatusUpdateRequest request, 
            Authentication authentication) {
        BookingDto updated = bookingService.updateBookingStatus(id, request.getStatus(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking status updated to " + request.getStatus(), updated));
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> reviewBooking(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> payload, 
            Authentication authentication) {
        String review = (String) payload.get("review");
        Integer rating = payload.get("rating") != null ? Integer.parseInt(payload.get("rating").toString()) : 5;
        BookingDto reviewed = bookingService.addReview(id, review, rating, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", reviewed));
    }
}
