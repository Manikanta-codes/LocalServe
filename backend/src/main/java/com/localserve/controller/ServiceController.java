package com.localserve.controller;

import com.localserve.dto.ApiResponse;
import com.localserve.dto.ServiceDto;
import com.localserve.service.ServiceManagementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceManagementService serviceManagementService;

    public ServiceController(ServiceManagementService serviceManagementService) {
        this.serviceManagementService = serviceManagementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getAllServices(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", 
                serviceManagementService.getAllServices(categoryId, search)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDto>> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Service retrieved successfully", 
                serviceManagementService.getServiceById(id)));
    }

    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getProviderServices(Authentication authentication) {
        String providerEmail = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Provider services retrieved successfully",
                serviceManagementService.getServicesByProvider(
                        serviceManagementService.getAllServices(null, null).stream()
                                .filter(s -> providerEmail.equalsIgnoreCase(s.getProviderEmail()))
                                .findFirst()
                                .map(ServiceDto::getProviderId)
                                .orElse(0L)
                )));
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceDto>> createService(@Valid @RequestBody ServiceDto dto, Authentication authentication) {
        ServiceDto created = serviceManagementService.createService(dto, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Service created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceDto>> updateService(
            @PathVariable Long id, 
            @Valid @RequestBody ServiceDto dto, 
            Authentication authentication) {
        ServiceDto updated = serviceManagementService.updateService(id, dto, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Service updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id, Authentication authentication) {
        serviceManagementService.deleteService(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Service deleted successfully"));
    }
}
