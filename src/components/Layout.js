import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  Building2,
  Search,
  FileText
} from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAdmin, isStoreManager, isCashier } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { path: '/admin', icon: Home, label: 'Dashboard' },
        { path: '/admin/managers', icon: Users, label: 'Store Managers' },
      ];
    }
    if (isStoreManager) {
      return [
        { path: '/manager', icon: Home, label: 'Dashboard' },
        { path: '/manager/stores', icon: Building2, label: 'Manage Stores' },
        { path: '/manager/cashiers', icon: Users, label: 'Cashiers' },
        { path: '/manager/products', icon: Package, label: 'Manage Products' },
        { path: '/manager/stock', icon: Package, label: 'View Stock' },
        { path: '/manager/reports', icon: BarChart3, label: 'View Reports' },
        { path: '/manager/notifications', icon: Bell, label: 'Notifications' },
      ];
    }
    if (isCashier) {
      return [
        { path: '/cashier', icon: Home, label: 'Dashboard' },
        { path: '/cashier/search', icon: Search, label: 'Search Product' },
        { path: '/cashier/orders', icon: ShoppingCart, label: 'Manage Orders' },
        { path: '/cashier/reports', icon: FileText, label: 'View Reports' },
        { path: '/cashier/stock', icon: Package, label: 'View Stock' },
        { path: '/cashier/notifications', icon: Bell, label: 'Notifications' },
      ];
    }
    return [];
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrator';
    if (isStoreManager) return 'Store Manager';
    if (isCashier) return 'Cashier';
    return 'User';
  };

  const navItems = getNavItems();

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <ShoppingCart size={28} />
            <span>Multi POS System</span>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length === 2}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{getRoleLabel()}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
