<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ConsultationController extends Controller
{
    
    public function getUserConsultations(Request $request): JsonResponse
    {
        $consultations = Consultation::where('user_id', $request->user()->id)
            ->with('doctor')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $consultations
        ]);
    }

    /**
     * Store a newly created consultation.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,id',
            'amount' => 'required|numeric|min:0',
            'firebase_chat_id' => 'required|string|unique:consultations,firebase_chat_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $consultation = Consultation::create([
            'user_id' => $request->user()->id,
            'doctor_id' => $request->doctor_id,
            'amount' => $request->amount,
            'firebase_chat_id' => $request->firebase_chat_id,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Konsultasi berhasil dibuat',
            'data' => $consultation
        ], 201);
    }
}
