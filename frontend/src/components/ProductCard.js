/**
 * ProductCard.js - Reusable Bootstrap card for displaying a product.
 * Used in the product grid on ProductList and Home pages.
 * Shows image, name, category, price, stock status, and action buttons.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services';

const ProductCard = ({ product, onCartUpdate }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await cartService.addToCart({ productId: product.id, quantity: 1 });
      if (onCartUpdate) onCartUpdate();
      // Simple toast-style feedback via alert (use react-toastify in production)
      const btn = e.target;
      btn.textContent = '✓ Added!';
      btn.classList.replace('btn-primary', 'btn-success');
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.replace('btn-success', 'btn-primary');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  const placeholderImg = `https://picsum.photos/seed/${product.id}/400/300`;

  return (
    <div className="card h-100 border-0 shadow-sm product-card"
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
        <img
          src={product.imageUrl || placeholderImg}
          alt={product.name}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
          onError={e => { e.target.src = placeholderImg; }}
        />
        <span className="badge position-absolute top-0 end-0 m-2"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
          {product.category}
        </span>
        {product.stock === 0 && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            <span className="badge bg-danger fs-6">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-semibold text-truncate mb-1">{product.name}</h6>
        <p className="text-muted small mb-2" style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.description}
        </p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold fs-5" style={{ color: '#667eea' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            <small className={`badge ${product.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}
            </small>
          </div>
          {!isAdmin && (
            <button
              className="btn btn-primary btn-sm w-100"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
              <i className="bi bi-cart-plus me-1"></i>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
