# 🚀 Backend Installation & Server Startup - Complete Guide

## ⚠️ Prerequisites Check

Before starting, ensure you have:

### 1. **Composer Installed** (PHP dependency manager)
   
**Check if Composer is installed:**
```powershell
composer --version
```

If you get "composer is not recognized," install it:

**Option A: Download from Official Website**
1. Visit: https://getcomposer.org/download/
2. Download the Windows installer (Composer-Setup.exe)
3. Run the installer and follow the walkthrough
4. It will detect PHP automatically
5. Restart your terminal/PowerShell after installation

**Option B: Quick Install (If you have PHP in PATH)**
```powershell
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```

---

## 🔧 Laravel Backend Setup

### Step 1: Create a New Terminal
Open PowerShell as Administrator and follow all steps below.

### Step 2: Create Laravel Project

```powershell
# Create project folder structure
mkdir "C:\projects"
cd "C:\projects"

# Create new Laravel project (takes 2-5 minutes)
composer create-project laravel/laravel pos-system-backend "10.*"
cd pos-system-backend
```

⏱️ **Wait for this to complete.** It will show: `✓ 113/113 packages installed`

### Step 3: Install Laravel Sanctum (Authentication)

```powershell
# Still in C:\projects\pos-system-backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Step 4: Copy Backend Files from React Project

Navigate to your React project and copy the backend files:

```powershell
# Open File Explorer to source
explorer "C:\Users\Jannat\Pictures\pos-system1123456789\laravel-files"
```

**Copy these files to Laravel project:**

| Source | Destination |
|--------|-------------|
| `models/*` | `C:\projects\pos-system-backend\app\Models\` |
| `controllers/Api/*` | `C:\projects\pos-system-backend\app\Http\Controllers\Api\` |
| `migrations/*` | `C:\projects\pos-system-backend\database\migrations\` |
| `seeders/*` | `C:\projects\pos-system-backend\database\seeders\` |
| `routes/api.php` | `C:\projects\pos-system-backend\routes\api.php` |

**Or use PowerShell to copy:**

```powershell
$source = "C:\Users\Jannat\Pictures\pos-system1123456789\laravel-files"
$dest = "C:\projects\pos-system-backend"

# Copy models
Copy-Item "$source\models\*" "$dest\app\Models\" -Force

# Copy controllers
Copy-Item "$source\controllers\Api\*" "$dest\app\Http\Controllers\Api\" -Force

# Copy migrations
Copy-Item "$source\migrations\*" "$dest\database\migrations\" -Force

# Copy seeders
Copy-Item "$source\seeders\*" "$dest\database\seeders\" -Force

# Copy routes
Copy-Item "$source\routes\api.php" "$dest\routes\api.php" -Force
```

### Step 5: Generate Application Key

```powershell
# Make sure you're in pos-system-backend folder
cd "C:\projects\pos-system-backend"

# Generate key
php artisan key:generate
```

You should see: `✓ Application key set successfully`

### Step 6: Configure Database (.env file)

```powershell
# Open the .env file in Notepad
notepad .env
```

**Find and replace these lines:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_system_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Save the file** (Ctrl+S, then close)

### Step 7: Create MySQL Database

```powershell
# Option A: Using Command Line
cd "C:\projects\pos-system-backend"
mysql -u root -e "CREATE DATABASE pos_system_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Option B: Using phpMyAdmin (if Command Line fails)
# 1. Make sure XAMPP is running (Apache & MySQL started)
# 2. Open browser: http://localhost/phpmyadmin
# 3. Click "New" on the left
# 4. Type: pos_system_db
# 5. Collation: utf8mb4_unicode_ci
# 6. Click Create
```

### Step 8: Run Migrations

```powershell
# Still in C:\projects\pos-system-backend
php artisan migrate
```

Expected output: Multiple ✓ for each migration

### Step 9: Seed Database with Sample Data

```powershell
php artisan db:seed
```

Expected output: `✓ Seeding completed successfully`

---

## 🚀 Start Both Servers

Now you're ready to start the application!

### Terminal 1: Start Laravel Backend

```powershell
cd "C:\projects\pos-system-backend"
php artisan serve
```

**Expected output:**
```
  INFO  Server running on [http://127.0.0.1:8000].

  Press Ctrl+C to stop the server
```

✅ **Leave this terminal running!**

### Terminal 2: Start React Frontend

**Open a NEW terminal (don't close Terminal 1) and run:**

```powershell
cd "C:\Users\Jannat\Pictures\pos-system1123456789"
npm start
```

**Expected output:**
```
On Your Network:  http://[your-ip]:3000
Local:            http://localhost:3000
```

✅ **Leave this terminal running too!**

---

## ✅ Test the System

1. **Open browser:** http://localhost:3000
2. **Click "Login"** button
3. **Enter credentials:**
   - Email: `admin@pos.com`
   - Password: `password123`
4. **Click "Sign In"**
5. **You should see the Admin Dashboard with real data from MySQL!**

---

## 🐛 Troubleshooting

### "Composer is not recognized"
- Install Composer from: https://getcomposer.org/download/
- Restart PowerShell after installation

### "mysql is not found"
- XAMPP MySQL not running? Start it from XAMPP Control Panel
- Use phpMyAdmin instead: http://localhost/phpmyadmin

### "SQLSTATE[HY000]: General error: 1030"
- Database might exist. Delete it first:
  ```powershell
  mysql -u root -e "DROP DATABASE pos_system_db;"
  mysql -u root -e "CREATE DATABASE pos_system_db;"
  ```

### "Token Mismatch" or logout issues
- Clear browser cache: DevTools (F12) → Application → Clear Site Data
- Or open in Incognito/Private mode

### Backend not responding (CORS errors)
- Make sure BOTH servers are running
- Check Laravel is on :8000, React on :3000
- Refresh React page (Ctrl+R or Cmd+R)

### React page shows blank
- Open DevTools (F12)
- Check Console for errors
- Make sure .env.local exists with:
  ```
  REACT_APP_API_URL=http://localhost:8000/api
  ```

---

## ✅ Success Checklist

- [ ] Composer installed (composer --version)
- [ ] Laravel project created at C:\projects\pos-system-backend
- [ ] Backend files copied (models, controllers, migrations, seeders)
- [ ] .env file configured with database details
- [ ] Application key generated
- [ ] Database created (pos_system_db)
- [ ] Migrations run successfully
- [ ] Database seeded with sample data
- [ ] Laravel server running on :8000
- [ ] React server running on :3000
- [ ] Can login with admin@pos.com / password123
- [ ] Dashboard shows real data from database
- [ ] No red errors in browser console

---

## 📞 Quick Support

**Something not working?**
1. Check that BOTH terminals are still running
2. Check .env.local has correct API_URL
3. Check XAMPP MySQL is running
4. Clear browser cache and refresh
5. Check DevTools Console (F12) for errors
