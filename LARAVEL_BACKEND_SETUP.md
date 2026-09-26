# Laravel Backend Setup for POS System

This guide provides complete instructions to build and run the Laravel backend for your React POS system.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [XAMPP Setup](#xampp-setup)
3. [Laravel Project Setup](#laravel-project-setup)
4. [Database Configuration](#database-configuration)
5. [Running Migrations](#running-migrations)
6. [API Endpoints](#api-endpoints)
7. [Frontend Integration](#frontend-integration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- XAMPP (with Apache, MySQL, PHP 8.0+)
- Composer (PHP package manager)
- Git
- Node.js (already installed for your React app)

---

## XAMPP Setup

### Step 1: Install XAMPP
1. Download XAMPP from https://www.apachefriends.org
2. Install XAMPP (recommended location: `C:\xampp`)
3. After installation, open XAMPP Control Panel

### Step 2: Start Services
1. Click **Start** next to Apache
2. Click **Start** next to MySQL
3. Verify both are running (showing green indicators)

### Step 3: Access MySQL
- Go to http://localhost/phpmyadmin
- Default credentials: Username: `root`, Password: `` (empty)

---

## Laravel Project Setup

### Step 1: Install Laravel
Open PowerShell in your projects directory and run:

```bash
composer create-project laravel/laravel pos-system-backend "10.*"
cd pos-system-backend
```

### Step 2: Install Dependencies
```bash
composer install
```

### Step 3: Configure Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Generate application key:
   ```bash
   php artisan key:generate
   ```

3. Edit `.env` file with your database configuration:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=pos_system_db
   DB_USERNAME=root
   DB_PASSWORD=
   
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

---

## Database Configuration

### Step 1: Create Database
1. Go to http://localhost/phpmyadmin
2. Click "New" to create a new database
3. Database name: `pos_system_db`
4. Click "Create"

### Step 2: Run Migrations
In your Laravel project directory, run:

```bash
php artisan migrate
```

This will create all required tables automatically.

### Step 3: Seed Sample Data (Optional)
```bash
php artisan db:seed
```

---

## Running the Laravel Server

### Development Server
In your Laravel project directory:

```bash
php artisan serve
```

This will start the server at `http://localhost:8000`

**Important**: Keep this terminal running while developing.

---

## API Structure

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current authenticated user

### Product Management
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Store Management
- `GET /api/stores` - List all stores
- `POST /api/stores` - Create store
- `PUT /api/stores/{id}` - Update store
- `DELETE /api/stores/{id}` - Delete store

### Order Management
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `GET /api/orders/{id}` - Get order details

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}` - Mark notification as read

---

## Frontend Integration

### Update API Service
Update your React `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/user'),
};

export const productService = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const storeService = {
  getAll: () => api.get('/stores'),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
};

export const orderService = {
  getAll: () => api.get('/orders'),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  getOne: (id) => api.get(`/orders/${id}`),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}`, { is_read: true }),
};

export default api;
```

### Update React Components
Replace mock API calls with real backend calls:

```javascript
// Before (mock data)
import { mockUsers, mockProducts } from '../data/mockData';

// After (real backend)
import { productService, authService } from '../services/api';

// In component
useEffect(() => {
  productService.getAll()
    .then(res => setProducts(res.data.data))
    .catch(err => console.error(err));
}, []);
```

---

## CORS Configuration

The Laravel backend needs to allow requests from your React frontend.

### Update `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => ['Authorization'],
'max_age' => 86400,
'supports_credentials' => true,
```

---

## Running Both Frontend and Backend

### Terminal 1 - Laravel Backend
```bash
cd path/to/pos-system-backend
php artisan serve
# Runs on http://localhost:8000
```

### Terminal 2 - React Frontend
```bash
cd path/to/pos-system-frontend
npm start
# Runs on http://localhost:3000
```

Both will run simultaneously on different ports.

---

## Database Tables Schema

### users
- id (Primary Key)
- name (String)
- email (String, Unique)
- password (String)
- role (Enum: admin, manager, cashier)
- created_at, updated_at

### stores
- id (Primary Key)
- name (String)
- location (String)
- manager_id (Foreign Key to users)
- created_at, updated_at

### products
- id (Primary Key)
- name (String)
- price (Decimal)
- stock (Integer)
- store_id (Foreign Key to stores)
- created_at, updated_at

### orders
- id (Primary Key)
- cashier_id (Foreign Key to users)
- total_amount (Decimal)
- status (Enum: pending, completed, cancelled)
- created_at, updated_at

### order_items
- id (Primary Key)
- order_id (Foreign Key to orders)
- product_id (Foreign Key to products)
- quantity (Integer)
- price (Decimal)
- created_at, updated_at

### notifications
- id (Primary Key)
- user_id (Foreign Key to users)
- message (Text)
- is_read (Boolean)
- created_at, updated_at

---

## Troubleshooting

### Port Already in Use
If `php artisan serve` fails because port 8000 is in use:
```bash
php artisan serve --port=8001
```

### Permission Denied (storage folder)
```bash
icacls storage /grant Users:F /t
icacls bootstrap/cache /grant Users:F /t
```

### MySQL Connection Error
- Verify MySQL is running in XAMPP Control Panel
- Check `.env` database credentials
- Ensure database `pos_system_db` exists

### CORS Errors
- Verify `http://localhost:3000` is in `config/cors.php`
- Restart Laravel server after changing config
- Clear browser cache

---

## Security Notes

⚠️ **For Production:**
- Change `APP_DEBUG=false` in `.env`
- Use strong database password
- Enable HTTPS
- Implement proper JWT token expiration
- Add rate limiting
- Validate all user inputs
- Use environment variables for sensitive data

