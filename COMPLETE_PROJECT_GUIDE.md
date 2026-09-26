# Complete Project Organization Guide

This guide shows the complete file structure for your Laravel POS backend and how all pieces fit together.

---

## Laravel Project Structure

```
pos-system-backend/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php          ← Authentication APIs
│   │   │       ├── ProductController.php       ← Product CRUD APIs
│   │   │       ├── StoreController.php         ← Store CRUD APIs
│   │   │       ├── OrderController.php         ← Order CRUD APIs
│   │   │       └── NotificationController.php  ← Notification APIs
│   │   ├── Middleware/
│   │   │   └── Cors.php                        ← CORS configuration
│   │   └── Requests/                           ← Form requests (validation)
│   │
│   ├── Models/
│   │   ├── User.php                            ← User model with relationships
│   │   ├── Store.php                           ← Store model
│   │   ├── Product.php                         ← Product model
│   │   ├── Order.php                           ← Order model
│   │   ├── OrderItem.php                       ← OrderItem model
│   │   └── Notification.php                    ← Notification model
│   │
│   ├── Providers/
│   │   └── RouteServiceProvider.php            ← Route configuration
│   │
│   └── Exceptions/
│       └── Handler.php                         ← Error handling
│
├── config/
│   ├── app.php                                 ← App configuration
│   ├── database.php                            ← Database configuration
│   ├── cors.php                                ← CORS settings
│   └── auth.php                                ← Authentication config
│
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_stores_table.php
│   │   ├── 2024_01_01_000003_create_products_table.php
│   │   ├── 2024_01_01_000004_create_orders_table.php
│   │   ├── 2024_01_01_000005_create_order_items_table.php
│   │   └── 2024_01_01_000006_create_notifications_table.php
│   │
│   ├── seeders/
│   │   └── DatabaseSeeder.php                  ← Sample data
│   │
│   └── factories/
│       └── UserFactory.php                     ← User factory
│
├── routes/
│   └── api.php                                 ← API routes
│
├── .env                                        ← Environment variables
├── .env.example                                ← Example environment
├── composer.json                               ← PHP dependencies
├── artisan                                     ← Laravel CLI
└── public/
    └── index.php                               ← Entry point
```

---

## Step-by-Step Installation

### Prerequisites
- XAMPP (Apache, MySQL, PHP)
- Composer
- Git
- Node.js (for React)

### 1. Create Laravel Project
```bash
composer create-project laravel/laravel pos-system-backend
cd pos-system-backend
```

### 2. Install Required Packages
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Copy All Files

**Models** - Copy to `app/Models/`:
- User.php
- Store.php
- Product.php
- Order.php
- OrderItem.php
- Notification.php

**Controllers** - Copy to `app/Http/Controllers/Api/`:
- AuthController.php
- ProductController.php
- StoreController.php
- OrderController.php
- NotificationController.php

**Migrations** - Copy to `database/migrations/`:
- All migration files

**Routes** - Replace `routes/api.php` with the provided file

### 4. Configure Environment

Edit `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_system_db
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Create Database
```bash
# Go to phpmyadmin: http://localhost/phpmyadmin
# Create database: pos_system_db
```

### 6. Run Migrations
```bash
php artisan migrate
```

### 7. (Optional) Create Test Users
```bash
php artisan tinker
```

Then run:
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Admin User',
    'email' => 'admin@pos.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
]);

User::create([
    'name' => 'Manager User',
    'email' => 'manager@pos.com',
    'password' => Hash::make('password123'),
    'role' => 'manager',
]);

User::create([
    'name' => 'Cashier User',
    'email' => 'cashier@pos.com',
    'password' => Hash::make('password123'),
    'role' => 'cashier',
]);

exit
```

### 8. Test the Backend
```bash
php artisan serve
# Should show: Server running at http://localhost:8000
```

---

## React Frontend Structure

```
pos-system-frontend/
│
├── src/
│   ├── services/
│   │   └── api.js                              ← Updated API service
│   │
│   ├── context/
│   │   └── AuthContext.js                      ← Updated auth context
│   │
│   ├── components/
│   │   ├── Layout.js
│   │   ├── Login.js                            ← Updated login component
│   │   └── PWAInstallPrompt.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js               ← Update to use API
│   │   │   └── ManageStoreManagers.js
│   │   │
│   │   ├── manager/
│   │   │   ├── ManagerDashboard.js             ← Update to use API
│   │   │   ├── ManageProducts.js               ← Update to use API
│   │   │   ├── ManageStores.js
│   │   │   ├── ManagerNotifications.js
│   │   │   ├── ViewStock.js
│   │   │   └── ManagerReports.js
│   │   │
│   │   └── cashier/
│   │       ├── CashierDashboard.js             ← Update to use API
│   │       ├── ManageOrders.js                 ← Update to use API
│   │       ├── SearchProduct.js                ← Update to use API
│   │       ├── CashierStock.js
│   │       ├── CashierNotifications.js         ← Update to use API
│   │       └── CashierReports.js
│   │
│   ├── App.js
│   ├── index.js
│   └── index.css
│
├── public/
│   ├── index.html
│   └── manifest.json
│
├── .env.local                                  ← Environment variables
├── package.json
└── README.md
```

