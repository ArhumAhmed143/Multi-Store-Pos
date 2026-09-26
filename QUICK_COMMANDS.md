# 🚀 QUICK COMMANDS - Copy & Paste Setup

Copy and paste these commands in order. Done!

---

## STEP 1: Create Backend Folder

```powershell
mkdir "C:\projects"
cd "C:\projects"
```

---

## STEP 2: Create Laravel Project

```powershell
composer create-project laravel/laravel pos-system-backend "10.*"
cd pos-system-backend
```

⏱️ This takes 2-5 minutes... wait for it to finish.

---

## STEP 3: Install Sanctum

```powershell
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

---

## STEP 4: Copy Backend Files

**Using File Explorer:**
1. Open: `C:\Users\Jannat\Pictures\pos-system1123456789\laravel-files\`
2. Copy all files from each subfolder to Laravel project:
   - `models/*` → `C:\projects\pos-system-backend\app\Models\`
   - `controllers/Api/*` → `C:\projects\pos-system-backend\app\Http\Controllers\Api\`
   - `migrations/*` → `C:\projects\pos-system-backend\database\migrations\`
   - `seeders/*` → `C:\projects\pos-system-backend\database\seeders\`
   - `routes/api.php` → `C:\projects\pos-system-backend\routes\api.php`

**Or using PowerShell:**
```powershell
# Navigate to Laravel folder first
cd "C:\projects\pos-system-backend"

# Then copy files (adjust paths as needed)
```

---

## STEP 5: Generate App Key

```powershell
# Make sure you're in pos-system-backend folder
cd "C:\projects\pos-system-backend"

# Generate key
php artisan key:generate
```

---

## STEP 6: Edit .env File

1. Open: `C:\projects\pos-system-backend\.env`
2. Find these lines and update them:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_system_db
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

3. Save file (Ctrl+S)

---

## STEP 7: Create Database

**Open XAMPP:**
1. Open `C:\xampp\xampp-control-panel.exe`
2. Click **Start** Apache (if not running)
3. Click **Start** MySQL
4. Go to: `http://localhost/phpmyadmin`
5. Click **New** (left sidebar)
6. Database name: `pos_system_db` (type this exactly!)
7. Click **Create**

---

## STEP 8: Run Migrations

```powershell
# Still in C:\projects\pos-system-backend

php artisan migrate
```

Wait for it to say all tables created...

---

## STEP 9: Seed Sample Data

```powershell
php artisan db:seed
```

Wait for completion. This creates 5 test users and sample data.

---

## STEP 10: Start Laravel Server

```powershell
# Still in C:\projects\pos-system-backend

php artisan serve
```

**You should see:**
```
Server running at http://localhost:8000
```

✅ **Leave this terminal open!**

---

## STEP 11: Start React Server

**Open NEW PowerShell terminal** and run:

```powershell
cd "C:\Users\Jannat\Pictures\pos-system1123456789"
npm start
```

Your browser should open automatically to `http://localhost:3000`

✅ **Leave this terminal open too!**

---

## STEP 12: Test Login

1. Click **Login** button
2. Use these credentials:
   
   **Email:** `admin@pos.com`
   **Password:** `password123`

3. Click **Login**

✅ **If this works, you're done!**

---

## 🎉 SUCCESS!

Both servers are running:
- React Frontend: `http://localhost:3000` ✅
- Laravel Backend: `http://localhost:8000/api` ✅
- MySQL Database: Connected ✅

You have a working POS system with real database!

---

## ⚠️ Common Issues & Fixes

### "Connection refused"
**Fix:** Make sure XAMPP MySQL is running (green indicator)

### "Port 8000 in use"
**Fix:** 
```powershell
php artisan serve --port=8001
# Then update .env.local REACT_APP_API_URL to :8001
```

### "Database doesn't exist"
**Fix:** 
1. Go to phpMyAdmin again
2. Create database: `pos_system_db`
3. Run: `php artisan migrate`

### "CORS error"
**Fix:** Restart Laravel server with Ctrl+C then `php artisan serve`

### Login doesn't work
**Fix:** 
1. Try: `php artisan db:seed` again
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try login again

---

## 📊 Verify Everything Works

**Checklist:**
- [ ] XAMPP Apache green
- [ ] XAMPP MySQL green
- [ ] Laravel terminal shows "Server running"
- [ ] React terminal shows "Compiled successfully"
- [ ] Browser shows app at :3000
- [ ] Can login with admin@pos.com
- [ ] No errors in browser console (F12)

---

## 🛑 To Stop Everything

Press `Ctrl+C` in each terminal to stop servers.

To restart:
- Terminal 1: `php artisan serve`
- Terminal 2: `npm start`

---

## ✅ You're All Set!

**Total setup time: ~30 minutes**

Enjoy your working POS system with real database! 🎉

