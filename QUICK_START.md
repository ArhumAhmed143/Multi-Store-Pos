# Quick Start Guide - Laravel Backend + React Frontend

This guide provides fast track instructions to get your POS system running.

---

## 1. Backend Setup (Laravel + XAMPP)

### Step 1: Start XAMPP Services
1. Open `C:\xampp\xampp-control-panel.exe`
2. Click **Start** next to Apache
3. Click **Start** next to MySQL
4. Wait for both to show "Running"

### Step 2: Create Database
1. Open browser: `http://localhost/phpmyadmin`
2. Click **New** in left sidebar
3. Type database name: `pos_system_db`
4. Click **Create**

### Step 3: Install Laravel Backend
Open PowerShell in your projects folder:

```bash
# Create Laravel project
composer create-project laravel/laravel pos-system-backend "10.*"
cd pos-system-backend

# Install dependencies
composer install

# Install Sanctum for API authentication
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Step 4: Copy Project Files
Copy these files to your Laravel project:

**From `laravel-files/` to `pos-system-backend/`:**

```
laravel-files/models/*               → app/Models/
laravel-files/controllers/Api/*      → app/Http/Controllers/Api/
laravel-files/migrations/*           → database/migrations/
laravel-files/seeders/*              → database/seeders/
laravel-files/routes/api.php         → routes/api.php
laravel-files/.env.example           → .env (then edit it)
```

### Step 5: Configure Environment
1. Open `.env` in your Laravel project
2. Update these settings:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_system_db
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Step 6: Initialize Database
```bash
# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed sample data
php artisan db:seed
```

### Step 7: Start Laravel Server
```bash
php artisan serve
```

**Output:** `Server running at http://localhost:8000`

**✓ Backend is ready!** Keep terminal open.

---

## 2. Frontend Setup (React)

### Step 1: Copy New API Service
1. Navigate to your React project: `src/services/`
2. Replace `api.js` with `UPDATED_REACT_API_SERVICE.js`
3. Rename it back to `api.js`

### Step 2: Create Environment File
In your React project root, create `.env.local`:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### Step 3: Install Dependencies (if needed)
```bash
npm install axios
```

### Step 4: Update Components
Update these files to use the new API service:

**1. `src/context/AuthContext.js`** - Use the example from REACT_INTEGRATION_GUIDE.md

**2. `src/components/Login.js`** - Use the example from REACT_INTEGRATION_GUIDE.md

**3. All page components** - Replace mock data with API calls:
   - `src/pages/manager/ManageProducts.js`
   - `src/pages/cashier/ManageOrders.js`
   - `src/pages/admin/AdminDashboard.js`
   - etc.

### Step 5: Start React Server
Open new PowerShell terminal and run:

```bash
cd path/to/pos-system-frontend
npm start
```

**Output:** Browser opens at `http://localhost:3000`

---

## 3. Test the Integration

### Test 1: Login
1. Go to `http://localhost:3000/login`
2. Try these credentials:
   - Email: `admin@pos.com`
   - Password: `password123`
3. You should see the admin dashboard

### Test 2: Create Product
1. Go to Manager dashboard
2. Try creating a new product
3. Check if it appears in the list

### Test 3: Create Order
1. Go to Cashier dashboard
2. Search and add products to cart
3. Complete order
4. Check if order appears in order list

### Test 4: Check Network
1. Open browser DevTools (F12)
2. Go to Network tab
3. Create an action and verify API calls are made
4. Check Response tab to see data from backend

---

## 4. Sample Login Credentials

After seeding, you can login with:

| Role    | Email              | Password   |
|---------|-------------------|------------|
| Admin   | `admin@pos.com`   | password123 |
| Manager | `manager1@pos.com`| password123 |
| Cashier | `cashier1@pos.com`| password123 |

---

## 5. Verify Everything is Working

### Check Backend
```bash
# In Laravel terminal
php artisan tinker
User::all() # Should show 5 users
exit
```

### Check Database
1. Go to `http://localhost/phpmyadmin`
2. Select `pos_system_db`
3. You should see all tables: users, stores, products, orders, order_items, notifications

### Check Frontend
- Login works
- Products load
- Orders save
- No console errors (F12)

---

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| "Connection refused" | Ensure XAMPP MySQL is running |
| "CORS Error" | Restart Laravel server after env changes |
| "401 Unauthorized" | Try logging in again, clear browser cache |
| "Port 8000 already in use" | `php artisan serve --port=8001` |
| "Cannot find module axios" | `npm install axios` |
| "Database does not exist" | Create `pos_system_db` in phpmyadmin |

---

## Project Structure

```
C:\projects\
├── pos-system-backend/          ← Laravel backend
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── .env                     ← Database config
│   └── artisan
│
└── pos-system-frontend/         ← React frontend (your existing project)
    ├── src/
    │   ├── services/api.js      ← Updated with new API
    │   ├── context/AuthContext.js
    │   └── components/
    ├── .env.local               ← API URL config
    └── package.json
```

---

## Running Daily

### Terminal 1 - Backend
```bash
cd C:\projects\pos-system-backend
php artisan serve
# Runs on http://localhost:8000
```

### Terminal 2 - Frontend
```bash
cd C:\projects\pos-system-frontend
npm start
# Opens browser at http://localhost:3000
```

**That's it!** Your POS system is running with a real database backend.

---

## Next Steps After Getting it Running

1. **Update remaining components** to use API instead of mock data
2. **Add error handling** and loading states
3. **Implement pagination** for product/order lists
4. **Add search filters** for advanced queries
5. **Deploy to production** (DigitalOcean, Heroku, AWS, etc.)

---

## Documentation Files

- `LARAVEL_BACKEND_SETUP.md` - Detailed backend setup
- `REACT_INTEGRATION_GUIDE.md` - Frontend integration details
- `COMPLETE_PROJECT_GUIDE.md` - Full architecture overview
- `laravel-files/` - All Laravel code files

---

## Key Points to Remember

✅ **Ensure XAMPP is running** before starting Laravel
✅ **Both servers must run simultaneously** (different terminals)
✅ **Token is auto-stored** in localStorage after login
✅ **API URL must match** `REACT_APP_API_URL`
✅ **CORS is configured** for localhost:3000
✅ **Sample data is seeded** - you can login immediately

For detailed documentation, refer to the guides in your project folder.

