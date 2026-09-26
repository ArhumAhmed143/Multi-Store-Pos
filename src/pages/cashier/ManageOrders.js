import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, ShoppingCart, Package } from 'lucide-react';
import { ordersAPI, productsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingOrder(null);
    setCart([]);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setCart(order.items.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)
    })));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await ordersAPI.delete(id);
      fetchData();
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        quantity: 1,
        price: product.price,
        product: product
      }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const validateForm = () => {
    const errors = {};
    
    // Cart validation
    if (cart.length === 0) {
      errors.cart = 'Please add at least one item to the order';
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
      const orderData = {
        cashier_id: user?.id,
        items: cart.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: calculateTotal(),
        status: 'completed'
      };

      if (editingOrder) {
        await ordersAPI.update(editingOrder.id, orderData);
      } else {
        await ordersAPI.add(orderData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="manage-orders">
      <div className="page-header">
        <h1>Manage Orders</h1>
        <p>Create, edit, or view customer orders.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box" style={{ marginBottom: 0, width: '300px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            New Order
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Cashier</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <ShoppingCart size={48} />
                    <h3>No orders found</h3>
                    <p>Create your first order to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">#{order.id}</span>
                    </td>
                    <td>{order.cashier?.name || 'Unknown'}</td>
                    <td>{order.items.length} items</td>
                    <td className="price">${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                    <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary btn-icon" onClick={() => handleEdit(order)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={() => handleDelete(order.id)}>
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
          <div className="modal order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOrder ? 'Edit Order' : 'Create New Order'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="order-form-grid">
                <div className="products-section">
                  <h3>Available Products</h3>
                  <div className="products-list">
                    {products.filter(p => p.stock > 0).map((product) => (
                      <div key={product.id} className="product-item" onClick={() => addToCart(product)}>
                        <div className="product-icon-sm">
                          <Package size={16} />
                        </div>
                        <div className="product-info">
                          <span className="name">{product.name}</span>
                          <span className="price">${parseFloat(product.price || 0).toFixed(2)}</span>
                        </div>
                        <button type="button" className="add-btn">+</button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="cart-section">
                  <h3>Order Cart</h3>
                  
                  <div className="cart-items">
                    {cart.length === 0 ? (
                      <p className="empty-cart">No items in cart</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.productId} className="cart-item">
                          <span className="item-name">{item.product?.name}</span>
                          <div className="quantity-controls">
                            <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                          </div>
                          <span className="item-total">${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  {validationErrors.cart && (
                    <span className="error-message">{validationErrors.cart}</span>
                  )}
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOrder ? 'Update Order' : 'Create Order'}
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
        .order-id {
          font-weight: 600;
          color: #667eea;
        }
        .price {
          font-weight: 600;
          color: #059669;
        }
        .order-modal {
          max-width: 800px;
        }
        .order-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .products-section, .cart-section {
          display: flex;
          flex-direction: column;
        }
        .products-section h3, .cart-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px;
        }
        .products-list {
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .product-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f9fafb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .product-item:hover {
          background: #e5e7eb;
        }
        .product-icon-sm {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .product-info .name {
          font-size: 13px;
          font-weight: 500;
        }
        .product-info .price {
          font-size: 12px;
          color: #059669;
        }
        .add-btn {
          width: 28px;
          height: 28px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        .cart-items {
          flex: 1;
          min-height: 150px;
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        .empty-cart {
          text-align: center;
          color: #9ca3af;
          margin: 0;
          padding: 40px 0;
        }
        .cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .item-name {
          flex: 1;
          font-size: 13px;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .quantity-controls button {
          width: 24px;
          height: 24px;
          background: #f3f4f6;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .quantity-controls span {
          min-width: 20px;
          text-align: center;
        }
        .item-total {
          font-weight: 600;
          color: #059669;
          min-width: 60px;
          text-align: right;
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-weight: 600;
        }
        .total-amount {
          color: #059669;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default ManageOrders;
