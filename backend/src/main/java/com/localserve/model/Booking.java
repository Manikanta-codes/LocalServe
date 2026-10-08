package com.localserve.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @Column(length = 1000)
    private String notes;

    @Column(length = 1000)
    private String review;

    private Integer rating;

    public Booking() {
    }

    public Booking(Long id, User customer, Service service, LocalDateTime bookingDate, BookingStatus status, String address, String notes, String review, Integer rating) {
        this.id = id;
        this.customer = customer;
        this.service = service;
        this.bookingDate = bookingDate;
        this.status = status;
        this.address = address;
        this.notes = notes;
        this.review = review;
        this.rating = rating;
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
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

    public static class BookingBuilder {
        private Long id;
        private User customer;
        private Service service;
        private LocalDateTime bookingDate;
        private BookingStatus status;
        private String address;
        private String notes;
        private String review;
        private Integer rating;

        public BookingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BookingBuilder customer(User customer) {
            this.customer = customer;
            return this;
        }

        public BookingBuilder service(Service service) {
            this.service = service;
            return this;
        }

        public BookingBuilder bookingDate(LocalDateTime bookingDate) {
            this.bookingDate = bookingDate;
            return this;
        }

        public BookingBuilder status(BookingStatus status) {
            this.status = status;
            return this;
        }

        public BookingBuilder address(String address) {
            this.address = address;
            return this;
        }

        public BookingBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public BookingBuilder review(String review) {
            this.review = review;
            return this;
        }

        public BookingBuilder rating(Integer rating) {
            this.rating = rating;
            return this;
        }

        public Booking build() {
            return new Booking(id, customer, service, bookingDate, status, address, notes, review, rating);
        }
    }
}
