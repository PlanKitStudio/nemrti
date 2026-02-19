<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PhoneNumberController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\TrackingScriptController;
use App\Http\Controllers\Api\PaymentSettingController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Phone numbers (public, cached 5 min)
Route::middleware('http.cache:300')->group(function () {
    Route::get('/phone-numbers', [PhoneNumberController::class, 'index']);
    Route::get('/phone-numbers/featured', [PhoneNumberController::class, 'featured']);
});
Route::get('/phone-numbers/{phoneNumber}', [PhoneNumberController::class, 'show']);

// Categories (public, cached 30 min)
Route::middleware('http.cache:1800')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
});

// Blog posts (public, cached 1 min)
Route::middleware('http.cache:60')->group(function () {
    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blog-posts', [BlogController::class, 'index']);
});
Route::get('/blog/{blogPost:slug}', [BlogController::class, 'show']);
Route::get('/blog-posts/{slug}', [BlogController::class, 'showBySlug']);

// Blog categories (public, cached 30 min)
Route::get('/blog-categories', [BlogController::class, 'categories'])->middleware('http.cache:1800');

// Contact (public)
Route::post('/contact', [ContactController::class, 'store']);

// Pages (public — no browser cache, server-side CacheService handles caching)
Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/{slug}', [PageController::class, 'show']);

// Ads (public)
Route::get('/ads/position/{position}', [AdController::class, 'getByPosition']);
Route::post('/ads/{ad}/impression', [AdController::class, 'trackImpression']);
Route::post('/ads/{ad}/click', [AdController::class, 'trackClick']);
Route::post('/ads/{ad}/conversion', [AdController::class, 'trackConversion']);

// Tracking scripts (public — returns active scripts for a specific page)
Route::get('/tracking-scripts', [TrackingScriptController::class, 'getForPage']);

// Payment settings (public — for checkout page)
Route::get('/payment-settings', [PaymentSettingController::class, 'index']);

// Protected routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/payment-proof', [OrderController::class, 'uploadPaymentProof']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{phoneNumber}', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/check/{phoneNumber}', [FavoriteController::class, 'check']);

    // Coupons (validate for cart)
    Route::post('/coupons/validate', [CouponController::class, 'validate']);
});

// Admin routes (requires admin role)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Phone numbers management
    Route::post('/phone-numbers', [PhoneNumberController::class, 'store']);
    Route::put('/phone-numbers/{phoneNumber}', [PhoneNumberController::class, 'update']);
    Route::delete('/phone-numbers/{phoneNumber}', [PhoneNumberController::class, 'destroy']);

    // Categories management
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Blog management
    Route::get('/blog', [BlogController::class, 'adminIndex']);
    Route::post('/blog', [BlogController::class, 'store']);
    Route::put('/blog/{blogPost:id}', [BlogController::class, 'update']);
    Route::delete('/blog/{blogPost:id}', [BlogController::class, 'destroy']);

    // Orders management
    Route::get('/orders', [OrderController::class, 'all']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Payment settings
    Route::put('/payment-settings', [PaymentSettingController::class, 'update']);

    // Contact messages
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show']);
    Route::put('/contacts/{contact}/status', [ContactController::class, 'updateStatus']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

    // Statistics
    Route::get('/statistics', [StatisticsController::class, 'index']);
    Route::get('/statistics/sales-chart', [StatisticsController::class, 'salesChart']);
    Route::get('/statistics/popular', [StatisticsController::class, 'popularPhoneNumbers']);

    // Pages management
    Route::get('/pages', [PageController::class, 'adminIndex']);
    Route::post('/pages', [PageController::class, 'store']);
    Route::get('/pages/{id}', [PageController::class, 'adminShow']);
    Route::put('/pages/{id}', [PageController::class, 'update']);
    Route::delete('/pages/{id}', [PageController::class, 'destroy']);

    // Coupons management
    Route::get('/coupons', [CouponController::class, 'index']);
    Route::post('/coupons', [CouponController::class, 'store']);
    Route::put('/coupons/{coupon}', [CouponController::class, 'update']);
    Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy']);

    // Users management
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    // Ads management
    Route::get('/ads', [AdController::class, 'index']);
    Route::post('/ads', [AdController::class, 'store']);
    Route::get('/ads/{ad}', [AdController::class, 'show']);
    Route::put('/ads/{ad}', [AdController::class, 'update']);
    Route::delete('/ads/{ad}', [AdController::class, 'destroy']);
    Route::get('/ads-analytics', [AdController::class, 'analytics']);

    // Tracking scripts management
    Route::get('/tracking-scripts', [TrackingScriptController::class, 'index']);
    Route::post('/tracking-scripts', [TrackingScriptController::class, 'store']);
    Route::put('/tracking-scripts/{trackingScript}', [TrackingScriptController::class, 'update']);
    Route::delete('/tracking-scripts/{trackingScript}', [TrackingScriptController::class, 'destroy']);
});
