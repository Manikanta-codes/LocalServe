package com.localserve.repository;

import com.localserve.model.Booking;
import com.localserve.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByBookingDateDesc(Long customerId);
    List<Booking> findByServiceProviderIdOrderByBookingDateDesc(Long providerId);
    List<Booking> findByStatus(BookingStatus status);
}
