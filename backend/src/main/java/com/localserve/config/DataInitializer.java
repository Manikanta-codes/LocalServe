package com.localserve.config;

import com.localserve.model.*;
import com.localserve.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository, ServiceRepository serviceRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin user
        if (!userRepository.existsByEmail("admin@localserve.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@localserve.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("1234567890")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        // Seed default Service Provider user
        User provider = userRepository.findByEmail("provider@localserve.com").orElseGet(() -> {
            User p = User.builder()
                    .name("Alex Plumbing & Electrical")
                    .email("provider@localserve.com")
                    .password(passwordEncoder.encode("provider123"))
                    .phone("9876543210")
                    .role(Role.PROVIDER)
                    .build();
            return userRepository.save(p);
        });

        // Seed default Customer user
        if (!userRepository.existsByEmail("customer@localserve.com")) {
            User customer = User.builder()
                    .name("Jane Customer")
                    .email("customer@localserve.com")
                    .password(passwordEncoder.encode("customer123"))
                    .phone("5551234567")
                    .role(Role.CUSTOMER)
                    .build();
            userRepository.save(customer);
        }

        // Seed default Categories if empty
        if (categoryRepository.count() == 0) {
            Category plumbing = categoryRepository.save(Category.builder()
                    .name("Plumbing")
                    .description("Pipe repairs, leak detection, drain cleaning, and fixture installations.")
                    .build());

            Category electrical = categoryRepository.save(Category.builder()
                    .name("Electrical")
                    .description("Wiring, circuit repair, lighting installation, and electrical safety checks.")
                    .build());

            Category cleaning = categoryRepository.save(Category.builder()
                    .name("Home Cleaning")
                    .description("Deep home cleaning, sofa sanitization, window washing, and office cleaning.")
                    .build());

            Category appliance = categoryRepository.save(Category.builder()
                    .name("Appliance Repair")
                    .description("AC servicing, refrigerator repair, washing machine maintenance, and microwave fix.")
                    .build());

            Category gardening = categoryRepository.save(Category.builder()
                    .name("Lawn & Gardening")
                    .description("Lawn mowing, tree trimming, garden design, and weed control.")
                    .build());

            // Seed sample services
            if (serviceRepository.count() == 0) {
                serviceRepository.saveAll(List.of(
                        com.localserve.model.Service.builder()
                                .name("Emergency Leak Repair & Pipe Fix")
                                .description("Fast response for burst pipes, leaking faucets, and clogged drains.")
                                .price(75.0)
                                .location("Downtown & Metro Area")
                                .provider(provider)
                                .category(plumbing)
                                .build(),
                        com.localserve.model.Service.builder()
                                .name("Full House Electrical Inspection & Wiring")
                                .description("Complete diagnostic check of breaker panels, light fixtures, and outlets.")
                                .price(120.0)
                                .location("Metro & Suburban Region")
                                .provider(provider)
                                .category(electrical)
                                .build(),
                        com.localserve.model.Service.builder()
                                .name("Deep House Cleaning Service (3 BHK)")
                                .description("Includes kitchen degreasing, bathroom sanitization, floor scrubbing and dusting.")
                                .price(150.0)
                                .location("City Wide")
                                .provider(provider)
                                .category(cleaning)
                                .build(),
                        com.localserve.model.Service.builder()
                                .name("Split AC Servicing & Gas Refill")
                                .description("Comprehensive filter washing, coil chemical cleaning, and pressure check.")
                                .price(85.0)
                                .location("North & West Suburbs")
                                .provider(provider)
                                .category(appliance)
                                .build()
                ));
            }
        }
    }
}
