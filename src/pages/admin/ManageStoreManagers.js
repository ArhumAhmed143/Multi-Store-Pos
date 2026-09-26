import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, UserCheck, UserX } from 'lucide-react';
import { storeManagersAPI, storesAPI } from '../../services/api';

const ManageStoreManagers = () => {
  const [managers, setManagers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    storeLimit: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [managersData, storesData] = await Promise.all([
        storeManagersAPI.getAll(),
        storesAPI.getAll()
      ]);
      setManagers(managersData);
      setStores(storesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingManager(null);
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      storeLimit: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (manager) => {
    setEditingManager(manager);
    setFormData({
      username: manager.username || manager.name,
      email: manager.email,
      phone: manager.phone,
      password: '',
      storeLimit: manager.store_limit ?? '',
      status: manager.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      await storeManagersAPI.delete(id);
      fetchData();
    }
  };

  const validateForm = () => {
    const errors = {};
    const username = (formData.username || '').trim();
    const email = (formData.email || '').trim();
    const phone = (formData.phone || '').trim();
    const password = formData.password || '';
    const storeLimit = formData.storeLimit === undefined || formData.storeLimit === null ? '' : String(formData.storeLimit);
    
    // Username validation - Instagram style: letters, numbers, periods, underscores only
    if (!username) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, periods, and underscores';
    } else if (/^[._]/.test(username) || /[._]$/.test(username)) {
      errors.username = 'Username cannot start or end with a period or underscore';
    }
    
    // Email validation - requires @ symbol and proper format
    if (!email) {
      errors.email = 'Email is required';
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (!phone) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    
    // Password validation
    if (!editingManager && !password) {
      errors.password = 'Password is required';
    } else if (password && password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (storeLimit !== '' && !/^[0-9]+$/.test(storeLimit)) {
      errors.storeLimit = 'Store limit must be a valid number';
    } else if (storeLimit !== '' && Number(storeLimit) < 0) {
      errors.storeLimit = 'Store limit cannot be negative';
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
      if (editingManager) {
        await storeManagersAPI.update(editingManager.id, formData);
      } else {
        await storeManagersAPI.add(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving manager:', error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || 'Unknown';
  };

  const filteredManagers = managers.filter(manager =>
    (manager.username || manager.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="manage-managers">
      <div className="page-header">
        <h1>Manage Store Managers</h1>
        <p>Add, edit, or remove store managers from the system.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box" style={{ marginBottom: 0, width: '300px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search managers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            Add Manager
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Limit</th>
                <th>Stores</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <p>No managers found</p>
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => (
                  <tr key={manager.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar-small">
                          {(manager.username || manager.name).charAt(0)}
                        </div>
                        {manager.username || manager.name}
                      </div>
                    </td>
                    <td>{manager.email}</td>
                    <td>{manager.phone || '-'}</td>
                    <td>{manager.store_limit === null || manager.store_limit === undefined ? 'Unlimited' : manager.store_limit}</td>
                    <td>{stores.filter(store => store.manager_id === manager.id).length}</td>
                    <td>Manager</td>
                    <td>
                      <span className={`badge ${manager.status !== 'inactive' ? 'badge-success' : 'badge-danger'}`}>
                        {manager.status !== 'inactive' ? (
                          <><UserCheck size={12} /> Active</>
                        ) : (
                          <><UserX size={12} /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary btn-icon" onClick={() => handleEdit(manager)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={() => handleDelete(manager.id)}>
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
              <h2>{editingManager ? 'Edit Manager' : 'Add New Manager'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    if (validationErrors.username) {
                      setValidationErrors({ ...validationErrors, username: '' });
                    }
                  }}
                  className={validationErrors.username ? 'error' : ''}
                />
                {validationErrors.username && (
                  <span className="error-message">{validationErrors.username}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (validationErrors.email) {
                        setValidationErrors({ ...validationErrors, email: '' });
                      }
                    }}
                    className={validationErrors.email ? 'error' : ''}
                  />
                  {validationErrors.email && (
                    <span className="error-message">{validationErrors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (validationErrors.phone) {
                        setValidationErrors({ ...validationErrors, phone: '' });
                      }
                    }}
                    className={validationErrors.phone ? 'error' : ''}
                  />
                  {validationErrors.phone && (
                    <span className="error-message">{validationErrors.phone}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Store Limit</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter store limit (leave blank for unlimited)"
                    value={formData.storeLimit}
                    onChange={(e) => {
                      setFormData({ ...formData, storeLimit: e.target.value });
                      if (validationErrors.storeLimit) {
                        setValidationErrors({ ...validationErrors, storeLimit: '' });
                      }
                    }}
                    className={validationErrors.storeLimit ? 'error' : ''}
                  />
                  {validationErrors.storeLimit && (
                    <span className="error-message">{validationErrors.storeLimit}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (validationErrors.password) {
                        setValidationErrors({ ...validationErrors, password: '' });
                      }
                    }}
                    className={validationErrors.password ? 'error' : ''}
                  />
                  {validationErrors.password && (
                    <span className="error-message">{validationErrors.password}</span>
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
                  {editingManager ? 'Update' : 'Add'} Manager
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
        .avatar-small {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};

export default ManageStoreManagers;
