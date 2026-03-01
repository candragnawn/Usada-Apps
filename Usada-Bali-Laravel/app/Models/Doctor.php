<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     *
     * @var array
     */
    protected $casts = [
        'expertise' => 'array',
        'available' => 'boolean',
        'nextAvailable' => 'datetime',
        'rating' => 'float',
        'price' => 'float',
    ];

    
    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }
}
