/**
 * App.js - Root component.
 * Sets up React Router with all routes:
 * - Public: /, /login, /register, /products, /products/:id
 * - Customer (requires auth): /cart, /orders, /profile
 * - Admin (requires ROLE_ADMIN): /admin/dashboard, /admin/products
 *
 * AuthProvider wraps everything so auth state is available everywhere.
 * Bootstrap is imported here for global styles.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './routes/ProtectedRoutes';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ProductList from './pages/public/ProductList';
import ProductDetails from './pages/public/ProductDetails';

// Customer Pages
import Cart from './pages/customer/Cart';
import Orders from './pages/customer/Orders';
import Profile from './pages/customer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* All routes use MainLayout (Navbar + Footer) */}
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Customer Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ManageProducts />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
