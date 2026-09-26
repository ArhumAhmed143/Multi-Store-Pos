import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, Building2 } from 'lucide-react';
import { productsAPI, storesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SearchProduct = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [otherBranchResults, setOtherBranchResults] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchOtherBranch, setSearchOtherBranch] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      const storesData = await storesAPI.getAll();
      setStores(storesData);
    };
    fetchStores();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      // Search in current store
      const results = await productsAPI.search(searchQuery, user?.storeId);
      setSearchResults(results);

      // If searching other branches
      if (searchOtherBranch) {
        const otherResults = await productsAPI.searchFromOtherBranch(searchQuery, user?.storeId);
        setOtherBranchResults(otherResults);
      } else {
        setOtherBranchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || 'Unknown';
  };

  return (
    <div className="search-product">
      <div className="page-header">
        <h1>Search Product</h1>
        <p>Find products in your store or other branches.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={searchOtherBranch}
              onChange={(e) => setSearchOtherBranch(e.target.checked)}
            />
            <span>Search from other branches</span>
          </label>
        </form>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {searched && !loading && (
        <>
          {/* Current Store Results */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2>
                <Building2 size={20} />
                Results from Your Store
              </h2>
              <span className="results-count">{searchResults.length} items found</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <h3>No products found</h3>
                <p>Try a different search term or check other branches.</p>
              </div>
            ) : (
              <div className="products-grid">
                {searchResults.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-icon">
                      <Package size={24} />
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <span className="category">{product.category}</span>
                      <div className="product-meta">
                        <span className="price">${parseFloat(product.price || 0).toFixed(2)}</span>
                        <span className={`stock ${product.stock <= product.minStock ? 'low' : ''}`}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                    {product.stock <= product.minStock && (
                      <span className="badge badge-danger">Low Stock</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Branch Results */}
          {searchOtherBranch && otherBranchResults.length > 0 && (
            <div className="card" style={{ marginTop: '24px' }}>
              <div className="card-header">
                <h2>
                  <MapPin size={20} />
                  Results from Other Branches
                </h2>
                <span className="results-count">{otherBranchResults.length} items found</span>
              </div>

              <div className="products-grid">
                {otherBranchResults.map((product) => (
                  <div key={product.id} className="product-card other-branch">
                    <div className="product-icon">
                      <Package size={24} />
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <span className="category">{product.category}</span>
                      <div className="product-meta">
                        <span className="price">${parseFloat(product.price || 0).toFixed(2)}</span>
                        <span className="stock">{product.stock} in stock</span>
                      </div>
                      <span className="store-name">
                        <MapPin size={12} />
                        {getStoreName(product.storeId)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .search-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          color: #9ca3af;
        }
        .search-input {
          flex: 1;
          padding: 14px 16px 14px 48px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: #4b5563;
        }
        .checkbox-label input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          padding: 40px;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .card-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .results-count {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .product-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          position: relative;
          transition: all 0.2s;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .product-card.other-branch {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
        }
        .product-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .product-details {
          flex: 1;
        }
        .product-details h3 {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
        }
        .category {
          font-size: 12px;
          color: #6b7280;
        }
        .product-meta {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        .price {
          font-weight: 700;
          color: #059669;
        }
        .stock {
          color: #6b7280;
          font-size: 13px;
        }
        .stock.low {
          color: #dc2626;
        }
        .store-name {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          font-size: 12px;
          color: #0ea5e9;
        }
        .product-card .badge {
          position: absolute;
          top: 12px;
          right: 12px;
        }
      `}</style>
    </div>
  );
};

export default SearchProduct;
