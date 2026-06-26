/**
 * Footer.js - Site-wide footer with links and branding.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="text-white mt-auto py-5"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-bag-heart-fill me-2"></i>ShopEasy
            </h5>
            <p className="text-white-50 small">
              Your one-stop destination for quality products at great prices.
              Shop smart, shop easy.
            </p>
          </div>
          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Shop</h6>
            <ul className="list-unstyled small">
              <li className="mb-1">
                <Link
                  to="/products"
                  className="text-white-50 text-decoration-none"
                >
                  All Products
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/products?category=Electronics"
                  className="text-white-50 text-decoration-none"
                >
                  Electronics
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/products?category=Clothing"
                  className="text-white-50 text-decoration-none"
                >
                  Clothing
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Account</h6>
            <ul className="list-unstyled small">
              <li className="mb-1">
                <Link
                  to="/login"
                  className="text-white-50 text-decoration-none"
                >
                  Login
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/register"
                  className="text-white-50 text-decoration-none"
                >
                  Register
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/orders"
                  className="text-white-50 text-decoration-none"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-semibold mb-3">Contact</h6>
            <p className="text-white-50 small mb-1">
              <i className="bi bi-envelope me-2"></i>omkardhepe007@gmail.com
            </p>
            <p className="text-white-50 small mb-1">
              <i className="bi bi-telephone me-2"></i>+91 9322347102
            </p>
            <div className="mt-3">
              
                <a
                  href="https://www.linkedin.com/in/omkar-dhepe-b57a56311"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white-50 me-3 fs-5"
                >
                  <i className="bi bi-linkedin"></i>
                </a>

                <a
                  href="https://www.instagram.com/omkar_dh?igsh=MWx0MTN0dWI4anF0eQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white-50 me-3 fs-5"
                >
                  <i className="bi bi-instagram"></i>
                </a>

                <a
                  href="mailto:omkardhepe007@gmail.com"
                  className="text-white-50 me-3 fs-5"
                >
                  <i className="bi bi-envelope-fill"></i>
                </a>
              
            </div>
          </div>
        </div>
        <hr className="border-secondary mt-4" />
        <div className="text-center text-white-50 small">
          © {new Date().getFullYear()} ShopEasy. Built with React & Spring Boot.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
