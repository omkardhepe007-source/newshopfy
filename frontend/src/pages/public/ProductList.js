/**
 * ProductList.js - Main product catalog page.
 * Features: keyword search, category filter, responsive product grid.
 * URL params (?keyword=&category=) sync with filter state so the
 * URL is shareable/bookmarkable.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services';
import ProductCard from '../../components/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';

  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    productService.getCategories()
      .then(res => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    productService.getAll(keyword, category)
      .then(res => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ keyword: searchInput, category });
  };

  const handleCategoryFilter = (cat) => {
    setSearchParams({ keyword, category: cat });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="py-4">
      {/* Page header */}
      <div className="py-4 mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container text-white text-center">
          <h1 className="fw-bold mb-2">All Products</h1>
          <p className="mb-0 text-white-75">Discover {products.length}+ amazing products</p>
        </div>
      </div>

      <div className="container">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group input-group-lg shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              className="form-control border-0 py-3"
              placeholder="Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button className="btn text-white" type="submit"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <i className="bi bi-search me-1"></i>Search
            </button>
          </div>
        </form>

        <div className="row g-4">
          {/* Sidebar filters */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 sticky-top" style={{ top: '80px' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">
                    <i className="bi bi-funnel me-2" style={{ color: '#667eea' }}></i>Filters
                  </h6>
                  {(keyword || category) && (
                    <button className="btn btn-link btn-sm text-danger p-0" onClick={clearFilters}>
                      Clear all
                    </button>
                  )}
                </div>

                <h6 className="text-muted small text-uppercase fw-semibold mb-2">Category</h6>
                <div className="d-flex flex-column gap-1">
                  <button
                    className={`btn btn-sm text-start ${!category ? 'text-white' : 'btn-outline-secondary'}`}
                    style={!category ? { background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' } : {}}
                    onClick={() => handleCategoryFilter('')}>
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`btn btn-sm text-start ${category === cat ? 'text-white' : 'btn-outline-secondary'}`}
                      style={category === cat ? { background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' } : {}}
                      onClick={() => handleCategoryFilter(cat)}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Active filters display */}
            {(keyword || category) && (
              <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
                <small className="text-muted">Active filters:</small>
                {keyword && (
                  <span className="badge rounded-pill py-2 px-3"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    "{keyword}"
                    <button className="btn-close btn-close-white ms-2" style={{ fontSize: '0.5rem' }}
                      onClick={() => setSearchParams({ category })}></button>
                  </span>
                )}
                {category && (
                  <span className="badge rounded-pill py-2 px-3"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    {category}
                    <button className="btn-close btn-close-white ms-2" style={{ fontSize: '0.5rem' }}
                      onClick={() => setSearchParams({ keyword })}></button>
                  </span>
                )}
                <small className="text-muted">{products.length} result(s)</small>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3 text-muted">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                <h5 className="text-muted">No products found</h5>
                <p className="text-muted small">Try different keywords or remove filters.</p>
                <button className="btn btn-outline-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {products.map(product => (
                  <div key={product.id} className="col-sm-6 col-xl-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
