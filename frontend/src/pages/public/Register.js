/**
 * Register.js - New user registration form.
 * Validates password match client-side before submitting.
 * On success: redirects to /login with a success message.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    mobileNumber: '', address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      await authService.register(submitData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const apiError = err.response?.data;
      if (apiError?.data) {
        const msgs = Object.values(apiError.data).join(', ');
        setError(msgs);
      } else {
        setError(apiError?.message || 'Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5"
      style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <i className="bi bi-bag-heart-fill fs-1 mb-2 d-block" style={{ color: '#667eea' }}></i>
                  <h2 className="fw-bold">Create Account</h2>
                  <p className="text-muted small">Join ShopEasy and start shopping today</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2 small">
                    <i className="bi bi-check-circle me-2"></i>{success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Full Name *</label>
                      <input type="text" name="fullName" className="form-control"
                        placeholder="John Doe" value={form.fullName}
                        onChange={handleChange} required />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Email Address *</label>
                      <input type="email" name="email" className="form-control"
                        placeholder="you@example.com" value={form.email}
                        onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Password *</label>
                      <input type="password" name="password" className="form-control"
                        placeholder="Min. 6 characters" value={form.password}
                        onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Confirm Password *</label>
                      <input type="password" name="confirmPassword" className="form-control"
                        placeholder="Re-enter password" value={form.confirmPassword}
                        onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Mobile Number</label>
                      <input type="tel" name="mobileNumber" className="form-control"
                        placeholder="+91 98765 43210" value={form.mobileNumber}
                        onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Address</label>
                      <input type="text" name="address" className="form-control"
                        placeholder="City, State" value={form.address}
                        onChange={handleChange} />
                    </div>

                    <div className="col-12">
                      <button type="submit"
                        className="btn w-100 fw-semibold py-2 text-white"
                        disabled={loading}
                        style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
                        {loading
                          ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                          : <><i className="bi bi-person-plus me-2"></i>Create Account</>
                        }
                      </button>
                    </div>
                  </div>
                </form>

                <hr className="my-4" />
                <p className="text-center text-muted small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#667eea' }}>
                    Sign in
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

export default Register;
