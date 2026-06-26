/**
 * Orders.js - Customer's order history page.
 * Shows a list of all orders with status badge and item summary.
 * Expandable accordion shows full order item details.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services';

const statusColors = {
  PENDING:   { bg: 'bg-warning-subtle', text: 'text-warning', icon: 'bi-clock' },
  CONFIRMED: { bg: 'bg-info-subtle',    text: 'text-info',    icon: 'bi-check-circle' },
  SHIPPED:   { bg: 'bg-primary-subtle', text: 'text-primary', icon: 'bi-truck' },
  DELIVERED: { bg: 'bg-success-subtle', text: 'text-success', icon: 'bi-bag-check' },
  CANCELLED: { bg: 'bg-danger-subtle',  text: 'text-danger',  icon: 'bi-x-circle' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    orderService.getMyOrders()
      .then(res => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="text-center py-5 mt-5">
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-bag-check me-2" style={{ color: '#667eea' }}></i>
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bag-x display-1 text-muted mb-4 d-block"></i>
          <h4 className="text-muted">No orders yet</h4>
          <p className="text-muted mb-4">Start shopping and your orders will appear here.</p>
          <Link to="/products" className="btn text-white px-5"
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
            <i className="bi bi-grid me-2"></i>Shop Now
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map(order => {
            const status = statusColors[order.status] || statusColors.PENDING;
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} className="card border-0 shadow-sm rounded-3">
                <div
                  className="card-body p-4"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  <div className="row align-items-center g-3">
                    <div className="col-md-3">
                      <div className="text-muted small">Order ID</div>
                      <div className="fw-bold">#SE{String(order.id).padStart(5, '0')}</div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-muted small">Date</div>
                      <div className="fw-semibold">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="text-muted small">Total</div>
                      <div className="fw-bold" style={{ color: '#667eea' }}>
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <span className={`badge ${status.bg} ${status.text} px-3 py-2`}>
                        <i className={`bi ${status.icon} me-1`}></i>
                        {order.status}
                      </span>
                    </div>
                    <div className="col-md-2 text-end">
                      <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} text-muted`}></i>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-top px-4 pb-4 pt-3">
                    <h6 className="fw-semibold mb-3 text-muted small text-uppercase">Order Items</h6>
                    {order.orderItems?.map(item => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="fw-semibold">{item.productName}</div>
                          <small className="text-muted">
                            ₹{item.productPrice?.toLocaleString('en-IN')} × {item.quantity}
                          </small>
                        </div>
                        <div className="fw-bold">₹{item.subtotal?.toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                    {order.shippingAddress && (
                      <div className="mt-3 small text-muted">
                        <i className="bi bi-geo-alt me-1"></i>
                        <strong>Shipping:</strong> {order.shippingAddress}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
