import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import { reportsAPI } from '../../services/api';

const ManagerReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [profitLoss, setProfitLoss] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sales, categories, daily, profit] = await Promise.all([
        reportsAPI.getSalesData(),
        reportsAPI.getCategoryData(),
        reportsAPI.getDailySales(),
        reportsAPI.getProfitLoss()
      ]);
      setSalesData(sales);
      setCategoryData(categories);
      setDailySales(daily);
      setProfitLoss(profit);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    const result = await reportsAPI.exportReport(type);
    if (result.success) {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>View Reports</h1>
        <p>Analyze sales data, profits, and performance metrics.</p>
      </div>

      {/* Report Tabs */}
      <div className="report-tabs">
        <button
          className={`report-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`report-tab ${activeTab === 'profit' ? 'active' : ''}`}
          onClick={() => setActiveTab('profit')}
        >
          Profit / Loss Report
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Summary */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon green">
                <DollarSign size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">$281,100</div>
                <div className="stat-change positive">+12.5% vs last year</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">
                <TrendingUp size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Profit</div>
                <div className="stat-value">$84,330</div>
                <div className="stat-change positive">+8.2% vs last year</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <ShoppingCart size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">904</div>
                <div className="stat-change positive">+15.3% vs last year</div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Sales Trend Chart */}
            <div className="chart-card large">
              <div className="chart-header">
                <h3>Monthly Sales Trend</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => handleExport('sales')}>
                  <Download size={14} />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#667eea" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Profit Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Monthly Profit</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Sales by Category</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="chart-legend">
                {categoryData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ background: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Sales */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Weekly Sales Pattern</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'profit' && profitLoss && (
        <div className="profit-report">
          <div className="profit-summary">
            <div className="profit-card revenue">
              <h4>Total Revenue</h4>
              <p className="amount">${profitLoss.revenue.toFixed(2)}</p>
            </div>
            <div className="profit-card cost">
              <h4>Total Cost</h4>
              <p className="amount">${profitLoss.cost.toFixed(2)}</p>
            </div>
            <div className="profit-card profit">
              <h4>Net Profit</h4>
              <p className="amount">${profitLoss.profit.toFixed(2)}</p>
            </div>
            <div className="profit-card margin">
              <h4>Profit Margin</h4>
              <p className="amount">{profitLoss.profitMargin}%</p>
            </div>
          </div>

          <div className="chart-card large">
            <div className="chart-header">
              <h3>Profit vs Loss Breakdown</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => handleExport('profit-loss')}>
                <Download size={14} />
                Export Report
              </button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="sales" fill="#667eea" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#22c55e" name="Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Monthly Breakdown</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                    <th>Orders</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((month, index) => (
                    <tr key={index}>
                      <td>{month.month}</td>
                      <td className="revenue-cell">${month.sales.toLocaleString()}</td>
                      <td className="profit-cell">${month.profit.toLocaleString()}</td>
                      <td>{month.orders}</td>
                      <td>
                        <span className="badge badge-success">
                          {((month.profit / month.sales) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
        .report-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .report-tab {
          padding: 12px 24px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }
        .report-tab:hover {
          border-color: #667eea;
          color: #667eea;
        }
        .report-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .chart-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .chart-card.large {
          grid-column: span 2;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .chart-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 16px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }
        .profit-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .profit-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .profit-card h4 {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 12px;
          font-weight: 500;
        }
        .profit-card .amount {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        .profit-card.revenue .amount { color: #667eea; }
        .profit-card.cost .amount { color: #ef4444; }
        .profit-card.profit .amount { color: #22c55e; }
        .profit-card.margin .amount { color: #8b5cf6; }
        .revenue-cell { color: #667eea; font-weight: 600; }
        .profit-cell { color: #22c55e; font-weight: 600; }
        @media (max-width: 1200px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          .chart-card.large {
            grid-column: span 1;
          }
          .profit-summary {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .profit-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ManagerReports;
