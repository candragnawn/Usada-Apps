<?php

use App\Http\Controllers\API\ArticleController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BestSellerController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes API untuk aplikasi kamu. Public dan protected route sudah dipisah
| dan menggunakan middleware `auth:sanctum` untuk proteksi.
|
*/

// Test route untuk debugging (public)
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working',
        'timestamp' => now(),
        'server' => 'Laravel API Server'
    ]);
});

// Public routes (tidak perlu login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::post('/doctors', [DoctorController::class, 'store']);

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now()
    ]);
});

// Public Product & Category Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{categoryId}', [ProductController::class, 'productsByCategory']);
Route::post('/products/search', [ProductController::class, 'search']);

Route::get('/categories', [CategoryController::class, 'index']);

// Public Article Routes
Route::prefix('articles')->group(function () {
    Route::get('/', [ArticleController::class, 'getArticles']);
    Route::get('/latest', [ArticleController::class, 'getLatestArticles']);
    Route::get('/popular', [ArticleController::class, 'getPopularArticles']);
    Route::get('/categories', [ArticleController::class, 'getCategories']);
    Route::get('/search', [ArticleController::class, 'searchArticles']);
    Route::get('/category/{category}', [ArticleController::class, 'getArticlesByCategory']);
    Route::get('/{slug}', [ArticleController::class, 'getArticle']);
});

// Best Sellers Route
Route::get('/best-sellers', [BestSellerController::class, 'index']);

// Xendit webhook (no auth required) - PENTING: Tetap di atas middleware auth
Route::post('/xendit/callback', [OrderController::class, 'webhookPayment']);

// Routes yang butuh autentikasi (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // Test route untuk user yang sudah login
    Route::get('/auth-test', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Authenticated API is working',
            'user' => $request->user(),
            'timestamp' => now()
        ]);
    });
    
    // Auth Controller protected routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile/update', [AuthController::class, 'updateProfile']);
    Route::put('/profile/change-password', [AuthController::class, 'changePassword']);
    Route::delete('/profile/delete', [AuthController::class, 'deleteAccount']);
    
    // Token refresh route
    Route::post('/refresh', function (Request $request) {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        $token = $user->createToken("auth_token")->plainTextToken;
        
        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => [
                'token' => $token
            ]
        ]);
    });

    // Get current user info
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    });

    // CategoryController (only create, update, delete)
    Route::resource("categories", CategoryController::class)->only([
        'store',
        'update',
        'destroy'
    ]);

    // Order management routes - DISESUAIKAN DENGAN CONTROLLER METHODS
    Route::prefix('orders')->group(function () {
        // Create new order (POST /orders)
        Route::post('/', [OrderController::class, 'createOrder']);
        
        // Get user orders with pagination (GET /orders)
        Route::get('/', [OrderController::class, 'getUserOrders']);
        
        // Get specific order details (GET /orders/{id})
        Route::get('/{id}', [OrderController::class, 'getOrderDetails']);
        
        // Generate payment invoice/link (POST /orders/{id}/pay)
        Route::post('/{id}/pay', [OrderController::class, 'payOrder']);
        
        // Cancel order (PUT /orders/{id}/cancel)
        Route::put('/{id}/cancel', [OrderController::class, 'cancelOrder']);

         Route::get('/orders/{id}/status', [OrderController::class, 'checkStatus']);

          Route::get('/orders/{id}/sync', [OrderController::class, 'syncOrderStatus']);
    });
    
    // ProductController protected routes (admin only)
    Route::middleware('admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });

    // User dashboard route
    Route::get('/user/dashboard', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $request->user(),
                'recent_orders' => [], // Implement this in controller if needed
                'statistics' => []     // Implement this in controller if needed
            ]
        ]);
    });
});