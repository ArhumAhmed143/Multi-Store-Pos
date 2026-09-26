import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Package } from 'lucide-react';
import { productsAPI, storesAPI } from '../../services/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    storeId: '',
    minStock: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, storesData] = await Promise.all([
        productsAPI.getAll(),
        storesAPI.getAll()
      ]);
      setProducts(productsData);
      setStores(storesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      storeId: stores[0]?.id || '',
      minStock: '10'
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      storeId: product.storeId,
      minStock: product.minStock.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await productsAPI.delete(id);
      fetchData();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Product name validation - letters, numbers, spaces, hyphens, parentheses
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Product name must be at least 2 characters';
    } else if (!/^[a-zA-Z0-9\s\-()&.]+$/.test(formData.name.trim())) {
      errors.name = 'Product name contains invalid characters';
    }
    
    // Category validation
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    // Price validation - positive decimal number
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a valid positive number';
    } else if (parseFloat(formData.price) > 999999.99) {
      errors.price = 'Price is too high';
    }
    
    // Stock quantity validation - non-negative integer
    if (!formData.stock) {
      errors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      errors.stock = 'Stock must be a valid non-negative number';
    } else if (parseInt(formData.stock) > 999999) {
      errors.stock = 'Stock quantity is too high';
    }
    
    // Minimum stock validation - non-negative integer
    if (!formData.minStock) {
      errors.minStock = 'Minimum stock is required';
    } else if (isNaN(parseInt(formData.minStock)) || parseInt(formData.minStock) < 0) {
      errors.minStock = 'Minimum stock must be a valid non-negative number';
    } else if (parseInt(formData.minStock) > 999999) {
      errors.minStock = 'Minimum stock is too high';
    }
    
    // Store validation
    if (!formData.storeId) {
      errors.storeId = 'Store is required';
    }
    
    return errors;;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        storeId: parseInt(formData.storeId),
        minStock: parseInt(formData.minStock)
      };
      
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.add(productData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
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
    <div className="manage-products">
      <div className="page-header">
        <h1>Manage Store Products</h1>
        <p>Add, edit, or remove products from the inventory.</p>
      </div>

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
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            Add Product
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
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
                    <p>Add your first product to get started.</p>
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
                    <td className="price">${parseFloat(product.price || 0).toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>{getStoreName(product.storeId)}</td>
                    <td>
                      {product.stock <= product.minStock ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary btn-icon" onClick={() => handleEdit(product)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: '' });
                    }
                  }}
                  placeholder="Enter product name"
                  className={validationErrors.name ? 'error' : ''}
                />
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (validationErrors.category) {
                        setValidationErrors({ ...validationErrors, category: '' });
                      }
                    }}
                    className={validationErrors.category ? 'error' : ''}
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Services">Services</option>
                  </select>
                  {validationErrors.category && (
                    <span className="error-message">{validationErrors.category}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Store</label>
                  <select
                    value={formData.storeId}
                    onChange={(e) => {
                      setFormData({ ...formData, storeId: e.target.value });
                      if (validationErrors.storeId) {
                        setValidationErrors({ ...validationErrors, storeId: '' });
                      }
                    }}
                    className={validationErrors.storeId ? 'error' : ''}
                  >
                    <option value="">Select a store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.storeId && (
                    <span className="error-message">{validationErrors.storeId}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      if (validationErrors.price) {
                        setValidationErrors({ ...validationErrors, price: '' });
                      }
                    }}
                    placeholder="0.00"
                    className={validationErrors.price ? 'error' : ''}
                  />
                  {validationErrors.price && (
                    <span className="error-message">{validationErrors.price}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => {
                      setFormData({ ...formData, stock: e.target.value });
                      if (validationErrors.stock) {
                        setValidationErrors({ ...validationErrors, stock: '' });
                      }
                    }}
                    placeholder="0"
                    className={validationErrors.stock ? 'error' : ''}
                  />
                  {validationErrors.stock && (
                    <span className="error-message">{validationErrors.stock}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Minimum Stock Level (for alerts)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => {
                    setFormData({ ...formData, minStock: e.target.value });
                    if (validationErrors.minStock) {
                      setValidationErrors({ ...validationErrors, minStock: '' });
                    }
                  }}
                  placeholder="10"
                  className={validationErrors.minStock ? 'error' : ''}
                />
                {validationErrors.minStock && (
                  <span className="error-message">{validationErrors.minStock}</span>
                )}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update' : 'Add'} Product
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
        .price {
          font-weight: 600;
          color: #059669;
        }
      `}</style>
    </div>
  );
};

export default ManageProducts;
