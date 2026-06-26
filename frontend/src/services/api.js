/**
 * api.js - Axios instance configured for the ShopEasy backend.
 *
 * ⚠️ IMPORTANT FOR DEPLOYMENT:
 * When deploying to Render/Netlify, replace API_BASE_URL with your
 * actual Render backend URL, e.g.:
 *   const API_BASE_URL = 'https://shopeasy-backend.onrender.com/api';
 *
 * For local development:
 *   const API_BASE_URL = 'http://localhost:8080/api';
 *
 * Request interceptor: Automatically attaches JWT token to every request.
 * Response interceptor: Clears auth and redirects on 401.
 */
import axios from 'axios';

// ✅ LOCAL DEVELOPMENT
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// 🚀 FOR PRODUCTION — set REACT_APP_API_URL in Netlify environment variables
// e.g. REACT_APP_API_URL=https://shopeasy-backend.onrender.com/api

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
