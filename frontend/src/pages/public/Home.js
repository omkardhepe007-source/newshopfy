/**
 * Home.js - Landing page.
 * Features: Hero section, featured products grid, category browse section.
 * Featured products are the 4 latest active products from the backend.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services';
import ProductCard from '../../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAll(),
          productService.getCategories(),
        ]);
        setFeaturedProducts(productsRes.data.data.slice(0, 8));
        setCategories(categoriesRes.data.data);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons = {
    Electronics: 'bi-cpu',
    Clothing: 'bi-bag',
    Footwear: 'bi-person-walking',
    Books: 'bi-book',
    Sports: 'bi-trophy',
    'Home & Kitchen': 'bi-house',
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-5 text-white" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '420px'
      }}>
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Shop Everything<br />
                <span style={{ color: '#ffd700' }}>You Love</span>
              </h1>
              <p className="lead mb-4 text-white-75">
                Discover thousands of products at unbeatable prices.
                Fast delivery, easy returns, and 24/7 support.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/products" className="btn btn-warning btn-lg fw-semibold px-4">
                  <i className="bi bi-grid me-2"></i>Shop Now
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  Join Free
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="row g-3">
                {[
                  { icon: 'bi-truck', label: 'Free Delivery', sub: 'On orders over ₹999' },
                  { icon: 'bi-shield-check', label: 'Secure Payment', sub: '100% safe checkout' },
                  { icon: 'bi-arrow-counterclockwise', label: 'Easy Returns', sub: '30-day return policy' },
                  { icon: 'bi-headset', label: '24/7 Support', sub: 'Always here for you' },
                ].map((item, i) => (
                  <div key={i} className="col-6">
                    <div className="p-3 rounded-3 text-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                      <i className={`bi ${item.icon} fs-2 mb-2 d-block`}></i>
                      <div className="fw-semibold small">{item.label}</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="fw-bold text-center mb-4">Shop by Category</h2>
            <div className="row g-3 justify-content-center">
              {categories.map((cat, i) => (
                <div key={i} className="col-6 col-md-3 col-lg-2">
                  <div
                    className="card border-0 shadow-sm text-center p-3 h-100"
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => navigate(`/products?category=${cat}`)}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <i className={`bi ${categoryIcons[cat] || 'bi-tag'} fs-2 mb-2`}
                      style={{ color: '#667eea' }}></i>
                    <div className="fw-semibold small">{cat}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Featured Products</h2>
            <Link to="/products" className="btn btn-outline-primary btn-sm">
              View All <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.map(product => (
                <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-5 text-white text-center" style={{
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
      }}>
        <div className="container">
          <h2 className="fw-bold mb-2">Ready to Start Shopping?</h2>
          <p className="mb-4 text-white-75">Create a free account and get exclusive deals.</p>
          <Link to="/register" className="btn btn-warning btn-lg fw-semibold px-5">
            Get Started Today
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
