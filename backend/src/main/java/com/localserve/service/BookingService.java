package com.localserve.service;

import com.localserve.dto.BookingDto;
import com.localserve.exception.BadRequestException;
import com.localserve.exception.ResourceNotFoundException;
import com.localserve.model.*;
import com.localserve.repository.BookingRepository;
import com.localserve.repository.ServiceRepository;
import com.localserve.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, ServiceRepository serviceRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    public BookingDto createBooking(BookingDto dto, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        com.localserve.model.Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + dto.getServiceId()));

        if (service.getProvider().getId().equals(customer.getId())) {
            throw new BadRequestException("You cannot book your own service");
        }

        LocalDateTime bookingDateTime = dto.getBookingDate() != null ? dto.getBookingDate() : LocalDateTime.now().plusDays(1);

        Booking booking = Booking.builder()
                .customer(customer)
                .service(service)
                .bookingDate(bookingDateTime)
                .status(BookingStatus.PENDING)
                .address(dto.getAddress())
                .notes(dto.getNotes())
                .build();

        Booking saved = bookingRepository.save(booking);
        return mapToDto(saved);
    }

    public List<BookingDto> getCustomerBookings(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return bookingRepository.findByCustomerIdOrderByBookingDateDesc(customer.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<BookingDto> getProviderBookings(String providerEmail) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        return bookingRepository.findByServiceProviderIdOrderByBookingDateDesc(provider.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BookingDto cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!booking.getCustomer().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be cancelled. Current status is: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return mapToDto(updated);
    }

    public BookingDto updateBookingStatus(Long bookingId, BookingStatus status, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isProvider = booking.getService().getProvider().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isProvider && !isAdmin) {
            throw new BadRequestException("You are not authorized to update this booking's status");
        }

        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        return mapToDto(updated);
    }

    public BookingDto addReview(Long bookingId, String review, Integer rating, String customerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("Only the customer who booked this service can write a review");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Only COMPLETED services can be reviewed");
        }

        booking.setReview(review);
        booking.setRating(rating);
        Booking updated = bookingRepository.save(booking);
        return mapToDto(updated);
    }

    private BookingDto mapToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .serviceId(booking.getService().getId())
                .serviceName(booking.getService().getName())
                .servicePrice(booking.getService().getPrice())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getName())
                .customerEmail(booking.getCustomer().getEmail())
                .customerPhone(booking.getCustomer().getPhone())
                .providerId(booking.getService().getProvider().getId())
                .providerName(booking.getService().getProvider().getName())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .address(booking.getAddress())
                .notes(booking.getNotes())
                .review(booking.getReview())
                .rating(booking.getRating())
                .build();
    }
}
