<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('index_Product', function() {
  return view('products.index');
});

Route::prefix("admin")->middleware('auth')->group(function () {
  Route::get('/',  DashboardController::class)->name('dashboard');
  Route::post('/login', [DashboardController::class, 'login'])->name('login');
  Route::resource('categories', CategoryController::class);
  Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
  Route::resource('articles', ArticleController::class);
  Route::delete('/articles/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy');

  Route::resource('products', ProductController::class);
  Route::post('/logout',[AuthController::class,'logout'])->name('logout');
});

Route::get('/login',[AuthController::class,'index'])->middleware('guest');
Route::post('/login',[AuthController::class,'login'])->name('login')->middleware('guest');
Route::post('/forgot-password',[AuthController::class,'forgotpassword']);

Route::get('/media/{path}', function ($path) {
    if (empty($path)) abort(404);
    
    $cleanPath = str_replace(['../', '..\\'], '', $path);
    $filename = basename($cleanPath);
    $dir = storage_path('app/public/products');
    
    $files = is_dir($dir) ? scandir($dir) : [];
    foreach ($files as $f) {
        if (trim($f) === trim($filename) || str_contains($f, $filename)) {
            $fullPath = $dir . DIRECTORY_SEPARATOR . $f;
            if (file_exists($fullPath) && !is_dir($fullPath)) {
                $mime = ($f && str_ends_with($f, '.png')) ? 'image/png' : 'image/jpeg';
                
                // Ensure no previous output or buffering interferes with binary data
                while (ob_get_level()) ob_end_clean();
                
                return response(file_get_contents($fullPath))
                    ->header('Content-Type', $mime)
                    ->header('Access-Control-Allow-Origin', '*');
            }
        }
    }
    
    abort(404, "File not found: " . $path);
})->where('path', '.*');
