<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_method',
        'payment_channel',
        'amount',
        'xendit_id',
        'status',
        'payment_url',
        'payment_code',
        'qr_code',
        'expires_at',
        'paid_at',
        'callback_data',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'callback_data' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isPending()
    {
        return $this->status === 'PENDING';
    }

    public function isPaid()
    {
        return $this->status === 'PAID';
    }

    public function isFailed()
    {
        return in_array($this->status, ['FAILED', 'EXPIRED', 'CANCELLED']);
    }
}