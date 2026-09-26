import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Building2, MapPin } from 'lucide-react';
import { storesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageStores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    status: 'active'
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await storesAPI.getAll();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const isManagerUser = user?.role === 'manager' || user?.role === 'store_manager';
  const managerStores = isManagerUser ? stores.filter(store => store.manager_id === user.id) : [];
  const managerStoreCount = managerStores.length;
  const limitReached = isManagerUser && user?.store_limit !== null && user?.store_limit !== undefined && managerStoreCount >= user.store_limit;
  const displayedStores = isManagerUser ? managerStores : stores;

  const handleAdd = () => {
    if (limitReached) {
      setErrorMessage('Store limit reached. Contact admin to increase your limit.');
      return;
    }
    setErrorMessage('');
    setEditingStore(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      city: store.city,
      status: store.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      await storesAPI.delete(id);
      fetchStores();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Store name validation - only letters, numbers, spaces, and hyphens
    if (!formData.name.trim()) {
      errors.name = 'Store name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Store name must be at least 2 characters';
    } else if (!/^[a-zA-Z0-9\s\-&]+$/.test(formData.name.trim())) {
      errors.name = 'Store name can only contain letters, numbers, spaces, hyphens, and ampersands';
    }
    
    // Address validation - alphanumeric, spaces, commas, periods, hyphens, numbers
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters';
    } else if (!/^[a-zA-Z0-9\s\-.,#&]+$/.test(formData.address.trim())) {
      errors.address = 'Address contains invalid characters';
    }
    
    // City validation - only letters, spaces, hyphens
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      errors.city = 'City must be at least 2 characters';
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.city.trim())) {
      errors.city = 'City can only contain letters, spaces, and hyphens';
    }
    
    return errors;
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
      let result;
      if (editingStore) {
        result = await storesAPI.update(editingStore.id, formData);
      } else {
        result = await storesAPI.add(formData);
      }
      if (!result.success) {
        setErrorMessage(result.error || 'Error saving store');
        return;
      }
      setErrorMessage('');
      setShowModal(false);
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      setErrorMessage('Error saving store. Please try again.');
    }
  };

  const filteredStores = displayedStores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="manage-stores">
      <div className="page-header">
        <h1>Manage Stores</h1>
        <p>Add, edit, or remove stores from the system.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box" style={{ marginBottom: 0, width: '300px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAdd} disabled={limitReached}>
            <Plus size={18} />
            Add Store
          </button>
        </div>
        {limitReached && (
          <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
            Store limit reached ({managerStoreCount}/{user.store_limit}). Contact admin to increase your limit.
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}
        <div className="stores-grid">
          {filteredStores.length === 0 ? (
            <div className="empty-state">
              <Building2 size={48} />
              <h3>No stores found</h3>
              <p>Add your first store to get started.</p>
            </div>
          ) : (
            filteredStores.map((store) => (
              <div key={store.id} className="store-card">
                <div className="store-icon">
                  <Building2 size={24} />
                </div>
                <div className="store-info">
                  <h3>{store.name}</h3>
                  <p className="store-address">
                    <MapPin size={14} />
                    {store.address}, {store.city}
                  </p>
                  <span className={`badge ${store.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {store.status}
                  </span>
                </div>
                <div className="store-actions">
                  <button className="btn btn-secondary btn-icon" onClick={() => handleEdit(store)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-danger btn-icon" onClick={() => handleDelete(store.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStore ? 'Edit Store' : 'Add New Store'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Store Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: '' });
                    }
                  }}
                  placeholder="Enter store name"
                  className={validationErrors.name ? 'error' : ''}
                />
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (validationErrors.address) {
                      setValidationErrors({ ...validationErrors, address: '' });
                    }
                  }}
                  placeholder="Enter store address"
                  className={validationErrors.address ? 'error' : ''}
                />
                {validationErrors.address && (
                  <span className="error-message">{validationErrors.address}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      if (validationErrors.city) {
                        setValidationErrors({ ...validationErrors, city: '' });
                      }
                    }}
                    placeholder="Enter city"
                    className={validationErrors.city ? 'error' : ''}
                  />
                  {validationErrors.city && (
                    <span className="error-message">{validationErrors.city}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStore ? 'Update' : 'Add'} Store
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
        .stores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          padding-top: 10px;
        }
        .store-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: all 0.2s;
        }
        .store-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .store-icon {
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
        .store-info {
          flex: 1;
        }
        .store-info h3 {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        .store-address {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 10px;
          font-size: 13px;
          color: #6b7280;
        }
        .store-actions {
          display: flex;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default ManageStores;
