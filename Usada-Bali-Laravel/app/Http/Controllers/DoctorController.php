<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index() {
        $doctors = Doctor::all();
        return response()->json($doctors);

    }

    public function store(Request $request) {

        $validated = $request->validate([
        'name' => 'required|string',
        'specialization' => 'required|string',
        'experience' => 'required|integer',
        'expertise' => 'required|string',
        'rating' => 'required|decimal:2',
        'consultations' => 'required|integer',
        'price' => 'required|decimal:2',
        'available' => 'required|boolean',
        'nextAvailable' => 'required|date',
        'image' => 'required|string',
        'description' => 'required|string',

        ]);
        $doctor = Doctor::create($validated);
        return response()->json([
            'message' => 'Dokter berhasil ditambahkan',
            'data' => $doctor

        ], 201);

    
        
    }
}
