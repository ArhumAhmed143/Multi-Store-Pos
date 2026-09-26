# Advanced Setup & Troubleshooting

This guide covers advanced configurations, debugging, and common issues.

---

## Table of Contents
1. [XAMPP Advanced Configuration](#xampp-advanced-configuration)
2. [Laravel Advanced Features](#laravel-advanced-features)
3. [debugging Tips](#debugging-tips)
4. [Performance Optimization](#performance-optimization)
5. [Database Optimization](#database-optimization)
6. [Security Hardening](#security-hardening)
7. [Deployment Preparation](#deployment-preparation)

---

## XAMPP Advanced Configuration

### Using Different PHP Version

If you have multiple PHP versions, specify in XAMPP:

1. Open `C:\xampp\apache\conf\httpd.conf`
2. Find the PHP line and verify the version
3. Restart Apache

### Enable HTTPS (SSL)

For local development with HTTPS:

1. Go to `C:\xampp\apache\conf\extra\httpd-ssl.conf`
2. Uncomment the SSL module
3. Generate self-signed certificate:
```bash
cd C:\xampp\apache\bin
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem
```
4. Update `REACT_APP_API_URL=https://localhost:8000/api`

### MySQL Backup
```bash
# Backup database
mysqldump -u root pos_system_db > backup.sql

# Restore database
mysql -u root pos_system_db < backup.sql
```

---

## Laravel Advanced Features

### Add Pagination to Products

**Update ProductController:**
```php
public function index(Request $request)
{
    $perPage = $request->get('per_page', 15);
    $products = Product::with('store')->paginate($perPage);
    
    return response()->json([
        'message' => 'Products retrieved successfully',
        'data' => $products->items(),
        'pagination' => [
            'current_page' => $products->currentPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
            'last_page' => $products->lastPage(),
        ],
    ], Response::HTTP_OK);
}
```

**Use in React:**
```javascript
const fetchProducts = async (page = 1) => {
  const response = await api.get('/products', {
    params: { page, per_page: 10 }
  });
  setProducts(response.data.data);
  setPagination(response.data.pagination);
};
```

### Add Search/Filter

**Update ProductController:**
```php
public function index(Request $request)
{
    $query = Product::with('store');
    
    if ($request->has('search')) {
        $search = $request->get('search');
        $query->where('name', 'like', "%$search%");
    }
    
    if ($request->has('store_id')) {
        $query->where('store_id', $request->get('store_id'));
    }
    
    if ($request->has('min_price')) {
        $query->where('price', '>=', $request->get('min_price'));
    }
    
    if ($request->has('max_price')) {
        $query->where('price', '<=', $request->get('max_price'));
    }
    
    $products = $query->get();
    
    return response()->json([
        'message' => 'Products retrieved successfully',
        'data' => $products,
    ], Response::HTTP_OK);
}
```

### Add Sorting

```php
public function index(Request $request)
{
    $query = Product::with('store');
    
    $sortBy = $request->get('sort_by', 'created_at');
    $sortOrder = $request->get('sort_order', 'desc');
    
    $query->orderBy($sortBy, $sortOrder);
    
    $products = $query->get();
    
    return response()->json([
        'message' => 'Products retrieved successfully',
        'data' => $products,
    ], Response::HTTP_OK);
}
```

### Add Request Validation Classes

**Create FormRequest:**
```bash
php artisan make:request CreateProductRequest
```

**`app/Http/Requests/CreateProductRequest.php`:**
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:products',
            'price' => 'required|numeric|min:0.01|max:99999.99',
            'stock' => 'required|integer|min:0',
            'store_id' => 'required|exists:stores,id',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Product name is required',
            'name.unique' => 'This product name already exists',
            'price.required' => 'Price is required',
            'stock.required' => 'Stock quantity is required',
        ];
    }
}
```

**Use in Controller:**
```php
use App\Http\Requests\CreateProductRequest;

public function store(CreateProductRequest $request)
{
    $product = Product::create($request->validated());
    return response()->json([...], Response::HTTP_CREATED);
}
```

---

## Debugging Tips

### Enable Query Logging

**In `.env`:**
```env
DB_QUERY_LOGGING=true
```

**Or in controller:**
```php
use Illuminate\Support\Facades\DB;

DB::enableQueryLog();

// Your code here

dd(DB::getQueryLog());
```

### Use Tinker for Testing

```bash
php artisan tinker
```

```php
# Get all users
User::all()

# Get specific user
$user = User::find(1)

# Create new user
User::create(['name' => 'Test', 'email' => 'test@test.com', 'password' => Hash::make('password'), 'role' => 'cashier'])

# Update user
$user = User::find(1)
$user->update(['name' => 'New Name'])

# Delete user
User::find(1)->delete()

# Query products
Product::where('price', '>', 5)->get()

# Relationships
$user->stores()
$store->products()->count()

exit
```

### API Testing with Postman/Insomnia

**1. Set up Base URL:**
```
http://localhost:8000/api
```

**2. Login and get Token:**
```
POST /login
Body:
{
  "email": "admin@pos.com",
  "password": "password123"
}
```

**3. Copy token from response, set as Environment Variable:**
```
TOKEN = eyJhbGc...
```

**4. Use token in requests:**
```
Authorization: Bearer {{TOKEN}}
```

**5. Test endpoints:**
```
GET /products
GET /stores
POST /orders
etc.
```

### Laravel Log File

Check logs in `storage/logs/laravel.log`:

```bash
# Watch logs in real-time
tail -f storage/logs/laravel.log

# Or in PowerShell
Get-Content storage/logs/laravel.log -Wait
```

### Browser DevTools

**Network Tab:**
- See all API requests
- Check headers and body
- Verify response status codes

**Console Tab:**
- Check for JavaScript errors
- Run custom code: `JSON.parse(localStorage.getItem('authToken'))`
- Check logged data

**Application Tab:**
- View localStorage
- See cookies
- Check IndexedDB

---

## Performance Optimization

### Database Optimization

**Add Indexes:**
```php
// In migrations
$table->index('email');
$table->index('store_id');
$table->index('created_at');
```

**Use Eager Loading:**
```php
// Bad - N+1 Query Problem
$products = Product::all(); // 1 query
foreach ($products as $product) {
    echo $product->store->name; // 100 queries
}

// Good - Eager Load
$products = Product::with('store')->get(); // 2 queries
foreach ($products as $product) {
    echo $product->store->name;
}
```

### API Response Caching

```php
use Illuminate\Support\Facades\Cache;

public function index()
{
    $products = Cache::remember('products_list', 3600, function () {
        return Product::with('store')->get();
    });
    
    return response()->json([
        'message' => 'Products retrieved successfully',
        'data' => $products,
    ]);
}
```

### Frontend Optimization

**Memoize Components:**
```javascript
const ProductList = React.memo(({ products }) => (
  <div>
    {products.map(p => <Product key={p.id} product={p} />)}
  </div>
));
```

**Debounce Search:**
```javascript
import { debounce } from 'lodash';

const handleSearch = debounce(async (query) => {
  const response = await productService.search(query);
  setResults(response.data);
}, 500);
```

---

## Database Optimization

### Add Soft Deletes (optional)

For products/orders that shouldn't be permanently deleted:

**Migration:**
```php
Schema::table('products', function (Blueprint $table) {
    $table->softDeletes();
});
```

**Model:**
```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
}
```

### Regular Backups

**Weekly backup script:**
```bash
# backup.sh (Linux/Mac)
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -u root pos_system_db > /backups/pos_system_db_$TIMESTAMP.sql
```

---

## Security Hardening

### Input Validation

All controllers should validate input:
```php
$request->validate([
    'email' => 'required|email|max:255',
    'name' => 'required|string|max:100',
    'price' => 'required|numeric|min:0',
]);
```

### Rate Limiting

**In routes:**
```php
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});
```

### SQL Injection Prevention

✓ Always use prepared statements (Eloquent does this)
✓ Never use `DB::raw()` with user input
✓ Use parameterized queries

```php
// Bad
$products = Product::whereRaw("name = " . $name)->get();

// Good
$products = Product::where('name', $name)->get();
```

### HTTPS in Production

```php
// In AppServiceProvider.php
if (config('app.env') === 'production') {
    \URL::forceScheme('https');
}
```

### Environment Variables

Never commit:
- `.env` file
- API keys
- Database passwords
- JWT secrets

---

## Deployment Preparation

### Production Checklist

- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Update `APP_URL` to production domain
- [ ] Update `CORS_ALLOWED_ORIGINS` to production domain
- [ ] Update database credentials for production database
- [ ] Enable HTTPS/SSL
- [ ] Set strong database password
- [ ] Create admin user manually (don't seed in production)
- [ ] Run `php artisan cache:clear`
- [ ] Run `php artisan config:cache`
- [ ] Run `npm run build` for React

### Deployment Platforms

**Popular Options:**
1. **DigitalOcean** - VPS hosting ($5-12/month)
2. **Heroku** - Easy deployment (free tier available)
3. **AWS** - Scalable cloud platform
4. **Shared Hosting** - With PHP/MySQL support

**Basic DigitalOcean Steps:**
```bash
# SSH into server
ssh root@your_server_ip

# Install dependencies
apt-get update
apt-get install -y php php-mysql mysql-server nginx composer

# Clone your projects
git clone your_repo_url

# Install PHP dependencies
cd pos-system-backend
composer install

# Configure .env for production
nano .env

# Run migrations
php artisan migrate

# Install React and build
cd ../pos-system-frontend
npm install
npm run build
```

---

## Useful Commands Summary

```bash
# Laravel
php artisan migrate                 # Run migrations
php artisan migrate:refresh        # Reset and re-run
php artisan tinker                 # Interactive shell
php artisan serve                  # Start dev server
php artisan cache:clear            # Clear cache
php artisan db:seed                # Run seeders
php artisan make:migration name    # Create migration
php artisan make:model ModelName   # Create model
php artisan make:controller name   # Create controller

# React
npm start                          # Start dev server
npm run build                      # Build for production
npm test                           # Run tests
npm install package-name           # Install package
```

---

## Support Resources

- **Laravel Docs:** https://laravel.com/docs
- **React Docs:** https://react.dev
- **MySQL Docs:** https://dev.mysql.com/doc
- **Postman:** https://www.postman.com
- **Stack Overflow:** https://stackoverflow.com

