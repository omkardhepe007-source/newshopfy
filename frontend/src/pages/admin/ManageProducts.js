/**
 * ManageProducts.js - Admin product CRUD page.
 * Lists all products (including inactive).
 * Modal form for adding/editing products.
 * Soft-delete with confirmation.
 */
import React, { useEffect, useState } from 'react';
import { productService } from '../../services';

const emptyForm = {
  name: '', description: '', category: '', price: '', stock: '', imageUrl: ''
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await productService.getAllAdmin();
      setProducts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
    setMsg('');
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
    });
    setEditingId(product.id);
    setShowModal(true);
    setMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await productService.update(editingId, form);
        setMsg('Product updated successfully!');
      } else {
        await productService.create(form);
        setMsg('Product added successfully!');
      }
      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      const apiErr = err.response?.data;
      if (apiErr?.data) setMsg(Object.values(apiErr.data).join(', '));
      else setMsg(apiErr?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product? It will be hidden from customers.')) return;
    try {
      await productService.delete(id);
      await fetchProducts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Manage Products</h2>
          <p className="text-muted small mb-0">{products.filter(p => p.active).length} active products</p>
        </div>
        <button className="btn text-white fw-semibold"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
          onClick={openAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add New Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4" style={{ maxWidth: '400px' }}>
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input type="text" className="form-control border-start-0"
            placeholder="Search by name or category..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4" style={{ width: '60px' }}>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td className="ps-4">
                      <img
                        src={product.imageUrl || `https://picsum.photos/seed/${product.id}/50/50`}
                        alt={product.name}
                        className="rounded-2"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/50/50`; }}
                      />
                    </td>
                    <td>
                      <div className="fw-semibold">{product.name}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                        {product.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{product.category}</span>
                    </td>
                    <td className="fw-semibold" style={{ color: '#667eea' }}>
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge ${product.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${product.active ? 'bg-success' : 'bg-secondary'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(product)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        {product.active && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                {msg && (
                  <div className={`alert py-2 small ${msg.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                    {msg}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Product Name *</label>
                      <input type="text" className="form-control" value={form.name} required
                        onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Category *</label>
                      <input type="text" className="form-control" value={form.category} required
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        placeholder="e.g. Electronics" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description</label>
                      <textarea className="form-control" rows={3} value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Product description..." />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Price (₹) *</label>
                      <input type="number" className="form-control" value={form.price} required min="0" step="0.01"
                        onChange={e => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Stock *</label>
                      <input type="number" className="form-control" value={form.stock} required min="0"
                        onChange={e => setForm({ ...form, stock: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Image URL</label>
                      <input type="url" className="form-control" value={form.imageUrl}
                        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="https://..." />
                    </div>
                    {form.imageUrl && (
                      <div className="col-12">
                        <img src={form.imageUrl} alt="Preview" className="rounded-3"
                          style={{ height: '100px', objectFit: 'cover' }}
                          onError={e => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button type="submit"
                      className="btn flex-grow-1 text-white fw-semibold py-2"
                      style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
                      disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : (editingId ? 'Update Product' : 'Add Product')}
                    </button>
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
