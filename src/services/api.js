/* eslint-disable unicode-bom */
// Real API Service - Connects to Laravel Backend
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple cache system
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const clearCachedData = (key) => {
  cache.delete(key);
};

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============ Authentication Services ============
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },
  logout: async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    }
  },
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// ============ Product Services ============
export const productsAPI = {
  getAll: async (forceRefresh = false) => {
    const cacheKey = 'products_all';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await api.get('/products');
      const products = response.data.data || [];
      const normalizedProducts = products.map((product) => ({
        ...product,
        name: product.name ?? '',
        category: product.category ?? '',
        stock: Number(product.stock) || 0,
        minStock: product.minStock ?? product.min_stock ?? 0,
        storeId: product.storeId ?? product.store_id ?? null,
      }));
      setCachedData(cacheKey, normalizedProducts);
      return normalizedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data.data;
      if (!product) return null;
      return {
        ...product,
        name: product.name ?? '',
        category: product.category ?? '',
        stock: Number(product.stock) || 0,
        minStock: product.minStock ?? product.min_stock ?? 0,
        storeId: product.storeId ?? product.store_id ?? null,
      };
    } catch (error) {
      return null;
    }
  },
  add: async (product) => {
    try {
      const payload = {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        store_id: product.storeId,
        min_stock: product.minStock
      };
      const response = await api.post('/products', payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Add product error:', error.response?.data);
      return { success: false, error: error.response?.data?.message || 'Failed to create product' };
    }
  },
  update: async (id, data) => {
    try {
      const payload = {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        store_id: data.storeId,
        min_stock: data.minStock
      };
      const response = await api.put(`/products/${id}`, payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Update product error:', error.response?.data);
      return { success: false, error: error.response?.data?.message || 'Failed to update product' };
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete product' };
    }
  },
  search: async (query) => {
    try {
      const allProducts = await this.getAll();
      return allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
};

// ============ Store Services ============
export const storesAPI = {
  getAll: async (forceRefresh = false) => {
    const cacheKey = 'stores_all';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await api.get('/stores');
      const stores = response.data.data || [];
      setCachedData(cacheKey, stores);
      return stores;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/stores/${id}`);
      return response.data.data;
    } catch (error) {
      return null;
    }
  },
  add: async (store) => {
    try {
      const response = await api.post('/stores', store);
      clearCachedData('stores_all');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create store' };
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/stores/${id}`, data);
      clearCachedData('stores_all');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update store' };
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/stores/${id}`);
      clearCachedData('stores_all');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed' };
    }
  }
};

// ============ Store Managers API (Admin) ============
export const storeManagersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/users', { params: { role: 'manager' } });
      return response.data.data || [];
    } catch (error) {
      return [];
    }
  },
  add: async (manager) => {
    try {
      const payload = {
        name: manager.username || manager.name,
        email: manager.email,
        password: manager.password,
        role: 'manager',
      };
      if (manager.storeLimit !== '' && manager.storeLimit !== undefined) {
        payload.store_limit = Number(manager.storeLimit);
      }
      const response = await api.post('/users', payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create manager' };
    }
  },
  update: async (id, data) => {
    try {
      const payload = {
        name: data.username || data.name,
        email: data.email,
        role: 'manager',
      };
      if (data.password) {
        payload.password = data.password;
      }
      if (data.storeLimit !== undefined) {
        payload.store_limit = data.storeLimit === '' ? null : Number(data.storeLimit);
      }
      const response = await api.put(`/users/${id}`, payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update manager' };
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete manager' };
    }
  },
};

// ============ Cashier API (Manager) ============
export const cashiersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/users', { params: { role: 'cashier' } });
      return response.data.data || [];
    } catch (error) {
      return [];
    }
  },
  add: async (cashier) => {
    try {
      const payload = {
        name: cashier.name,
        email: cashier.email,
        password: cashier.password,
        role: 'cashier',
      };
      const response = await api.post('/users', payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create cashier' };
    }
  },
  update: async (id, data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        role: 'cashier',
      };
      if (data.password) {
        payload.password = data.password;
      }
      const response = await api.put(`/users/${id}`, payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update cashier' };
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete cashier' };
    }
  },
};

// ============ Order Services ============
export const ordersAPI = {
  getAll: async (forceRefresh = false) => {
    const cacheKey = 'orders_all';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await api.get('/orders');
      const orders = response.data.data || [];
      setCachedData(cacheKey, orders);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      return null;
    }
  },
  add: async (order) => {
    try {
      const response = await api.post('/orders', order);
      clearCachedData('orders_all');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed' };
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/orders/${id}`, data);
      clearCachedData('orders_all');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed' };
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      clearCachedData('orders_all');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete order' };
    }
  },
};

