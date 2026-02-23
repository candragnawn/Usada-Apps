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
        'images' => 'array'
    ];

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
                        Storage::disk('public')->delete($imagePath);
                    }
                }
            }
        });
    }
    
    
}

