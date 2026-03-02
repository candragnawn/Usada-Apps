<?php

namespace Database\Seeders;

use App\Models\Doctor;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors = [
            [
                'name' => 'Jro Gede Yudi',
                'specialization' => 'Praktisi Usada',
                'experience' => 23,
                'expertise' => ['Pengobatan Herbal', 'Usada Bali', 'Pengobatan Non-Medis'],
                'rating' => 4.8,
                'consultations' => 247,
                'price' => 150000,
                'available' => true,
                'nextAvailable' => now()->addHours(2),
                'image' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150',
                'description' => 'Spesialis pengobatan tradisional Bali dengan ramuan herbal alami.'
            ],
            [
                'name' => 'Ni Made Sari Dewi',
                'specialization' => 'Praktisi Usada & Jamu',
                'experience' => 12,
                'expertise' => ['Jamu Tradisional', 'Usada Wanita', 'Herbal Detox'],
                'rating' => 4.9,
                'consultations' => 189,
                'price' => 125000,
                'available' => true,
                'nextAvailable' => now()->addHours(5),
                'image' => 'https://images.unsplash.com/photo-1594824919066-0c35ba4a7e7d?w=150&h=150',
                'description' => 'Ahli pengobatan herbal khusus untuk kesehatan wanita dan detoksifikasi alami.'
            ]
        ];

        foreach ($doctors as $doctor) {
            Doctor::create($doctor);
        }
    }
}