// ============ Notifications API ============
export const notificationsAPI = {
  getAll: async (storeId = null, forceRefresh = false) => {
    const cacheKey = `notifications_${storeId || 'all'}`;
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await api.get('/notifications');
      const notifications = response.data.data || [];
      setCachedData(cacheKey, notifications);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  getUnread: async (storeId = null, forceRefresh = false) => {
    const notifications = await this.getAll(storeId, forceRefresh);
    let filteredNotifications = notifications;

    // Filter by store if storeId is provided (for cashier)
    if (storeId) {
      // For now, return all unread notifications for cashier
      // In future, we can filter by store-specific notifications
      filteredNotifications = notifications;
    }

    return filteredNotifications.filter(n => !n.is_read).length;
  },
  getUnreadCount: async (storeId = null) => {
    try {
      const notifications = await this.getAll();
      let filteredNotifications = notifications;

      // Filter by store if storeId is provided (for cashier)
      if (storeId) {
        filteredNotifications = notifications;
      }

      return filteredNotifications.filter(n => !n.is_read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },
};

// ============ Reports API ============
export const reportsAPI = {
  getSalesData: async (forceRefresh = false) => {
    const cacheKey = 'reports_sales';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const orders = await ordersAPI.getAll(forceRefresh);
      const monthlyMap = {};

      orders.forEach((order) => {
        const createdAt = order.created_at || new Date().toISOString();
        const date = new Date(createdAt);
        const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });

        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            month: monthKey,
            sales: 0,
            profit: 0,
            orders: 0,
          };
        }

        const amount = parseFloat(order.total_amount) || 0;
        monthlyMap[monthKey].sales += amount;
        monthlyMap[monthKey].orders += 1;
      });

      const result = Object.values(monthlyMap).map((item) => ({
        ...item,
        sales: Number(item.sales.toFixed(2)),
        profit: Number(item.profit.toFixed(2)),
      }));

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
  },
  getCategoryData: async (forceRefresh = false) => {
    const cacheKey = 'reports_categories';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const orders = await ordersAPI.getAll(forceRefresh);
      const categoryTotals = {};
      let total = 0;

      orders.forEach((order) => {
        order.items?.forEach((item) => {
          const category = item.product?.category || 'Uncategorized';
          const amount = (parseFloat(item.price) || 0) * (item.quantity || 0);
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          total += amount;
        });
      });

      const result = Object.entries(categoryTotals).map(([name, value], index) => ({
        name,
        value: total ? Number(((value / total) * 100).toFixed(1)) : 0,
        color: ['#667eea', '#22c55e', '#f59e0b', '#ec4899', '#10b981'][index % 5],
      }));

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching category data:', error);
      return [];
    }
  },
  getProfitLoss: async (forceRefresh = false) => {
    const cacheKey = 'reports_profit_loss';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const orders = await ordersAPI.getAll(forceRefresh);
      const revenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
      const cost = 0;
      const profit = 0;
      const profitMargin = revenue > 0 ? 0 : 0;

      const result = {
        revenue: Number(revenue.toFixed(2)),
        cost: Number(cost.toFixed(2)),
        profit: Number(profit.toFixed(2)),
        profitMargin,
        orderCount: orders.length,
      };

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching profit/loss data:', error);
      return { revenue: 0, cost: 0, profit: 0, profitMargin: 0, orderCount: 0 };
    }
  },
  getDailySales: async (forceRefresh = false) => {
    const cacheKey = 'reports_daily_sales';
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    try {
      const orders = await ordersAPI.getAll(forceRefresh);
      const byDate = {};

      orders.forEach((order) => {
        const createdAt = order.created_at || new Date().toISOString();
        const date = new Date(createdAt).toISOString().split('T')[0];
        byDate[date] = (byDate[date] || 0) + (parseFloat(order.total_amount) || 0);
      });

      const result = Object.entries(byDate).map(([date, amount]) => ({
        day: date,
        sales: Number(amount.toFixed(2)),
      }));

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      return [];
    }
  },
  exportReport: async (type) => {
    try {
      // This would typically call a backend endpoint to generate and download a report
      // For now, we'll just return a success message
      return { success: true, message: `${type} report exported successfully` };
    } catch (error) {
      console.error('Error exporting report:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============ Stock API ============
export const stockAPI = {
  getStock: async () => {
    return await productsAPI.getAll();
  },
  getLowStockAlerts: async (storeId = null) => {
    try {
      const products = await productsAPI.getAll();
      let filteredProducts = products;

      // Filter by store if storeId is provided
      if (storeId) {
        filteredProducts = products.filter(p => p.storeId === parseInt(storeId));
      }

      // Return products with low stock (stock <= minStock)
      return filteredProducts.filter(p => p.stock <= (p.minStock || 10));
    } catch (error) {
      console.error('Error getting low stock alerts:', error);
      return [];
    }
  }
};

export const resetAllData = () => {};
export default api;
