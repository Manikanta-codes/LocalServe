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
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS localserve;
   ```
3. Set the following environment variables for the backend process (the application does not silently fall back to local database credentials):
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://localhost:3306/localserve?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`: your local MySQL username
   - `SPRING_DATASOURCE_PASSWORD`: your local MySQL password

---

## 🚀 How to Run the Application

### Production deployment configuration

The frontend requires `VITE_API_URL` to be set in the Vercel project before building. Set it to the backend origin, for example `https://localserve-backend-o280.onrender.com` (do not add `/api`; the frontend adds it). Vite embeds this value at build time, so redeploy the frontend after changing it.

In the Render backend service, configure these environment variables:

- `SPRING_DATASOURCE_URL`: Copy the JDBC URL from the Aiven service's **Overview → Quick connect → Java** connection details. Use the current Aiven host, port, database, and TLS query parameter (`sslmode=require`); do not reuse an old hostname.
- `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`: Use the credentials shown by Aiven. Keep them in Render's environment settings, not in source code.
- `JWT_SECRET`: A private signing secret of at least 32 characters.
- `APP_CORS_ALLOWED_ORIGINS`: Comma-separated Vercel origins, with no trailing slash. Include every hostname that users actually visit, such as `https://local-serve-service.vercel.app` and `https://local-serve-kappa.vercel.app` if both remain active.

Render supplies `PORT`; the backend binds to it through `server.port=${PORT:8081}`. Database connection waits are bounded so requests fail instead of waiting on the driver's longer defaults.

For local development, set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, and `JWT_SECRET` in the backend environment before starting it. Never use a production database URL in a local `.env` file that is committed to Git.

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
