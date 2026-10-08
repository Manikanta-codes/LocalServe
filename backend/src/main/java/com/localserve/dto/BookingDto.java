package com.localserve.dto;

import com.localserve.model.BookingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class BookingDto {
    private Long id;

    @NotNull(message = "Service ID is required")
    private Long serviceId;
    private String serviceName;
    private Double servicePrice;

    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private Long providerId;
    private String providerName;

    private LocalDateTime bookingDate;
    private BookingStatus status;

    @NotBlank(message = "Service address is required")
    private String address;

    private String notes;
    private String review;
    private Integer rating;

    public BookingDto() {
    }

    public BookingDto(Long id, Long serviceId, String serviceName, Double servicePrice, Long customerId, String customerName, String customerEmail, String customerPhone, Long providerId, String providerName, LocalDateTime bookingDate, BookingStatus status, String address, String notes, String review, Integer rating) {
        this.id = id;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.servicePrice = servicePrice;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.providerId = providerId;
        this.providerName = providerName;
        this.bookingDate = bookingDate;
        this.status = status;
        this.address = address;
        this.notes = notes;
        this.review = review;
        this.rating = rating;
    }

    public static BookingDtoBuilder builder() {
        return new BookingDtoBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Double getServicePrice() {
        return servicePrice;
    }

    public void setServicePrice(Double servicePrice) {
        this.servicePrice = servicePrice;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public static class BookingDtoBuilder {
        private Long id;
        private Long serviceId;
        private String serviceName;
        private Double servicePrice;
        private Long customerId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private Long providerId;
        private String providerName;
        private LocalDateTime bookingDate;
        private BookingStatus status;
        private String address;
        private String notes;
        private String review;
        private Integer rating;

        public BookingDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BookingDtoBuilder serviceId(Long serviceId) {
            this.serviceId = serviceId;
            return this;
        }

        public BookingDtoBuilder serviceName(String serviceName) {
            this.serviceName = serviceName;
            return this;
        }

        public BookingDtoBuilder servicePrice(Double servicePrice) {
            this.servicePrice = servicePrice;
            return this;
        }

        public BookingDtoBuilder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public BookingDtoBuilder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public BookingDtoBuilder customerEmail(String customerEmail) {
            this.customerEmail = customerEmail;
            return this;
        }

        public BookingDtoBuilder customerPhone(String customerPhone) {
            this.customerPhone = customerPhone;
            return this;
        }

        public BookingDtoBuilder providerId(Long providerId) {
            this.providerId = providerId;
            return this;
        }

        public BookingDtoBuilder providerName(String providerName) {
            this.providerName = providerName;
            return this;
        }

        public BookingDtoBuilder bookingDate(LocalDateTime bookingDate) {
            this.bookingDate = bookingDate;
            return this;
        }

        public BookingDtoBuilder status(BookingStatus status) {
            this.status = status;
            return this;
        }

        public BookingDtoBuilder address(String address) {
            this.address = address;
            return this;
        }

        public BookingDtoBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public BookingDtoBuilder review(String review) {
            this.review = review;
            return this;
        }

        public BookingDtoBuilder rating(Integer rating) {
            this.rating = rating;
            return this;
        }

        public BookingDto build() {
            return new BookingDto(id, serviceId, serviceName, servicePrice, customerId, customerName, customerEmail, customerPhone, providerId, providerName, bookingDate, status, address, notes, review, rating);
        }
    }
}
