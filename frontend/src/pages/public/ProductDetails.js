/**
 * ProductDetails.js - Detailed view of a single product.
 * Shows full description, price, stock status, quantity selector, add to cart.
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService, cartService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartMsg, setCartMsg] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    productService.getById(id)
      .then(res => setProduct(res.data.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setCartLoading(true);
    try {
      await cartService.addToCart({ productId: product.id, quantity });
      setCartMsg('success');
    } catch (err) {
      setCartMsg('error:' + (err.response?.data?.message || 'Could not add to cart'));
    } finally {
      setCartLoading(false);
      setTimeout(() => setCartMsg(''), 3000);
    }
  };

  if (loading) return (
    <div className="text-center py-5 mt-5">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  if (!product) return null;

  const placeholderImg = `https://picsum.photos/seed/${product.id}/600/450`;

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item"><Link to={`/products?category=${product.category}`}>{product.category}</Link></li>
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }}>{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Product Image */}
        <div className="col-md-5">
          <div className="rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '420px' }}>
            <img
              src={product.imageUrl || placeholderImg}
              alt={product.name}
              className="w-100"
              style={{ objectFit: 'cover', maxHeight: '420px' }}
              onError={e => { e.target.src = placeholderImg; }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-7">
          <span className="badge mb-2 px-3 py-2"
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', fontSize: '0.75rem' }}>
            {product.category}
          </span>
          <h1 className="fw-bold mb-3">{product.name}</h1>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="fs-2 fw-bold" style={{ color: '#667eea' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            <span className={`badge fs-6 ${product.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          {product.description && (
            <div className="mb-4">
              <h6 className="fw-semibold text-muted text-uppercase small mb-2">Description</h6>
              <p className="text-muted lh-lg">{product.description}</p>
            </div>
          )}

          <hr />

          {/* Cart alerts */}
          {cartMsg === 'success' && (
            <div className="alert alert-success py-2 small mb-3">
              <i className="bi bi-check-circle me-2"></i>Added to cart!{' '}
              <Link to="/cart" className="alert-link">View cart</Link>
            </div>
          )}
          {cartMsg.startsWith('error:') && (
            <div className="alert alert-danger py-2 small mb-3">
              <i className="bi bi-exclamation-circle me-2"></i>{cartMsg.replace('error:', '')}
            </div>
          )}

          {!isAdmin && product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="d-flex align-items-center border rounded-3 overflow-hidden">
                <button className="btn btn-light border-0 px-3 py-2"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <i className="bi bi-dash"></i>
                </button>
                <span className="px-3 fw-semibold">{quantity}</span>
                <button className="btn btn-light border-0 px-3 py-2"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              <button
                className="btn btn-lg text-white flex-grow-1 fw-semibold"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
                onClick={handleAddToCart}
                disabled={cartLoading}>
                {cartLoading
                  ? <span className="spinner-border spinner-border-sm me-2" />
                  : <i className="bi bi-cart-plus me-2"></i>
                }
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <p className="text-muted small">
              <Link to="/login" style={{ color: '#667eea' }}>Login</Link> to add items to your cart.
            </p>
          )}

          <div className="row g-2 mt-2">
            {[
              { icon: 'bi-truck', text: 'Free delivery on orders above ₹999' },
              { icon: 'bi-shield-check', text: 'Secure & encrypted payments' },
              { icon: 'bi-arrow-counterclockwise', text: '30-day easy returns' },
            ].map((item, i) => (
              <div key={i} className="col-12">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className={`bi ${item.icon}`} style={{ color: '#667eea' }}></i>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
