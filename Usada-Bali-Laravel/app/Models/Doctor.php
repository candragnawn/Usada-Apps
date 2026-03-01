<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'name',
        'specialization',
        'experience',
        'expertise',
        'rating',
        'consultations',
        'price',
        'available',
        'nextAvailable',
        'image',
        'description',
    ];
}
