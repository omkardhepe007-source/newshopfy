# 🛍️ ShopEasy — Mini E-Commerce Web Application

A full-stack E-Commerce application built with **Spring Boot 3** (Java 21) + **React 18**.
Portfolio project for Java Full Stack Developers.

---

## 🗂️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 21, JavaScript (ES6+) |
| Backend | Spring Boot 3.2, Spring Security 6, JWT |
| ORM | Spring Data JPA + Hibernate |
| Database | Aiven MySQL (Cloud) |
| Build | Maven 3.9 |
| Frontend | React 18, React Router 6, Axios |
| UI | Bootstrap 5 + Bootstrap Icons |
| API Docs | SpringDoc OpenAPI 3 (Swagger UI) |
| Testing | JUnit 5 + Mockito |
| Deploy | Render (Backend) + Netlify (Frontend) + Aiven (DB) |
| Container | Docker + Docker Compose |

---

## 📦 Project Structure

```
shopeasy/
├── backend/
│   ├── src/main/java/com/shopeasy/
│   │   ├── config/          # SecurityConfig, OpenApiConfig, DataInitializer
│   │   ├── security/        # JwtAuthFilter, UserDetailsServiceImpl
│   │   ├── entity/          # User, Role, Product, Cart, CartItem, Order, OrderItem
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── service/         # Business logic layer
│   │   ├── controller/      # REST Controllers
│   │   ├── exception/       # GlobalExceptionHandler
│   │   └── util/            # JwtUtils
│   └── src/main/resources/
│       ├── application.properties        # Uses env variables
│       ├── application-prod.properties   # Render deployment profile
│       └── schema.sql                    # DB schema + seed data
├── frontend/
│   └── src/
│       ├── context/         # AuthContext
│       ├── services/        # Axios API calls
│       ├── routes/          # PrivateRoute, AdminRoute
│       ├── layouts/         # MainLayout
│       ├── components/      # Navbar, Footer, ProductCard
│       └── pages/
│           ├── public/      # Home, Login, Register, ProductList, ProductDetails
│           ├── customer/    # Cart, Orders, Profile
│           └── admin/       # AdminDashboard, ManageProducts
├── .env.example             # ← Copy to .env and fill your credentials
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Local Setup

### Step 1 — Create your .env file

```bash
# Copy the example file
cp .env.example .env

# Open .env and fill in your Aiven credentials
```

Your `.env` should look like:
```
DB_URL=jdbc:mysql://YOUR_AIVEN_HOST:PORT/defaultdb?useSSL=true&requireSSL=true&verifyServerCertificate=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=avnadmin
DB_PASSWORD=your_aiven_password
JWT_SECRET=ShopEasySecretKey2024VeryLongSecretKeyForJWTSigning12345
JWT_EXPIRATION=86400000
CORS_ORIGINS=http://localhost:3000
```

> ⚠️ Never commit `.env` to GitHub. It is already in `.gitignore`.

---

### Step 2 — Run Backend

```bash
cd backend

# Windows — set env vars then run
set DB_URL=jdbc:mysql://YOUR_AIVEN_HOST:PORT/defaultdb?useSSL=true&requireSSL=true&verifyServerCertificate=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
set DB_USERNAME=avnadmin
set DB_PASSWORD=your_aiven_password

mvn spring-boot:run
```

Backend: `http://localhost:8080`
Swagger: `http://localhost:8080/swagger-ui.html`

---

### Step 3 — Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`

---

### Run with Docker

```bash
# Make sure .env file exists in project root
docker-compose up --build
```

---

## 🔐 Default Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopeasy.com | admin123 |
| Customer | Register at /register | your choice |

---

## ☁️ Deployment

### Backend → Render

Set these **Environment Variables** in Render dashboard:

```
DB_URL           = jdbc:mysql://YOUR_AIVEN_HOST:PORT/defaultdb?useSSL=true&requireSSL=true&verifyServerCertificate=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME      = avnadmin
DB_PASSWORD      = your_aiven_password
JWT_SECRET       = ShopEasySecretKey2024VeryLongSecretKeyForJWTSigning12345
JWT_EXPIRATION   = 86400000
CORS_ORIGINS     = https://your-frontend.netlify.app
SPRING_PROFILES_ACTIVE = prod
```

### Frontend → Netlify

Set this **Environment Variable** in Netlify dashboard:
```
REACT_APP_API_URL = https://your-render-backend.onrender.com/api
```

---

## 📡 API Reference

All responses: `{ "success": true, "message": "...", "data": {} }`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/products` | Public | Browse products |
| POST | `/api/cart/add` | Customer | Add to cart |
| POST | `/api/orders/place` | Customer | Place order |
| GET | `/api/users/profile` | Customer | View profile |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/orders/admin/{id}/status` | Admin | Update order |

---

## 🧪 Tests

```bash
cd backend && mvn test
```

---

*Built with ❤️ as a Java Full Stack Portfolio Project*
