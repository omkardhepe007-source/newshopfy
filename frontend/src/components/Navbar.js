/**
 * Navbar.js - Top navigation bar.
 * Shows different links based on authentication state and role.
 * - Guest: Home, Products, Login, Register
 * - Customer: + Cart, Orders, Profile, Logout
 * - Admin: + Dashboard, Manage Products
 *
 * Uses Bootstrap 5 navbar with responsive collapse for mobile.
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-bag-heart-fill me-2"></i>ShopEasy
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse align-items-center"
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="bi bi-grid me-1"></i>Products
              </Link>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/products">
                    <i className="bi bi-box-seam me-1"></i>Manage Products
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav align-items-center">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-light btn-sm ms-2 px-3"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {!isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      <i className="bi bi-cart3 me-1"></i>Cart
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    <i className="bi bi-bag-check me-1"></i>Orders
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link p-0"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.fullName?.split(" ")[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>My Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
