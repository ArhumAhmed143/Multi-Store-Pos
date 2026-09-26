# 🚀 SETUP INSTRUCTIONS - POS System with Real Backend

## ✅ Completed So Far

✅ Installed axios
✅ Created .env.local (API URL configured)
✅ Updated API service to connect to Laravel backend

---

## 📝 NEXT STEPS

### Step 1: Setup Laravel Backend

**Open PowerShell as Administrator** and run:

```powershell
# Create a new folder for backend
mkdir "C:\projects"
cd "C:\projects"

# Create Laravel project
composer create-project laravel/laravel pos-system-backend "10.*"
cd pos-system-backend

# Install Sanctum for API authentication
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Step 2: Copy Backend Files

Copy all files from `laravel-files/` (from your React project) to the new Laravel project:

```
From: C:\Users\Jannat\Pictures\pos-system1123456789\laravel-files\
To:   C:\projects\pos-system-backend\
```

**Copy these folders:**
- `models/*` → `app/Models/`
- `controllers/Api/*` → `app/Http/Controllers/Api/`
- `migrations/*` → `database/migrations/`
- `seeders/*` → `database/seeders/`
- `routes/api.php` → `routes/api.php`

### Step 3: Configure Laravel Environment

```powershell
cd C:\projects\pos-system-backend

# Copy environment template
copy .env.example .env

# Generate application key
php artisan key:generate
```

**Edit `.env` file** (use notepad):
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_system_db
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Step 4: Setup MySQL Database

1. **Open XAMPP Control Panel**
2. Click **Start** next to Apache
3. Click **Start** next to MySQL
4. Go to `http://localhost/phpmyadmin`
5. Click **New** in left sidebar
6. Create database: `pos_system_db`
7. Click **Create**

### Step 5: Run Migrations & Seed Data

```powershell
# In C:\projects\pos-system-backend folder

# Run migrations to create tables
php artisan migrate

# Seed sample data
php artisan db:seed
```

### Step 6: Start Laravel Server

```powershell
# Still in C:\projects\pos-system-backend

php artisan serve
```

**You should see:**
```
Server running at http://localhost:8000
```

⚠️ **Keep this terminal open!**

---

## 🎯 Step 7: Run React Frontend

**Open NEW PowerShell terminal** and run:

```powershell
cd "C:\Users\Jannat\Pictures\pos-system1123456789"

npm start
```

This will open your React app at `http://localhost:3000`

---

## 🔐 Test Login

Once both servers are running:

1. Go to **http://localhost:3000**
2. Click Login
3. Use these credentials:
   
   **Admin:**
   - Email: `admin@pos.com`
   - Password: `password123`
   
   **Manager:**
   - Email: `manager1@pos.com`
   - Password: `password123`
   
   **Cashier:**
   - Email: `cashier1@pos.com`
   - Password: `password123`

---

## ✅ Verification Checklist

After everything is set up, verify:

- [ ] XAMPP Apache running (green indicator)
- [ ] XAMPP MySQL running (green indicator)
- [ ] Database `pos_system_db` exists in phpMyAdmin
- [ ] Laravel server running on `http://localhost:8000`
- [ ] React app running on `http://localhost:3000`
- [ ] Can login with test credentials
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal windows

---

## 🎮 Test Features

### 1. Login Test
✓ Login with admin@pos.com

### 2. View Products
✓ Go to Products page
✓ Should load from backend
✓ Check DevTools (F12) Network tab

### 3. Create Order
✓ Go to Cashier section
✓ Create a new order
✓ Verify in database

### 4. Check Network Calls
✓ Open DevTools (F12)
✓ Go to Network tab
✓ Perform an action
✓ See API requests to `localhost:8000`

---

## 🚨 Troubleshooting

### Issue: "Connection refused" on Laravel
**Solution:** 
- Ensure XAMPP MySQL is running
- Check .env database config

### Issue: "CORS error"
**Solution:**
- Restart Laravel server
- Check config/cors.php

### Issue: "401 Unauthorized"
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try logging in again

### Issue: "Port 8000 already in use"
**Solution:**
```powershell
php artisan serve --port=8001
# Update REACT_APP_API_URL in .env.local to :8001
```

### Issue: Migration errors
**Solution:**
- Verify database `pos_system_db` exists
- Check MySQL is running
- Try: `php artisan migrate:refresh`

---

## 📊 Project Structure After Setup

```
Your Computer
├── C:\xampp\                          (XAMPP - MySQL/Apache)
├── C:\projects\pos-system-backend\    (Laravel Backend on :8000)
│   ├── app/Models/
│   ├── app/Http/Controllers/Api/
│   ├── database/migrations/
│   ├── .env
│   └── artisan
│
└── C:\Users\Jannat\Pictures\
    └── pos-system1123456789\          (React Frontend on :3000)
        ├── src/services/api.js        (Updated!)
        ├── .env.local                 (Created!)
        └── package.json
```

---

## 📋 Quick Command Reference

### Start Backend (Terminal 1)
```powershell
cd C:\projects\pos-system-backend
php artisan serve
```

### Start Frontend (Terminal 2)
```powershell
cd C:\Users\Jannat\Pictures\pos-system1123456789
npm start
```

### Stop Servers
- Press `Ctrl+C` in each terminal

### Restart Everything
1. Stop both servers
2. Restart XAMPP (if MySQL stopped)
3. Start Laravel: `php artisan serve`
4. Start React: `npm start`

---

## 📚 Documentation Guide

After setup, refer to:
- **QUICK_START.md** - 30-minute overview
- **LARAVEL_BACKEND_SETUP.md** - Backend details
- **REACT_INTEGRATION_GUIDE.md** - Frontend guide
- **ADVANCED_SETUP_TROUBLESHOOTING.md** - Advanced features

---

## 🎉 Success Indicators

✅ Both servers running without errors
✅ React app shows at localhost:3000
✅ Can login with test credentials
✅ DevTools shows API calls to :8000
✅ No console errors
✅ Data persists in database

---

## Next Steps

1. ✅ Complete setup above
2. ✅ Test login with all roles
3. Update components to use real APIs (see REACT_INTEGRATION_GUIDE.md)
4. Add more features
5. Deploy to production

---

**You're all set! Follow the steps above and you'll have a working POS system!**

