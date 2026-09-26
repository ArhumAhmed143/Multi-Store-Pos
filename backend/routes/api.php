<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes - No authentication required
Route::post('/login', [AuthController::class, 'login']);

// Protected routes - Authentication required
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Products routes
    Route::apiResource('products', ProductController::class);

    // Stores routes
    Route::apiResource('stores', StoreController::class);

    // Orders routes
    Route::apiResource('orders', OrderController::class);

    // Notifications routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::put('{notification}', [NotificationController::class, 'update']);
    });

    // Users / Store Managers routes
    Route::apiResource('users', UserController::class);
});
