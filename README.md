# LOCAL SERVE — Full-Stack On-Demand Local Services Platform

LOCAL SERVE is a modern, full-stack web application designed to connect customers with verified local service professionals (plumbers, electricians, cleaners, repair technicians) for instant booking and service management.

---

## 🛠️ Tech Stack

### **Backend**
* **Java**: 21
* **Framework**: Spring Boot 3.2.5
* **Build Tool**: Maven
* **Database**: MySQL (`localserve`)
* **OR/M**: Spring Data JPA & Hibernate
* **Security**: Spring Security 6 with stateless JWT Authentication & BCrypt Password Hashing
* **Server Port**: `8081`

### **Frontend**
* **Framework**: React 18
* **Build Tool**: Vite
* **Routing**: React Router DOM v6
* **HTTP Client**: Axios (with JWT bearer token interceptors)
* **Styling**: Modern Vanilla CSS Design System
* **Frontend Port**: `5173`

---

## 📁 Project Structure

```text
LocalServe/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/localserve/
│           │   ├── LocalserveApplication.java
│           │   ├── config/ (SecurityConfig, DataInitializer)
│           │   ├── controller/ (AuthController, CategoryController, ServiceController, BookingController, UserController)
│           │   ├── dto/ (ApiResponse, LoginRequest, RegisterRequest, JwtResponse, ServiceDto, BookingDto, etc.)
│           │   ├── exception/ (GlobalExceptionHandler, BadRequestException, ResourceNotFoundException)
│           │   ├── model/ (User, Category, Service, Booking, Role, BookingStatus)
│           │   ├── repository/ (UserRepository, CategoryRepository, ServiceRepository, BookingRepository)
│           │   ├── security/ (JwtUtils, AuthTokenFilter, UserDetailsServiceImpl, UserDetailsImpl)
│           │   └── service/ (AuthService, CategoryService, ServiceManagementService, BookingService, UserService)
│           └── resources/
│               └── application.properties
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── api/axiosInstance.js
        ├── components/ (Navbar, Footer, ServiceCard, ProtectedRoute, Loading, ErrorMessage)
        ├── context/AuthContext.jsx
        ├── pages/ (Home, Login, Register, Services, ServiceDetails, MyBookings, ProviderDashboard, AdminDashboard, Profile)
        └── index.css
```

---

## 🗄️ MySQL Database Setup

1. Start your local MySQL Server on default port `3306`.
2. Create the database (or let Spring Boot automatically create it):
   ```sql
   CREATE DATABASE IF NOT EXISTS localserve;
   ```
3. Update database credentials in `backend/src/main/resources/application.properties` or set Environment Variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://localhost:3306/localserve`
   - `SPRING_DATASOURCE_USERNAME`: `root`
   - `SPRING_DATASOURCE_PASSWORD`: `root`

---

## 🚀 How to Run the Application

### **1. Run Backend (Port 8081)**
Open a terminal in `LocalServe/backend` and execute:
```bash
cd backend
mvn spring-boot:run
```
The backend server will start at: `http://localhost:8081`

---

### **2. Run Frontend (Port 5173)**
Open a separate terminal in `LocalServe/frontend` and execute:
```bash
cd frontend
npm install
npm run dev
```
The React frontend application will start at: `http://localhost:5173`

---

## 👥 Default Demo Credentials

On initial backend startup, default seed data (admin user, provider user, customer user, categories, and sample services) is automatically loaded:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@localserve.com` | `admin123` | Full access to users, categories, services & all bookings |
| **PROVIDER** | `provider@localserve.com` | `provider123` | Manage assigned bookings, update status, list services |
| **CUSTOMER** | `customer@localserve.com` | `customer123` | Browse services, place bookings, cancel pending, post reviews |

---

## 🔑 REST API Endpoints

### **Authentication**
- `POST /api/auth/register` — Register a new Customer or Provider
- `POST /api/auth/login` — Authenticate and receive JWT token

### **Categories (Public & Admin)**
- `GET /api/categories` — List all categories
- `GET /api/categories/{id}` — Get category by ID
- `POST /api/categories` — Create category (ADMIN)
- `PUT /api/categories/{id}` — Edit category (ADMIN)
- `DELETE /api/categories/{id}` — Delete category (ADMIN)

### **Services (Public & Provider/Admin)**
- `GET /api/services` — List services (supports `categoryId` & `search` filters)
- `GET /api/services/{id}` — Service details
- `GET /api/services/provider` — Get current provider's services
- `POST /api/services` — Create service listing (PROVIDER / ADMIN)
- `PUT /api/services/{id}` — Update service (PROVIDER / ADMIN)
- `DELETE /api/services/{id}` — Delete service (PROVIDER / ADMIN)

### **Bookings (Protected)**
- `POST /api/bookings` — Create a booking (CUSTOMER)
- `GET /api/bookings/my-bookings` — Customer's bookings
- `GET /api/bookings/provider` — Provider's assigned bookings
- `GET /api/bookings/all` — All platform bookings (ADMIN)
- `PUT /api/bookings/{id}/cancel` — Cancel pending booking (CUSTOMER)
- `PUT /api/bookings/{id}/accept` — Accept booking (PROVIDER)
- `PUT /api/bookings/{id}/reject` — Reject booking (PROVIDER)
- `PUT /api/bookings/{id}/status` — Update status (`IN_PROGRESS`, `COMPLETED`, etc.)
- `POST /api/bookings/{id}/review` — Write review & star rating (CUSTOMER)

### **Users (Protected)**
- `GET /api/users/profile` — Get current profile
- `PUT /api/users/profile` — Update name / phone
- `GET /api/users/all` — View registered users (ADMIN)
- `GET /api/users/providers` — View active providers
