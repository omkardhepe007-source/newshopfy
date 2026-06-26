/**
 * AdminDashboard.js - Admin overview page.
 * Displays summary stats: total products, orders, users.
 * Shows recent orders table with status update capability.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, orderService, userService } from '../../services';

const statusColors = {
  PENDING:   'bg-warning text-dark',
  CONFIRMED: 'bg-info text-white',
  SHIPPED:   'bg-primary text-white',
  DELIVERED: 'bg-success text-white',
  CANCELLED: 'bg-danger text-white',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          productService.getAllAdmin(),
          orderService.getAllOrders(),
          userService.getAllUsers(),
        ]);
        const products = productsRes.data.data;
        const orders = ordersRes.data.data;
        const users = usersRes.data.data;
        const revenue = orders
          .filter(o => o.status !== 'CANCELLED')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        setStats({
          products: products.filter(p => p.active).length,
          orders: orders.length,
          users: users.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 8));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      setRecentOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );
    } catch (err) {
      alert('Status update failed');
    }
  };

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary" /></div>;

  const statCards = [
    { label: 'Active Products', value: stats.products, icon: 'bi-box-seam', color: '#667eea', link: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: 'bi-bag-check', color: '#764ba2', link: '#orders' },
    { label: 'Registered Users', value: stats.users, icon: 'bi-people', color: '#f093fb', link: '#' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: 'bi-currency-rupee', color: '#4facfe', link: '#' },
  ];

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Admin Dashboard</h2>
          <p className="text-muted small mb-0">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/admin/products" className="btn text-white"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
          <i className="bi bi-plus-lg me-2"></i>Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-5">
        {statCards.map((card, i) => (
          <div key={i} className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small fw-semibold text-uppercase mb-1">{card.label}</div>
                    <div className="fw-bold fs-3">{card.value}</div>
                  </div>
                  <div className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                    style={{ background: card.color + '20', width: '52px', height: '52px' }}>
                    <i className={`bi ${card.icon} fs-4`} style={{ color: card.color }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row g-3 mb-5">
        {[
          { label: 'Manage Products', icon: 'bi-box-seam', link: '/admin/products', desc: 'Add, edit, delete products' },
          { label: 'View All Orders', icon: 'bi-bag-check', link: '#orders', desc: 'Track and update orders' },
          { label: 'Browse Catalog', icon: 'bi-grid', link: '/products', desc: 'See the storefront' },
        ].map((action, i) => (
          <div key={i} className="col-md-4">
            <Link to={action.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm rounded-3 p-3 h-100"
                style={{ transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #667eea20, #764ba220)' }}>
                    <i className={`bi ${action.icon} fs-5`} style={{ color: '#667eea' }}></i>
                  </div>
                  <div>
                    <div className="fw-semibold">{action.label}</div>
                    <div className="text-muted small">{action.desc}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div id="orders">
        <h5 className="fw-bold mb-3">Recent Orders</h5>
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="ps-4 fw-semibold">
                        #SE{String(order.id).padStart(5, '0')}
                      </td>
                      <td className="text-muted small">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="fw-semibold" style={{ color: '#667eea' }}>
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="text-muted small">
                        {order.orderItems?.length} item(s)
                      </td>
                      <td>
                        <span className={`badge ${statusColors[order.status] || 'bg-secondary'} px-2 py-1`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 'auto', minWidth: '130px' }}
                          value={order.status}
                          onChange={e => handleStatusUpdate(order.id, e.target.value)}>
                          {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
