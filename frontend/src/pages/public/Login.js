/**
 * Login.js - Login form page.
 * On success: stores JWT + user info via AuthContext.login(),
 * then redirects admin to /admin/dashboard, customers to /products.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(form);
      const userData = res.data.data;
      login(userData);
      navigate(userData.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5"
      style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-bag-heart-fill fs-1" style={{ color: '#667eea' }}></i>
                  </div>
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted small">Sign in to your ShopEasy account</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible py-2 small" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                    <button type="button" className="btn-close btn-sm" onClick={() => setError('')}></button>
                  </div>
                )}

                {/* Quick demo credentials */}
                <div className="alert alert-info py-2 mb-3 small">
                  <strong>Demo:</strong> admin@shopeasy.com / admin123
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control border-start-0 ps-0"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 fw-semibold py-2 text-white"
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                      : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                    }
                  </button>
                </form>

                <hr className="my-4" />
                <p className="text-center text-muted small mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#667eea' }}>
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
