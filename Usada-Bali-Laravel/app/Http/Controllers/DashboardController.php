<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderProduct;
use App\Models\User;
use App\Models\Order;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Calculate total earnings
        $totalOrder = OrderProduct::get()->sum(fn(OrderProduct $orderProduct) => 
            $orderProduct->quantity * $orderProduct->productVariant->product->price
        );
        
        // Get best selling products
        $best_sellers = OrderProduct::select("product_variant_id")
            ->selectRaw("SUM(quantity) as total_sold")
            ->groupBy("product_variant_id")
            ->orderByDesc("total_sold")
            ->with("productVariant.product") 
            ->limit(5)
            ->get();

        // Get total customers count (users who have placed at least one order)
        $totalCustomers = User::count();  // All customers, including those who haven't ordered

        $totalCustomersWhoOrdered = Order::distinct('user_id')->count('user_id');  // Customers who placed at least one order

        // Calculate the percentage of customers who placed an order
        $orderPercentage = ($totalCustomers > 0) ? ($totalCustomersWhoOrdered / $totalCustomers) * 100 : 0;

        // Get monthly order count for the last 12 months
        $monthlyOrders = Order::selectRaw('COUNT(*) as order_count, MONTH(created_at) as month')
            ->where('created_at', '>=', Carbon::now()->subYear())  // 12 bulan terakhir
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('order_count', 'month')
            ->toArray();

        // Lengkapi bulan yang tidak ada pesanan dengan 0
        $months = range(1, 12);
        $orderCounts = array_fill_keys($months, 0);
        foreach ($monthlyOrders as $month => $count) {
            $orderCounts[$month] = $count;
        }

        return view('index', [
            'total_earning' => $totalOrder,
            'best_sellers' => $best_sellers,
            'total_customers' => $totalCustomers, // All customers
            'total_customers_who_ordered' => $totalCustomersWhoOrdered, // Customers who ordered
            'order_percentage' => round($orderPercentage, 2), // Percentage of customers who ordered
            'monthly_orders' => $orderCounts, // Monthly orders data
        ]);
    }
    
    public function login()
    {
        return view('login.index');
    }
}
