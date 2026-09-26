// Mock Data for POS System
// This data resets when user logs out (no persistent storage)

export const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Ahmed Admin' },
  { id: 2, username: 'manager', password: 'manager123', role: 'store_manager', name: 'Abdul Rehman Manager', storeId: 1 },
  { id: 3, username: 'cashier', password: 'cashier123', role: 'cashier', name: 'Khalid Cashier', storeId: 1 },
];

export const initialStoreManagers = [
  { id: 1, name: 'Ahmed Manager', email: 'ahmed@pos.com', phone: '555-0101', storeId: 1, status: 'active' },
  { id: 2, name: 'Abdul Rehman', email: 'abdul@pos.com', phone: '555-0102', storeId: 2, status: 'active' },
  { id: 3, name: 'Khalid Waleed', email: 'khalid@pos.com', phone: '555-0103', storeId: 3, status: 'inactive' },
];

export const initialStores = [
  { id: 1, name: 'Downtown Store', address: '123 Main St', city: 'New York', status: 'active' },
  { id: 2, name: 'Mall Branch', address: '456 Shopping Ave', city: 'Los Angeles', status: 'active' },
  { id: 3, name: 'Airport Store', address: '789 Terminal Rd', city: 'Chicago', status: 'active' },
];

export const initialProducts = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 25, storeId: 1, minStock: 5 },
  { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 150, storeId: 1, minStock: 20 },
  { id: 3, name: 'USB-C Cable', category: 'Accessories', price: 14.99, stock: 3, storeId: 1, minStock: 30 },
  { id: 4, name: 'Monitor 27"', category: 'Electronics', price: 349.99, stock: 40, storeId: 1, minStock: 10 },
  { id: 5, name: 'Keyboard Mechanical', category: 'Electronics', price: 89.99, stock: 60, storeId: 1, minStock: 15 },
  { id: 6, name: 'Headphones Wireless', category: 'Electronics', price: 199.99, stock: 2, storeId: 2, minStock: 10 },
  { id: 7, name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 35, storeId: 2, minStock: 8 },
  { id: 8, name: 'Phone Stand', category: 'Accessories', price: 24.99, stock: 80, storeId: 2, minStock: 25 },
  { id: 9, name: 'Laptop Bag', category: 'Accessories', price: 49.99, stock: 45, storeId: 3, minStock: 12 },
  { id: 10, name: 'Power Bank', category: 'Electronics', price: 39.99, stock: 4, storeId: 3, minStock: 20 },
];

export const initialOrders = [
  { id: 1001, customerId: 'C001', items: [{ productId: 1, quantity: 1, price: 1299.99 }], total: 1299.99, status: 'completed', storeId: 1, date: '2024-12-15', cashierId: 3 },
  { id: 1002, customerId: 'C002', items: [{ productId: 2, quantity: 2, price: 29.99 }, { productId: 5, quantity: 1, price: 89.99 }], total: 149.97, status: 'completed', storeId: 1, date: '2024-12-15', cashierId: 3 },
  { id: 1003, customerId: 'C003', items: [{ productId: 4, quantity: 1, price: 349.99 }], total: 349.99, status: 'pending', storeId: 1, date: '2024-12-16', cashierId: 3 },
  { id: 1004, customerId: 'C004', items: [{ productId: 6, quantity: 1, price: 199.99 }], total: 199.99, status: 'completed', storeId: 2, date: '2024-12-16', cashierId: 3 },
  { id: 1005, customerId: 'C005', items: [{ productId: 9, quantity: 2, price: 49.99 }], total: 99.98, status: 'completed', storeId: 3, date: '2024-12-17', cashierId: 3 },
];

export const initialNotifications = [
  { id: 1, type: 'low_stock', message: 'USB-C Cable is running low (3 items left)', storeId: 1, read: false, date: '2024-12-17' },
  { id: 2, type: 'low_stock', message: 'Headphones Wireless is running low (2 items left)', storeId: 2, read: false, date: '2024-12-17' },
  { id: 3, type: 'low_stock', message: 'Power Bank is running low (4 items left)', storeId: 3, read: false, date: '2024-12-17' },
  { id: 4, type: 'order', message: 'New order #1003 received', storeId: 1, read: true, date: '2024-12-16' },
  { id: 5, type: 'system', message: 'System maintenance scheduled for Dec 20', storeId: null, read: false, date: '2024-12-15' },
];

export const salesData = [
  { month: 'Jan', sales: 12500, profit: 3750, orders: 45 },
  { month: 'Feb', sales: 15200, profit: 4560, orders: 52 },
  { month: 'Mar', sales: 18900, profit: 5670, orders: 68 },
  { month: 'Apr', sales: 16800, profit: 5040, orders: 58 },
  { month: 'May', sales: 21500, profit: 6450, orders: 75 },
  { month: 'Jun', sales: 24800, profit: 7440, orders: 88 },
  { month: 'Jul', sales: 22100, profit: 6630, orders: 79 },
  { month: 'Aug', sales: 26500, profit: 7950, orders: 95 },
  { month: 'Sep', sales: 23200, profit: 6960, orders: 82 },
  { month: 'Oct', sales: 28900, profit: 8670, orders: 102 },
  { month: 'Nov', sales: 32500, profit: 9750, orders: 118 },
  { month: 'Dec', sales: 38200, profit: 11460, orders: 142 },
];

export const categoryData = [
  { name: 'Electronics', value: 65, color: '#6366f1' },
  { name: 'Accessories', value: 25, color: '#22c55e' },
  { name: 'Services', value: 10, color: '#f59e0b' },
];

export const dailySales = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 3800 },
  { day: 'Wed', sales: 5100 },
  { day: 'Thu', sales: 4600 },
  { day: 'Fri', sales: 6200 },
  { day: 'Sat', sales: 7500 },
  { day: 'Sun', sales: 5800 },
];
