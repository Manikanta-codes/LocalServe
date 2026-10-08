package com.localserve.dto;

import com.localserve.model.Role;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;

    public UserDto() {
    }

    public UserDto(Long id, String name, String email, String phone, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public static class UserDtoBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;

        public UserDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserDtoBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserDtoBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserDtoBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserDto build() {
            return new UserDto(id, name, email, phone, role);
        }
    }
}
