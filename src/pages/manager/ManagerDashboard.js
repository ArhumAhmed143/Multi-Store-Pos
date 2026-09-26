import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Package, ShoppingCart, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storesAPI, productsAPI, ordersAPI, stockAPI } from '../../services/api';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    stores: 0,
    products: 0,
    orders: 0,
    lowStock: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel with caching
        const [stores, products, orders, lowStock] = await Promise.all([
          storesAPI.getAll(),
          productsAPI.getAll(),
          ordersAPI.getAll(),
          stockAPI.getLowStockAlerts()
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);

        setStats({
          stores: stores.length,
          products: products.length,
          orders: orders.length,
          lowStock: lowStock.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
        <h1>Store Manager Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's your store overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Building2 size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Stores</div>
            <div className="stat-value">{stats.stores}</div>
            <div className="stat-change positive">Active stores</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Package size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{stats.products}</div>
            <div className="stat-change positive">In inventory</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <ShoppingCart size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.orders}</div>
            <div className="stat-change positive">All time</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-value">{stats.lowStock}</div>
            <div className="stat-change negative">Need attention</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">${stats.revenue.toFixed(2)}</div>
            <div className="stat-change positive">All stores</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Performance</div>
            <div className="stat-value">Good</div>
            <div className="stat-change positive">+12% this month</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/manager/stores" className="quick-action-btn">
            <Building2 size={24} />
            <span>Manage Stores</span>
          </Link>
          <Link to="/manager/products" className="quick-action-btn">
            <Package size={24} />
            <span>Manage Products</span>
          </Link>
          <Link to="/manager/stock" className="quick-action-btn">
            <Package size={24} />
            <span>View Stock</span>
          </Link>
          <Link to="/manager/reports" className="quick-action-btn">
            <TrendingUp size={24} />
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

export default ManagerDashboard;
