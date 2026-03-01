<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consultation extends Model
{
    protected $fillable = [
        'user_id',
        'doctor_id',
        'status',
        'amount',
        'payment_link',
        'firebase_chat_id',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

   
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
}
