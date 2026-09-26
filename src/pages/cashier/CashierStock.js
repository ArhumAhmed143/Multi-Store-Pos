import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, ArrowRightLeft, Search } from 'lucide-react';
import { productsAPI, storesAPI, stockAPI } from '../../services/api';

const CashierStock = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    productId: '',
    fromStoreId: '',
    toStoreId: '',
    quantity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel with caching
      const [productsData, storesData, lowStockData] = await Promise.all([
        productsAPI.getAll(),
        storesAPI.getAll(),
        stockAPI.getLowStockAlerts()
      ]);
      setProducts(productsData);
      setStores(storesData);
      setLowStockItems(lowStockData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = (product) => {
    setTransferData({
      productId: product.id,
      fromStoreId: product.storeId,
      toStoreId: stores.find(s => s.id !== product.storeId)?.id || '',
      quantity: ''
    });
    setShowTransferModal(true);
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    try {
      await productsAPI.transferStock(
        transferData.productId,
        parseInt(transferData.fromStoreId),
        parseInt(transferData.toStoreId),
        parseInt(transferData.quantity)
      );
      setShowTransferModal(false);
      fetchData();
    } catch (error) {
      console.error('Error transferring stock:', error);
    }
  };

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || 'Unknown';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="view-stock">
      <div className="page-header">
        <h1>View Stock</h1>
        <p>Monitor inventory levels and request stock transfers.</p>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="alert-card">
          <div className="alert-header">
            <AlertTriangle size={24} />
            <h3>Low Stock Alerts</h3>
          </div>
          <div className="alert-items">
            {lowStockItems.map((item) => (
              <div key={item.id} className="alert-item">
                <span className="item-name">{item.name}</span>
                <span className="item-stock">{item.stock} left (Min: {item.minStock})</span>
                <span className="item-store">{getStoreName(item.storeId)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="search-box" style={{ marginBottom: 0, width: '300px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Store</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <Package size={48} />
                    <h3>No products found</h3>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="product-icon">
                          <Package size={18} />
                        </div>
                        {product.name}
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td className={product.stock <= product.minStock ? 'stock-low' : 'stock-ok'}>
                      {product.stock}
                    </td>
                    <td>{product.minStock}</td>
                    <td>{getStoreName(product.storeId)}</td>
                    <td>
                      {product.stock <= product.minStock ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleTransfer(product)}
                        disabled={product.stock === 0}
                      >
                        <ArrowRightLeft size={14} />
                        Transfer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showTransferModal && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transfer Stock Between Stores</h2>
              <button className="modal-close" onClick={() => setShowTransferModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={submitTransfer}>
              <div className="form-group">
                <label>From Store</label>
                <select
                  value={transferData.fromStoreId}
                  onChange={(e) => setTransferData({ ...transferData, fromStoreId: e.target.value })}
                  required
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>To Store</label>
                <select
                  value={transferData.toStoreId}
                  onChange={(e) => setTransferData({ ...transferData, toStoreId: e.target.value })}
                  required
                >
                  {stores.filter(s => s.id !== parseInt(transferData.fromStoreId)).map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={transferData.quantity}
                  onChange={(e) => setTransferData({ ...transferData, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <ArrowRightLeft size={18} />
                  Transfer Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
        .loading-spinner.large {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .alert-card {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .alert-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #d97706;
          margin-bottom: 16px;
        }
        .alert-header h3 {
          margin: 0;
          font-size: 18px;
        }
        .alert-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .alert-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: white;
          border-radius: 8px;
        }
        .item-name {
          font-weight: 600;
          color: #1f2937;
        }
        .item-stock {
          color: #dc2626;
          font-weight: 500;
        }
        .item-store {
          color: #6b7280;
          font-size: 13px;
        }
        .product-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .stock-low {
          color: #dc2626;
          font-weight: 600;
        }
        .stock-ok {
          color: #059669;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CashierStock;