---

## Database Relationships Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ name        │
│ email       │
│ password    │
│ role        │◄─────────────┐
└─────────────┘              │
      │                       │
      │ (1 manager)           │
      │ One-to-Many          │
      └────────┐              │
               │              │
         ┌─────────────┐       │
         │   Stores    │       │
         ├─────────────┤       │
         │ id (PK)     │       │
         │ name        │       │
         │ location    │       │
         │ manager_id (FK)─────┘
         └─────────────┘
               │
               │ (1 store)
               │ One-to-Many
               └────────┐
                        │
                  ┌──────────────┐
                  │  Products    │
                  ├──────────────┤
                  │ id (PK)      │
                  │ name         │
                  │ price        │
                  │ stock        │
                  │ store_id (FK)│
                  └──────────────┘
                        │
                        │
                        │ (product)
                        │ Many-to-Many (via OrderItems)
                        │
                  ┌──────────────┐
                  │ OrderItems   │
                  ├──────────────┤
                  │ id (PK)      │
                  │ order_id (FK)├─────────┐
                  │ product_id(FK)        │
                  │ quantity     │        │
                  │ price        │        │
                  └──────────────┘        │
                        │                 │
                        │                 │
         ┌──────────────────────┐         │
         │      Orders          │         │
         ├──────────────────────┤         │
         │ id (PK)              │◄────────┘
         │ cashier_id (FK)  ────────────┐
         │ total_amount     │        │
         │ status           │    (cashier)
         └──────────────────┘   One-to-Many
                │                   │
                │                   │
                └───────────┬────────┘
                            │
                            │
                      ┌─────────────┐
                      │  Users      │
                      ├─────────────┤
                      │ id (PK)     │
                      │ name        │
                      │ email       │
                      │ password    │
                      │ role        │
                      └─────────────┘
                            │
                            │ (1 user)
                            │ One-to-Many
                            └────────┐
                                     │
                           ┌──────────────────┐
                           │ Notifications    │
                           ├──────────────────┤
                           │ id (PK)          │
                           │ user_id (FK)    │
                           │ message          │
                           │ is_read          │
                           └──────────────────┘
```

---

## API Request/Response Examples

### Login
**Request:**
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@pos.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@pos.com",
      "role": "admin",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGc..."
  }
}
```

### Get Products
**Request:**
```http
GET /api/products
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Coffee",
      "price": "3.50",
      "stock": 100,
      "store_id": 1,
      "store": {
        "id": 1,
        "name": "Main Store",
        "location": "Downtown"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Order
**Request:**
```http
POST /api/orders
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "cashier_id": 2,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 3.50
    },
    {
      "product_id": 5,
      "quantity": 1,
      "price": 5.00
    }
  ]
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "cashier_id": 2,
    "total_amount": "12.00",
    "status": "completed",
    "cashier": {
      "id": 2,
      "name": "Cashier User",
      "email": "cashier@pos.com"
    },
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": "3.50"
      }
    ]
  }
}
```

---

## Useful Commands

### Laravel Commands
```bash
# Start development server
php artisan serve --port=8000

# Run migrations
php artisan migrate

# Create new migration
php artisan make:migration create_table_name

# Create new model
php artisan make:model ModelName

# Create new controller
php artisan make:controller Api/ControllerName

# Clear cache
php artisan cache:clear

# Tinker shell
php artisan tinker
```

### React Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install dependencies
npm install
```

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` file
   - Use `.env.example` template
   - Keep sensitive data in `.env`

2. **Database:**
   - Use strong passwords
   - Limit database user privileges
   - Regular backups

3. **API:**
   - Validate all inputs
   - Use HTTPS in production
   - Implement rate limiting
   - Use proper CORS settings
   - Keep tokens secure

4. **Frontend:**
   - Store tokens in localStorage (vulnerable but convenient)
   - For production, consider sessionStorage
   - Implement token refresh mechanism
   - Validate user input

---

## Next Steps

1. **Set up Laravel backend** following the installation steps
2. **Update React frontend** with new API service
3. **Update all components** to use real APIs
4. **Test thoroughly** before deployment
5. **Add advanced features:**
   - JWT token refresh
   - Advanced filtering/pagination
   - File uploads
   - Real-time notifications

