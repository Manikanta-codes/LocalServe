package com.localserve.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ServiceDto {
    private Long id;

    @NotBlank(message = "Service name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    private String categoryName;

    private Long providerId;
    private String providerName;
    private String providerEmail;
    private String providerPhone;

    public ServiceDto() {
    }

    public ServiceDto(Long id, String name, String description, Double price, String location, Long categoryId, String categoryName, Long providerId, String providerName, String providerEmail, String providerPhone) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.location = location;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.providerId = providerId;
        this.providerName = providerName;
        this.providerEmail = providerEmail;
        this.providerPhone = providerPhone;
    }

    public static ServiceDtoBuilder builder() {
        return new ServiceDtoBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public String getProviderEmail() {
        return providerEmail;
    }

    public void setProviderEmail(String providerEmail) {
        this.providerEmail = providerEmail;
    }

    public String getProviderPhone() {
        return providerPhone;
    }

    public void setProviderPhone(String providerPhone) {
        this.providerPhone = providerPhone;
    }

    public static class ServiceDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private String location;
        private Long categoryId;
        private String categoryName;
        private Long providerId;
        private String providerName;
        private String providerEmail;
        private String providerPhone;

        public ServiceDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ServiceDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ServiceDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ServiceDtoBuilder price(Double price) {
            this.price = price;
            return this;
        }

        public ServiceDtoBuilder location(String location) {
            this.location = location;
            return this;
        }

        public ServiceDtoBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public ServiceDtoBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public ServiceDtoBuilder providerId(Long providerId) {
            this.providerId = providerId;
            return this;
        }

        public ServiceDtoBuilder providerName(String providerName) {
            this.providerName = providerName;
            return this;
        }

        public ServiceDtoBuilder providerEmail(String providerEmail) {
            this.providerEmail = providerEmail;
            return this;
        }

        public ServiceDtoBuilder providerPhone(String providerPhone) {
            this.providerPhone = providerPhone;
            return this;
        }

        public ServiceDto build() {
            return new ServiceDto(id, name, description, price, location, categoryId, categoryName, providerId, providerName, providerEmail, providerPhone);
        }
    }
}
