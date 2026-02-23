<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model 
{
    protected $fillable = [
        'user_id',
        'address',
        'phone',
        'status',
        'price',
        'total', // Added total field
        'url',
        'payment_method',
        'payment_channel',
        'postal_code',
        'first_name',
        'last_name',
        'email',
        'address_description',
        'city',
        'country',
        'products_name', // Added products_name field
    ];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($order) {
            foreach ($order->orderProducts as $orderProduct) {
                $productVariant = $orderProduct->productVariant;
                if ($productVariant) {
                    $productVariant->increment('stock', $orderProduct->quantity);
                }
            }
        });
    }

    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }
    
    public function user() 
    {
        return $this->belongsTo(User::class);
    }
}