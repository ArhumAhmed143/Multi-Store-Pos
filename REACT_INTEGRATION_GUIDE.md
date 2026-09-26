# React Frontend Integration Guide

This guide explains how to connect your existing React POS frontend to the Laravel backend API.

## Table of Contents
1. [Setup Environment Variables](#setup-environment-variables)
2. [Update API Service](#update-api-service)
3. [Update Authentication](#update-authentication)
4. [Update Components](#update-components)
5. [Handle API Responses](#handle-api-responses)
6. [Error Handling](#error-handling)
7. [Testing the Integration](#testing-the-integration)

---

## Setup Environment Variables

### Step 1: Create `.env.local` file
In your React project root directory, create a `.env.local` file:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### Step 2: Update `.env` (Optional)
You can also add a default `.env` file for production:

```
REACT_APP_API_URL=https://api.yourcompany.com/api
REACT_APP_ENV=production
```

---

## Update API Service

### Step 1: Replace your `src/services/api.js`
Replace the entire contents of your existing `src/services/api.js` with the provided `UPDATED_REACT_API_SERVICE.js` file.

The new API service includes:
- Automatic token management (Bearer token in headers)
- Request/response interceptors
- Error handling
- 401 Unauthorized redirection
- All CRUD operations for all endpoints

### Step 2: Install Axios (if not already installed)
```bash
npm install axios
```

---

## Update Authentication

### Step 1: Update AuthContext
Update your `src/context/AuthContext.js`:

```javascript
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if logout fails
      setUser(null);
      setIsAuthenticated(false);
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Step 2: Update Login Component
Update your `src/components/Login.js`:

```javascript
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const user = result.user;
      
      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (user.role === 'cashier') {
        navigate('/cashier/dashboard');
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>POS System Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="demo-info">
          Demo credentials (to be added to database):
          <br />
          Admin: admin@pos.com / password123
          <br />
          Manager: manager@pos.com / password123
          <br />
          Cashier: cashier@pos.com / password123
        </p>
      </div>
    </div>
  );
};

export default Login;
```

---

## Update Components

### Example: Updating Product Management Component

**Before (Mock Data):**
```javascript
import { mockProducts } from '../data/mockData';

const ManageProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);

  // Uses mock data directly
};
```

**After (Real API):**
```javascript
import { productService } from '../services/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await productService.create(productData);
      fetchProducts(); // Refresh list
      // Show success message
    } catch (err) {
      setError('Failed to create product');
      console.error(err);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await productService.update(id, productData);
      fetchProducts(); // Refresh list
      // Show success message
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productService.delete(id);
        fetchProducts(); // Refresh list
        // Show success message
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="products-management">
      {error && <div className="error-message">{error}</div>}
      {/* Rest of component */}
    </div>
  );
};

export default ManageProducts;
```

---

## Handle API Responses

### Success Response Format
All successful responses follow this format:
```json
{
  "message": "Description of what happened",
  "data": {
    // Either single object, array, or null
  }
}
```

### Error Response Format
```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### Extract Data Correctly
```javascript
// ✓ Correct way
const response = await productService.getAll();
const products = response.data; // This is the actual data

// ✗ Wrong way (will fail)
const products = response.data.data; // Double nesting!
```

---

## Error Handling

### Setup Global Error Handler
Create `src/hooks/useApi.js`:

```javascript
import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleError = (error) => {
    const message = error.data?.message || 'An error occurred';
    const errors = error.data?.errors || {};
    
    setError(message);
    return { message, errors };
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    handleError,
  };
};
```

### Use in Components
```javascript
import { useApi } from '../hooks/useApi';

const SomeComponent = () => {
  const { loading, error, setLoading, handleError } = useApi();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      // Handle success
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };
};
```

---

## Testing the Integration

### Step 1: Start Both Servers
**Terminal 1 - Laravel Backend:**
```bash
cd path/to/pos-system-backend
php artisan serve
# Output: Server running at http://localhost:8000
```

**Terminal 2 - React Frontend:**
```bash
cd path/to/pos-system-frontend
npm start
# Opens browser at http://localhost:3000
```

### Step 2: Test Login
1. Add test users to database via Laravel seeder or directly
2. Try logging in with test credentials
3. Check browser console for any errors

### Step 3: Test API Calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try creating/updating/deleting data
4. Verify requests show correct headers and responses

### Step 4: Check Browser Storage
In DevTools Console, run:
```javascript
// View stored token
console.log(localStorage.getItem('authToken'));

// View stored user
console.log(JSON.parse(localStorage.getItem('user')));
```

---

## Common Issues and Solutions

### Issue 1: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure Laravel CORS config is correct
- Verify `http://localhost:3000` is in `config/cors.php`
- Restart Laravel server

**cors.php:**
```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
],
'allowed_methods' => ['*'],
```

### Issue 2: 401 Unauthorized
**Error:** `401 Unauthorized` on API calls

**Solution:**
- Ensure token is being sent: Check Network tab in DevTools
- Token might be expired: Try logging in again
- Check if token is in localStorage

### Issue 3: API URL Wrong
**Error:** `Network ECONNREFUSED localhost:8000`

**Solution:**
- Ensure `.env.local` has correct API URL
- Ensure Laravel server is running (`php artisan serve`)
- Check port in `REACT_APP_API_URL`

### Issue 4: Data Not Updating
**Problem:** Component doesn't re-render after API call

**Solution:**
```javascript
// ✓ Correct - Create new array reference
setProducts([...response.data]);

// ✗ Wrong - Same reference
setProducts(response.data);
```

---

## Component Update Checklist

- [ ] Replace `src/services/api.js` with new version
- [ ] Update `src/context/AuthContext.js`
- [ ] Update `src/components/Login.js`
- [ ] Update all dashboard components
- [ ] Update product management components
- [ ] Update store management components
- [ ] Update order components
- [ ] Update notification components
- [ ] Remove references to mock data
- [ ] Test login functionality
- [ ] Test CRUD operations
- [ ] Test error handling

---

## Production Deployment

When deploying to production:

1. **Update API URL:**
   ```
   REACT_APP_API_URL=https://your-api.com/api
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Update CORS in Laravel:**
   ```php
   'allowed_origins' => [
       'https://your-domain.com',
   ],
   ```

4. **Enable HTTPS** in both frontend and backend

5. **Set strong passwords** for database and JWT tokens

