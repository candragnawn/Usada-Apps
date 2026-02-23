<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Route;

Route::get('index_Product', function() {
  return view('products.index');
});

Route::prefix("admin")->middleware('auth')->group(function () {
  Route::get('/', DashboardController::class)->name('dashboard');
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
