/**
 * ProtectedRoutes.js - Route guard components.
 *
 * PrivateRoute: Redirects to /login if user is not authenticated.
 * AdminRoute: Redirects to / if user is not an admin.
 *
 * Usage in App.js:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/cart" element={<Cart />} />
 *   </Route>
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin/dashboard" element={<Dashboard />} />
 *   </Route>
 */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};
