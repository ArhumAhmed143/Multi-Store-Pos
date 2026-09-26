import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Package, AlertTriangle, DollarSign, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI, stockAPI, notificationsAPI } from '../../services/api';

const CashierDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayOrders: 0,
    todaySales: 0,
    lowStock: 0,
    notifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel with caching
        const [orders, lowStock, notifications] = await Promise.all([
          ordersAPI.getAll(),
          stockAPI.getLowStockAlerts(user?.storeId),
          notificationsAPI.getUnreadCount(user?.storeId)
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => o.created_at?.split('T')[0] === today);
        const todaySales = todayOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

        setStats({
          todayOrders: todayOrders.length,
          todaySales: todaySales,
          lowStock: lowStock.length,
          notifications: notifications
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.storeId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Cashier Dashboard</h1>
        <p>Welcome back, {user?.name}! Ready to serve customers.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <ShoppingCart size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Today's Orders</div>
            <div className="stat-value">{stats.todayOrders}</div>
            <div className="stat-change positive">Orders processed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Today's Sales</div>
            <div className="stat-value">${stats.todaySales.toFixed(2)}</div>
            <div className="stat-change positive">Revenue generated</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-value">{stats.lowStock}</div>
            <div className="stat-change negative">Items need attention</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Bell size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Notifications</div>
            <div className="stat-value">{stats.notifications}</div>
            <div className="stat-change">Unread alerts</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/cashier/search" className="quick-action-btn">
            <Search size={24} />
            <span>Search Product</span>
          </Link>
          <Link to="/cashier/orders" className="quick-action-btn">
            <ShoppingCart size={24} />
            <span>Manage Orders</span>
          </Link>
          <Link to="/cashier/stock" className="quick-action-btn">
            <Package size={24} />
            <span>View Stock</span>
          </Link>
          <Link to="/cashier/reports" className="quick-action-btn">
            <DollarSign size={24} />
            <span>View Reports</span>
          </Link>
        </div>
      </div>

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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .quick-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: #f9fafb;
          border-radius: 12px;
          text-decoration: none;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s;
        }
        .quick-action-btn:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default CashierDashboard;
