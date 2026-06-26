/**
 * services/index.js - Centralizes all API call functions.
 * Each function maps to one backend endpoint.
 * Components import from here instead of calling axios directly.
 */
import api from './api';

// =====================
// AUTH SERVICES
// =====================
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// =====================
// PRODUCT SERVICES
// =====================
export const productService = {
  getAll: (keyword = '', category = '') =>
    api.get(`/products?keyword=${keyword}&category=${category}`),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getAllAdmin: () => api.get('/products/admin/all'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// =====================
// CART SERVICES
// =====================
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateItem: (cartItemId, quantity) =>
    api.put(`/cart/update/${cartItemId}?quantity=${quantity}`),
  removeItem: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
};

// =====================
// ORDER SERVICES
// =====================
export const orderService = {
  placeOrder: (data = {}) => api.post('/orders/place', data),
  getMyOrders: () => api.get('/orders/my'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrders: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) =>
    api.put(`/orders/admin/${id}/status?status=${status}`),
};

// =====================
// USER SERVICES
// =====================
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users/admin/all'),
};
