import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStoreManagers from './pages/admin/ManageStoreManagers';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManageStores from './pages/manager/ManageStores';
import ManageProducts from './pages/manager/ManageProducts';
import ViewStock from './pages/manager/ViewStock';
import ManageCashiers from './pages/manager/ManageCashiers';
import ManagerReports from './pages/manager/ManagerReports';
import ManagerNotifications from './pages/manager/ManagerNotifications';

// Cashier Pages
import CashierDashboard from './pages/cashier/CashierDashboard';
import SearchProduct from './pages/cashier/SearchProduct';
import ManageOrders from './pages/cashier/ManageOrders';
import CashierReports from './pages/cashier/CashierReports';
import CashierStock from './pages/cashier/CashierStock';
import CashierNotifications from './pages/cashier/CashierNotifications';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'store_manager' || user?.role === 'manager') return <Navigate to="/manager" replace />;
    if (user?.role === 'cashier') return <Navigate to="/cashier" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Home Redirect Component
const HomeRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'store_manager' || user?.role === 'manager') return <Navigate to="/manager" replace />;
  if (user?.role === 'cashier') return <Navigate to="/cashier" replace />;

  return <Navigate to="/login" replace />;
};

// Login Route - Redirect if already logged in
const LoginRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'store_manager' || user?.role === 'manager') return <Navigate to="/manager" replace />;
    if (user?.role === 'cashier') return <Navigate to="/cashier" replace />;
  }

  return <Login />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginRoute />} />
      
      {/* Home Redirect */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/managers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageStoreManagers />
          </ProtectedRoute>
        }
      />

      {/* Store Manager Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['store_manager','manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/stores"
        element={
          <ProtectedRoute allowedRoles={['store_manager','manager']}>
            <ManageStores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/cashiers"
        element={
          <ProtectedRoute allowedRoles={['store_manager','manager']}>
            <ManageCashiers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/products"
        element={
          <ProtectedRoute allowedRoles={['store_manager','manager']}>
            <ManageProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/stock"
        element={
          <ProtectedRoute allowedRoles={['store_manager','manager']}>
            <ViewStock />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <ProtectedRoute allowedRoles={['store_manager','manager']}>
            <ManagerReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/notifications"
        element={
          <ProtectedRoute allowedRoles={['store_manager','manager']}>
            <ManagerNotifications />
          </ProtectedRoute>
        }
      />

      {/* Cashier Routes */}
      <Route
        path="/cashier"
        element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <CashierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashier/search"
        element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <SearchProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashier/orders"
        element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <ManageOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashier/reports"
        element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <CashierReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashier/stock"
        element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <CashierStock />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashier/notifications"
        element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <CashierNotifications />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <PWAInstallPrompt />
      </AuthProvider>
    </Router>
  );
}

export default App;
