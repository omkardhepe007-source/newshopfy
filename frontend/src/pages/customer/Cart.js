/**
 * Cart.js - Shopping cart page.
 * Shows all cart items with quantity controls, remove buttons, and order total.
 * "Proceed to Checkout" button calls the place order API directly.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService, orderService } from '../../services';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMsg, setOrderMsg] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQuantity = async (cartItemId, newQty) => {
    try {
      const res = await cartService.updateItem(cartItemId, newQty);
      setCart(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      const res = await cartService.removeItem(cartItemId);
      setCart(res.data.data);
    } catch (err) {
      alert('Could not remove item');
    }
  };

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      await orderService.placeOrder({});
      setOrderMsg('success');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setOrderMsg('error:' + (err.response?.data?.message || 'Order failed'));
      setOrderLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5 mt-5">
      <div className="spinner-border text-primary" />
    </div>
  );

  const isEmpty = !cart || cart.items?.length === 0;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-cart3 me-2" style={{ color: '#667eea' }}></i>
        My Cart {!isEmpty && <span className="badge rounded-pill ms-2" style={{ background: '#667eea', fontSize: '0.7rem' }}>{cart.totalItems} items</span>}
      </h2>

      {orderMsg === 'success' && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill me-2"></i>
          Order placed successfully! Redirecting to your orders...
        </div>
      )}
      {orderMsg.startsWith('error:') && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {orderMsg.replace('error:', '')}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x display-1 text-muted mb-4 d-block"></i>
          <h4 className="text-muted">Your cart is empty</h4>
          <p className="text-muted mb-4">Add some products to get started!</p>
          <Link to="/products" className="btn btn-lg text-white px-5"
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
            <i className="bi bi-grid me-2"></i>Browse Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-0">
                {cart.items.map((item, index) => (
                  <div key={item.cartItemId}
                    className={`p-4 d-flex align-items-start gap-3 ${index < cart.items.length - 1 ? 'border-bottom' : ''}`}>
                    <img
                      src={item.productImageUrl || `https://picsum.photos/seed/${item.productId}/80/80`}
                      alt={item.productName}
                      className="rounded-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      onError={e => { e.target.src = `https://picsum.photos/seed/${item.productId}/80/80`; }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{item.productName}</h6>
                      <div className="text-muted small mb-2">
                        Unit price: ₹{item.productPrice?.toLocaleString('en-IN')}
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center border rounded-3 overflow-hidden">
                          <button className="btn btn-light border-0 px-3 py-1"
                            onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}>
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="px-3 fw-semibold">{item.quantity}</span>
                          <button className="btn btn-light border-0 px-3 py-1"
                            onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}>
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <button className="btn btn-link text-danger btn-sm p-0"
                          onClick={() => handleRemove(item.cartItemId)}>
                          <i className="bi bi-trash me-1"></i>Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold fs-5" style={{ color: '#667eea' }}>
                        ₹{item.subtotal?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/products" className="btn btn-outline-secondary mt-3">
              <i className="bi bi-arrow-left me-2"></i>Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 sticky-top" style={{ top: '80px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal ({cart.totalItems} items)</span>
                  <span>₹{cart.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery</span>
                  <span className="text-success fw-semibold">
                    {cart.totalPrice > 999 ? 'FREE' : '₹99'}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                  <span>Total</span>
                  <span style={{ color: '#667eea' }}>
                    ₹{(cart.totalPrice + (cart.totalPrice > 999 ? 0 : 99))?.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  className="btn w-100 fw-semibold py-3 text-white"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}>
                  {orderLoading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                    : <><i className="bi bi-bag-check me-2"></i>Place Order</>
                  }
                </button>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="bi bi-shield-lock me-1"></i>Secure checkout
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
