import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { cashiersAPI, authAPI } from '../../services/api';

const ManageCashiers = () => {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCashier, setEditingCashier] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setCurrentUser(authAPI.getStoredUser());
    fetchCashiers();
  }, []);

  const fetchCashiers = async () => {
    setLoading(true);
    try {
      const data = await cashiersAPI.getAll();
      setCashiers(data);
    } catch (error) {
      console.error('Error fetching cashiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const cashierLimit = currentUser?.store_limit;
  const canAddCashier = cashierLimit === undefined || cashierLimit === null || cashiers.length < cashierLimit;

  const handleAdd = () => {
    if (!canAddCashier) {
      setErrorMessage(`Cashier limit reached. Remove one cashier or ask admin/manager to increase your limit.`);
      return;
    }

    setEditingCashier(null);
    setFormData({ name: '', email: '', password: '' });
    setValidationErrors({});
    setErrorMessage('');
    setShowModal(true);
  };

  const handleEdit = (cashier) => {
    setEditingCashier(cashier);
    setFormData({ name: cashier.name, email: cashier.email, password: '' });
    setValidationErrors({});
    setErrorMessage('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cashier?')) {
      const result = await cashiersAPI.delete(id);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to delete cashier');
        return;
      }
      fetchCashiers();
    }
  };

  const validateForm = () => {
    const errors = {};
    const name = (formData.name || '').trim();
    const email = (formData.email || '').trim();
    const password = formData.password || '';

    if (!name) {
      errors.name = 'Name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!editingCashier && !password) {
      errors.password = 'Password is required';
    }
    if (password.length > 0 && password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
    setErrorMessage('');

    try {
      let result;
      if (editingCashier) {
        result = await cashiersAPI.update(editingCashier.id, formData);
      } else {
        result = await cashiersAPI.add(formData);
      }

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to save cashier');
        return;
      }

      setShowModal(false);
      fetchCashiers();
    } catch (error) {
      console.error('Error saving cashier:', error);
      setErrorMessage('Unable to save cashier. Please try again.');
    }
  };

  const filteredCashiers = cashiers.filter((cashier) =>
    cashier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cashier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="manage-cashiers">
      <div className="page-header">
        <h1>Manage Cashiers</h1>
        <p>Create login accounts for cashiers and manage their access.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box" style={{ marginBottom: 0, width: '300px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search cashiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleAdd} disabled={!canAddCashier}>
              <Plus size={18} />
              Add Cashier
            </button>
            {cashierLimit !== undefined && cashierLimit !== null && (
              <div className="limit-note" style={{ marginTop: '8px', fontSize: '0.95rem', color: '#555' }}>
                {`Cashiers: ${cashiers.length} / ${cashierLimit}`}
              </div>
            )}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCashiers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-state">
                    <p>No cashiers found</p>
                  </td>
                </tr>
              ) : (
                filteredCashiers.map((cashier) => (
                  <tr key={cashier.id}>
                    <td>{cashier.name}</td>
                    <td>{cashier.email}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary btn-icon" onClick={() => handleEdit(cashier)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={() => handleDelete(cashier.id)}>
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
              <h2>{editingCashier ? 'Edit Cashier' : 'Add New Cashier'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={validationErrors.name ? 'error' : ''}
                />
                {validationErrors.name && <span className="error-message">{validationErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={validationErrors.email ? 'error' : ''}
                />
                {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder={editingCashier ? 'Leave blank to keep current password' : 'Enter password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={validationErrors.password ? 'error' : ''}
                />
                {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
              </div>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCashier ? 'Update' : 'Add'} Cashier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCashiers;
