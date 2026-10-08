package com.localserve.dto;

import com.localserve.model.Role;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;

    public JwtResponse() {
    }

    public JwtResponse(String token, String type, Long id, String name, String email, String phone, Role role) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }

    public static JwtResponseBuilder builder() {
        return new JwtResponseBuilder();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public static class JwtResponseBuilder {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;

        public JwtResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public JwtResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public JwtResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public JwtResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public JwtResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public JwtResponseBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public JwtResponseBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public JwtResponse build() {
            return new JwtResponse(token, type, id, name, email, phone, role);
        }
    }
}
