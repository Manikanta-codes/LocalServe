package com.localserve.service;

import com.localserve.dto.ServiceDto;
import com.localserve.exception.BadRequestException;
import com.localserve.exception.ResourceNotFoundException;
import com.localserve.model.Category;
import com.localserve.model.Role;
import com.localserve.model.User;
import com.localserve.repository.CategoryRepository;
import com.localserve.repository.ServiceRepository;
import com.localserve.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceManagementService {

    private final ServiceRepository serviceRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ServiceManagementService(ServiceRepository serviceRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<ServiceDto> getAllServices(Long categoryId, String search) {
        List<com.localserve.model.Service> services;

        if (categoryId != null) {
            services = serviceRepository.findByCategoryId(categoryId);
        } else if (search != null && !search.isBlank()) {
            services = serviceRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
        } else {
            services = serviceRepository.findAll();
        }

        return services.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ServiceDto getServiceById(Long id) {
        com.localserve.model.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return mapToDto(service);
    }

    public List<ServiceDto> getServicesByProvider(Long providerId) {
        return serviceRepository.findByProviderId(providerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ServiceDto createService(ServiceDto dto, String providerEmail) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        if (provider.getRole() != Role.PROVIDER && provider.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only service providers or admins can create services");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        com.localserve.model.Service service = com.localserve.model.Service.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .location(dto.getLocation())
                .provider(provider)
                .category(category)
                .build();

        com.localserve.model.Service saved = serviceRepository.save(service);
        return mapToDto(saved);
    }

    public ServiceDto updateService(Long id, ServiceDto dto, String userEmail) {
        com.localserve.model.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!service.getProvider().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("You are not authorized to update this service");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        service.setLocation(dto.getLocation());
        service.setCategory(category);

        com.localserve.model.Service updated = serviceRepository.save(service);
        return mapToDto(updated);
    }

    public void deleteService(Long id, String userEmail) {
        com.localserve.model.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!service.getProvider().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("You are not authorized to delete this service");
        }

        serviceRepository.delete(service);
    }

    private ServiceDto mapToDto(com.localserve.model.Service service) {
        return ServiceDto.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .price(service.getPrice())
                .location(service.getLocation())
                .categoryId(service.getCategory().getId())
                .categoryName(service.getCategory().getName())
                .providerId(service.getProvider().getId())
                .providerName(service.getProvider().getName())
                .providerEmail(service.getProvider().getEmail())
                .providerPhone(service.getProvider().getPhone())
                .build();
    }
}
