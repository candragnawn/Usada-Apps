<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderProduct;
use Illuminate\Http\Request;

class BestSellerController extends Controller
{
    
    public function index(Request $request)
    {
        $limit = $request->input('limit', 5); 

        $best_sellers = OrderProduct::select("product_variant_id")
            ->selectRaw("SUM(quantity) as total_sold")
            ->groupBy("product_variant_id")
            ->orderByDesc("total_sold")
            ->with("productVariant.product")
            ->limit($limit)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $best_sellers,
            'total_items' => $best_sellers->count()
        ]);
    }
}