package com.localserve.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "services")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @NotNull
    @Column(nullable = false)
    private Double price;

    @NotBlank
    private String location;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public Service() {
    }

    public Service(Long id, String name, String description, Double price, String location, User provider, Category category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.location = location;
        this.provider = provider;
        this.category = category;
    }

    public static ServiceBuilder builder() {
        return new ServiceBuilder();
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

    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public static class ServiceBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private String location;
        private User provider;
        private Category category;

        public ServiceBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ServiceBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ServiceBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ServiceBuilder price(Double price) {
            this.price = price;
            return this;
        }

        public ServiceBuilder location(String location) {
            this.location = location;
            return this;
        }

        public ServiceBuilder provider(User provider) {
            this.provider = provider;
            return this;
        }

        public ServiceBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public Service build() {
            return new Service(id, name, description, price, location, provider, category);
        }
    }
}
