<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'name',
        'is_active',
        'description',
        'company',
        'category_id',
        'price',
        'images'
    ];
    

    protected $casts = [
        'images' => 'array',
        'is_active' => 'boolean'
    ];

    /**
     * Transform images array to full URLs
     * Converts relative paths like 'products/filename.jpg' to full URLs
     */
    public function getImagesAttribute($value)
    {
        if (!$value) {
            return [];
        }
        
        // Ensure we have an array
        $images = is_array($value) ? $value : json_decode($value, true);
        
        if (!is_array($images)) {
            return [];
        }
        
        // Get base URL from config, fallback to current APP_URL
        $baseUrl = rtrim(config('app.url'), '/') . '/storage';
        
        // Transform each image path to full URL
        return array_map(function ($image) use ($baseUrl) {
            if (empty($image)) {
                return null;
            }
            
            // If already full URL, return as is
            if (strpos($image, 'http') === 0) {
                return $image;
            }
            
            // Remove leading slash and build full URL
            $cleanPath = ltrim($image, '/');
            return "{$baseUrl}/{$cleanPath}";
        }, $images);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($product) {
            if (!empty($product->images)) {
                foreach ($product->images as $imagePath) {
                    if (Storage::disk('public')->exists($imagePath)) {
                        Storage::disk(name: 'public')->delete($imagePath);
                    }
                }
            }
        });
    }
    
    
}

