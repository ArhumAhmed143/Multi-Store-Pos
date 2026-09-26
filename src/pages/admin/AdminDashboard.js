import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { storeManagersAPI, storesAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    managers: 0,
    stores: 0
  });
  const [chartData, setChartData] = useState([]);
  const [managerStatusData, setManagerStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [managers, stores] = await Promise.all([
          storeManagersAPI.getAll(),
          storesAPI.getAll()
        ]);
        setStats({
          managers: managers.length,
          stores: stores.length
        });

        setChartData([
          {
            name: 'Managers',
            count: managers.length
          },
          {
            name: 'Stores',
            count: stores.length
          }
        ]);

        const activeManagers = managers.filter(m => m.status === 'active').length;
        const inactiveManagers = managers.length - activeManagers;
        setManagerStatusData([
          { name: 'Active', value: activeManagers, color: '#10b981' },
          { name: 'Inactive', value: inactiveManagers, color: '#ef4444' }
        ]);
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
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's an overview of your system.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Store Managers</div>
            <div className="stat-value">{stats.managers}</div>
            <div className="stat-change positive">Active users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Store size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Stores</div>
            <div className="stat-value">{stats.stores}</div>
            <div className="stat-change positive">All branches</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">System Status</div>
            <div className="stat-value">Online</div>
            <div className="stat-change positive">All systems operational</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/admin/managers" className="quick-action-btn">
            <Users size={24} />
            <span>Manage Store Managers</span>
          </Link>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-container">
          <div className="card">
            <div className="card-header">
              <h2>Managers & Stores Overview</h2>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="card">
            <div className="card-header">
              <h2>Manager Status Distribution</h2>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={managerStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {managerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
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
        .chart-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        .chart-container {
          width: 100%;
        }
        @media (max-width: 1024px) {
          .chart-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
