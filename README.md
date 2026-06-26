# 🛍️ ShopEasy — Mini E-Commerce Web Application

A full-stack E-Commerce application built with **Spring Boot 3** (Java 21) + **React 18**.
Portfolio project for Java Full Stack Developers.

---

## 🗂️ Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Language  | Java 21, JavaScript (ES6+)              |
| Backend   | Spring Boot 3.2, Spring Security 6, JWT |
| ORM       | Spring Data JPA + Hibernate             |
| Database  | **Aiven MySQL** (Cloud)                 |
| Build     | Maven 3.9                               |
| Frontend  | React 18, React Router 6, Axios         |
| UI        | Bootstrap 5 + Bootstrap Icons           |
| API Docs  | SpringDoc OpenAPI 3 (Swagger UI)        |
| Testing   | JUnit 5 + Mockito                       |
| Deploy    | Render (Backend) + Netlify (Frontend)   |
| Container | Docker + Docker Compose                 |

---

## 📦 Project Structure

```
shopeasy/
├── backend/
│   ├── src/main/java/com/shopeasy/
│   │   ├── config/          # SecurityConfig, OpenApiConfig, DataInitializer
│   │   ├── security/        # JwtAuthFilter, UserDetailsServiceImpl
│   │   ├── entity/          # User, Role, Product, Cart, CartItem, Order, OrderItem
│   │   ├── dto/             # ApiResponse, AuthDTO, ProductDTO, CartDTO, OrderDTO, UserDTO
│   │   ├── repository/      # JPA Repositories
│   │   ├── service/         # AuthService, ProductService, CartService, OrderService, UserService
│   │   ├── controller/      # REST Controllers
│   │   ├── exception/       # GlobalExceptionHandler, ResourceNotFoundException
│   │   └── util/            # JwtUtils
│   └── src/main/resources/
│       ├── application.properties       ← Aiven DB config (local dev)
│       ├── application-prod.properties  ← Env vars for Render deployment
│       └── schema.sql                   ← DB schema + seed data
├── frontend/
│   └── src/
│       ├── context/         # AuthContext (global auth state)
│       ├── services/        # Axios API calls
│       ├── routes/          # PrivateRoute, AdminRoute
│       ├── layouts/         # MainLayout
│       ├── components/      # Navbar, Footer, ProductCard
│       └── pages/
│           ├── public/      # Home, Login, Register, ProductList, ProductDetails
│           ├── customer/    # Cart, Orders, Profile
│           └── admin/       # AdminDashboard, ManageProducts
├── docker-compose.yml       ← Backend + Frontend (uses Aiven DB)
└── README.md
```

---

## 🗄️ Database — Aiven MySQL

This project uses **Aiven** hosted MySQL. Connection details are in `application.properties`.

```
Host:     mysql-285338ff-omkardhepe007-1a69.h.aivencloud.com
Port:     11560
Database: defaultdb
User:     avnadmin
SSL:      REQUIRED
```

---

## 🚀 Running Locally

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+

### Backend

```bash
cd backend
mvn spring-boot:run
```

On first run, `DataInitializer` auto-creates:

- `ROLE_ADMIN` and `ROLE_CUSTOMER` roles
- Default admin: `admin@shopeasy.com` / `admin123`
- Sample products (via schema.sql)

Backend starts at: `http://localhost:8080`
Swagger UI at: `http://localhost:8080/swagger-ui.html`

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend starts at: `http://localhost:3000`

---

## 🐳 Running with Docker

```bash
# From root of project
docker-compose up --build

# Frontend: http://localhost
# Backend:  http://localhost:8080
# Swagger:  http://localhost:8080/swagger-ui.html
```

---

## ☁️ Deployment Guide

### Stack

```
GitHub → Render (Backend) → Aiven (MySQL)
              ↑
         Netlify (Frontend)
```

---

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: ShopEasy"
git remote add origin https://github.com/YOUR_USERNAME/shopeasy.git
git push -u origin main
```

---

### Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set **Root Directory**: `backend`
4. Set **Environment**: `Docker`
5. Add these **Environment Variables**:

```
SPRING_DATASOURCE_URL      = <your-database-url>
SPRING_DATASOURCE_USERNAME = <your-db-username>
SPRING_DATASOURCE_PASSWORD = <your-db-password>
APP_JWT_SECRET             = <your-jwt-secret-key>
APP_JWT_EXPIRATION         = 86400000
APP_CORS_ALLOWED_ORIGINS   = https://your-frontend.netlify.app
SPRING_PROFILES_ACTIVE     = prod
```

6. Click **Deploy** — takes ~5 minutes
7. Note your backend URL (e.g., `https://your-app-backend.onrender.com`)

---

### Step 3 — Deploy Frontend on Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Connect GitHub → select your repo
3. Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
4. Add **Environment Variable**:

```
REACT_APP_API_URL = https://shopeasy-backend.onrender.com/api
```

5. Click **Deploy**

---

### Step 4 — Update CORS on Backend

Once you have the Netlify URL, go back to Render → update:

```
APP_CORS_ALLOWED_ORIGINS = https://shopeasy-xyz.netlify.app
```

Redeploy the backend. Done! 🎉

---

## 🔐 Default Login

| Role     | Email                 | Password    |
| -------- | --------------------- | ----------- |
| Admin    | admin@shopeasy.com    | admin123    |
| Customer | Register at /register | your choice |

---

## 📡 API Reference

All responses:

```json
{ "success": true, "message": "...", "data": {} }
```

### Auth (Public)

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register new customer |
| POST   | `/api/auth/login`    | Login, get JWT token  |

### Products (Public GET, Admin POST/PUT/DELETE)

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| GET    | `/api/products`            | All products (?keyword= &category=) |
| GET    | `/api/products/{id}`       | Single product                      |
| GET    | `/api/products/categories` | All categories                      |
| POST   | `/api/products`            | Create product (Admin)              |
| PUT    | `/api/products/{id}`       | Update product (Admin)              |
| DELETE | `/api/products/{id}`       | Delete product (Admin)              |

### Cart (Auth required)

| Method | Endpoint                           | Description     |
| ------ | ---------------------------------- | --------------- |
| GET    | `/api/cart`                        | View cart       |
| POST   | `/api/cart/add`                    | Add item        |
| PUT    | `/api/cart/update/{id}?quantity=N` | Update quantity |
| DELETE | `/api/cart/remove/{id}`            | Remove item     |

### Orders (Auth required)

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| POST   | `/api/orders/place`             | Place order           |
| GET    | `/api/orders/my`                | My orders             |
| PUT    | `/api/orders/admin/{id}/status` | Update status (Admin) |

### Profile (Auth required)

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| GET    | `/api/users/profile` | View profile   |
| PUT    | `/api/users/profile` | Update profile |

---

## 🧪 Unit Tests

```bash
cd backend
mvn test
```

---

_Built with ❤️ as a Java Full Stack Portfolio Project_
