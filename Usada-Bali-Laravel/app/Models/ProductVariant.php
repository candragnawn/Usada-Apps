<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'variant_name',
        'product_id',
        'stock',
        'size',
        'weight'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
