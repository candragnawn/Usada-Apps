<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\CreateInvoiceRequest;

class OrderController extends Controller
{
    /**
     * Create a new order
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createOrder(Request $request)
    {
        // Check if user is authenticated
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Log incoming request for debugging
        Log::info('Order creation request received', [
            'user_id' => $user->id,
            'request_data' => $request->all()
        ]);

        
        try {
            $validatedData = $request->validate([
                'phone' => 'required|string|max:20',
                'first_name' => 'required|string|max:100',
                'last_name' => 'nullable|string|max:100',
                'email' => 'required|email|max:255',
                'address' => 'required|string|max:500',
                'city' => 'required|string|max:100',
                'postal_code' => 'required|string|max:10',
                'country' => 'required|string|max:100',
                'price' => 'required|numeric|min:0.01', 
                'products' => 'required|array|min:1',
                'products.*.product_variant_id' => 'required|integer|exists:product_variants,id',
                'products.*.quantity' => 'required|integer|min:1|max:1000',
                'products.*.price' => 'required|numeric|min:0.01', 
                'address_description' => 'nullable|string|max:500',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed for order creation', [
                'user_id' => $user->id,
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
          
            $productVerification = [];
            $calculatedTotal = 0;
            $frontendTotal = floatval($validatedData['price']);
            
            foreach ($validatedData['products'] as $index => $productData) {
                $productVariant = ProductVariant::with('product')
                    ->find($productData['product_variant_id']);
                
                if (!$productVariant) {
                    throw new Exception("Product variant with ID {$productData['product_variant_id']} not found");
                }
                
             
                if ($productVariant->stock < $productData['quantity']) {
                    throw new Exception("Insufficient stock for {$productVariant->product->name}. Available: {$productVariant->stock}, Requested: {$productData['quantity']}");
                }
                
              
                $frontendPrice = floatval($productData['price']);
                $databasePrice = floatval($productVariant->price);
                
                // 🚨 FIXED: Improved price validation logic
                $finalPrice = $frontendPrice; // Default to frontend price
                
                // Only use database price if it's valid (> 0) and reasonably close to frontend price
                if ($databasePrice > 0) {
                    $priceDifference = abs($frontendPrice - $databasePrice);
                    $priceTolerancePercentage = 0.1; // 10% tolerance
                    $priceToleranceAmount = max($databasePrice * $priceTolerancePercentage, 1000); // At least 1000 IDR tolerance
                    
                    if ($priceDifference <= $priceToleranceAmount) {
                        // Prices are close enough, use database price for consistency
                        $finalPrice = $databasePrice;
                        Log::info('Using database price (within tolerance)', [
                            'product_variant_id' => $productData['product_variant_id'],
                            'frontend_price' => $frontendPrice,
                            'database_price' => $databasePrice,
                            'difference' => $priceDifference,
                            'tolerance' => $priceToleranceAmount
                        ]);
                    } else {
                        // Large difference, log warning but use frontend price
                        Log::warning('Price mismatch detected - using frontend price', [
                            'product_variant_id' => $productData['product_variant_id'],
                            'frontend_price' => $frontendPrice,
                            'database_price' => $databasePrice,
                            'difference' => $priceDifference,
                            'tolerance' => $priceToleranceAmount
                        ]);
                    }
                } else {
                    // Database price is 0 or invalid, use frontend price
                    Log::warning('Database price is invalid (0 or negative) - using frontend price', [
                        'product_variant_id' => $productData['product_variant_id'],
                        'frontend_price' => $frontendPrice,
                        'database_price' => $databasePrice
                    ]);
                }
                
                $lineTotal = $finalPrice * $productData['quantity'];
                $calculatedTotal += $lineTotal;
                
                $productVerification[] = [
                    'variant' => $productVariant,
                    'quantity' => $productData['quantity'],
                    'price' => $finalPrice,
                    'line_total' => $lineTotal
                ];
            }

            // 🚨 FIXED: Improved total price validation logic
            $totalDifference = abs($calculatedTotal - $frontendTotal);
            
            Log::info('Price comparison', [
                'frontend_total' => $frontendTotal,
                'calculated_total' => $calculatedTotal,
                'difference' => $totalDifference
            ]);

            // Determine final order total with better logic
            $finalOrderTotal = $frontendTotal; // Default to frontend total
            
            // Only override if calculated total is reasonable and difference is significant
            if ($calculatedTotal > 0) {
                $totalTolerancePercentage = 0.3; // 30% tolerance for taxes/shipping/discounts
                $maxAllowedDifference = $calculatedTotal * $totalTolerancePercentage;
                
                if ($totalDifference > $maxAllowedDifference) {
                    // Large discrepancy - need to decide which total to use
                    if ($frontendTotal > 0 && $frontendTotal >= ($calculatedTotal * 0.5)) {
                        // Frontend total is reasonable, use it
                        Log::warning('Using frontend total despite discrepancy', [
                            'frontend_total' => $frontendTotal,
                            'calculated_total' => $calculatedTotal,
                            'difference' => $totalDifference,
                            'max_allowed_difference' => $maxAllowedDifference
                        ]);
                        $finalOrderTotal = $frontendTotal;
                    } else {
                        // Frontend total seems unreasonable, use calculated
                        Log::warning('Using calculated total due to unreasonable frontend total', [
                            'frontend_total' => $frontendTotal,
                            'calculated_total' => $calculatedTotal,
                            'difference' => $totalDifference
                        ]);
                        $finalOrderTotal = $calculatedTotal;
                    }
                }
            } else {
                // Calculated total is 0, definitely use frontend total
                Log::warning('Calculated total is 0 - using frontend total', [
                    'frontend_total' => $frontendTotal,
                    'calculated_total' => $calculatedTotal
                ]);
                $finalOrderTotal = $frontendTotal;
            }
            
            // 🚨 CRITICAL: Ensure final total is never 0 or negative
            if ($finalOrderTotal <= 0) {
                Log::error('Final order total is invalid', [
                    'final_total' => $finalOrderTotal,
                    'frontend_total' => $frontendTotal,
                    'calculated_total' => $calculatedTotal
                ]);
                throw new Exception('Order total cannot be zero or negative. Please check product prices.');
            }

            // Create order with proper total
            $order = Order::create([
                'user_id' => $user->id,
                'phone' => $validatedData['phone'],
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'] ?? '',
                'email' => $validatedData['email'],
                'address' => $validatedData['address'],
                'city' => $validatedData['city'],
                'postal_code' => $validatedData['postal_code'],
                'country' => $validatedData['country'],
                'status' => 'PENDING',
                'price' => $finalOrderTotal,
                'total' => $finalOrderTotal,
                'address_description' => $validatedData['address_description'] ?? null,
            ]);

            // Process each verified product
            $productsName = [];
            $orderProducts = [];

            foreach ($productVerification as $productInfo) {
                $productVariant = $productInfo['variant'];
                
                // Decrease stock
                $productVariant->decrement('stock', $productInfo['quantity']);
                
                // Collect product names
                $productsName[] = $productVariant->product->name;
                
                // Prepare order product data
                $orderProducts[] = [
                    'order_id' => $order->id,
                    'product_variant_id' => $productVariant->id,
                    'quantity' => $productInfo['quantity'],
                    'price' => $productInfo['price'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert all order products in batch
            OrderProduct::insert($orderProducts);

            // Update order with product names
            $order->update([
                'products_name' => implode(', ', $productsName),
            ]);

            DB::commit();

            Log::info('Order created successfully', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'total_amount' => $order->price,
                'products_count' => count($orderProducts)
            ]);

            // Return consistent response structure that matches OrderContext expectations
            return response()->json([
                'success' => true,
                'message' => 'Order successfully created!',
                'data' => $order->load('orderProducts.productVariant.product'),
                'order' => $order->load('orderProducts.productVariant.product')
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Order creation failed', [
                'user_id' => $user->id,
                'error_message' => $e->getMessage(),
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate payment invoice for an order
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function payOrder($id)
    {
        DB::beginTransaction();
        
        try {
            $user = Auth::user();
            $order = Order::where('user_id', $user->id)->findOrFail($id);

            Log::info('Payment request received', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'current_status' => $order->status,
                'order_total' => $order->price
            ]);

            // Check if order is already paid
            if ($order->status === "PAID") {
                return response()->json([
                    'success' => false,
                    'message' => 'Order already paid'
                ], 400);
            }

            // Return existing invoice URL with EXACT structure that OrderContext expects
            if ($order->url) {
                Log::info('Returning existing invoice URL', [
                    'order_id' => $order->id,
                    'invoice_url' => $order->url
                ]);
                
                return response()->json([
                    'success' => true,
                    'invoice_url' => $order->url,
                    'invoiceUrl' => $order->url,
                    'url' => $order->url,
                    'message' => 'Invoice already generated'
                ], 200);
            }

            // 🚨 FIXED: Better validation for order total
            if ($order->price <= 0) {
                Log::error('Invalid order total for payment', [
                    'order_id' => $order->id,
                    'order_total' => $order->price,
                    'order_data' => $order->toArray()
                ]);
                throw new Exception("Invalid order total: {$order->price}. Please contact support.");
            }

            // Set up Xendit configuration
            Configuration::setXenditKey(env('XENDIT_API_KEY'));
            $apiInstance = new InvoiceApi();
            
            // Create invoice request
            $createInvoiceRequest = new CreateInvoiceRequest([
                'external_id' => (string) $order->id,
                'description' => "Payment for Order #{$order->id} - {$order->products_name}",
                'amount' => $order->price,
                'invoice_duration' => 172800, // 48 hours
                'currency' => 'IDR',
                'reminder_time' => 1,
                'payer_email' => $order->email,
                'success_redirect_url' => env('APP_URL') . '/order-success/' . $order->id,
                'failure_redirect_url' => env('APP_URL') . '/order-failed/' . $order->id,
            ]);

            // Generate invoice via Xendit API
            $result = $apiInstance->createInvoice($createInvoiceRequest);
            
            if (!isset($result['invoice_url'])) {
                throw new Exception('Invalid response from payment gateway - no invoice_url found');
            }
            
            $invoiceUrl = $result['invoice_url'];
            
            // Save invoice URL to order
            $order->update(['url' => $invoiceUrl]);

            DB::commit();

            Log::info('Invoice generated successfully', [
                'order_id' => $order->id,
                'invoice_url' => $invoiceUrl,
                'amount' => $order->price
            ]);

            // Return response structure that EXACTLY matches OrderContext expectations
            return response()->json([
                'success' => true,
                'invoice_url' => $invoiceUrl,
                'invoiceUrl' => $invoiceUrl,
                'url' => $invoiceUrl,
                'message' => 'Invoice generated successfully',
                'data' => [
                    'invoice_url' => $invoiceUrl,
                    'order_id' => $order->id,
                    'amount' => $order->price
                ]
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Invoice generation failed', [
                'order_id' => $id,
                'user_id' => Auth::id(),
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    public function webhookPayment(Request $request)
{
    try {
        // Log semua webhook yang masuk
        Log::info('Webhook received', [
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
            'ip' => $request->ip()
        ]);

        // Verify webhook signature dengan multiple methods
        $signatureHeader = $request->header('x-callback-token') ?? 
                          $request->header('X-Callback-Token');
        $secret = env('XENDIT_WEBHOOK_TOKEN');
        
        if (!$signatureHeader || $signatureHeader !== $secret) {
            Log::warning('Webhook signature mismatch', [
                'expected' => $secret,
                'received' => $signatureHeader,
                'ip' => $request->ip()
            ]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $payload = $request->all();
        
        // Validate required fields
        if (!isset($payload['external_id']) || !isset($payload['status'])) {
            Log::error('Invalid webhook payload - missing required fields', [
                'payload' => $payload
            ]);
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        // Find the order
        $order = Order::find($payload['external_id']);
        if (!$order) {
            Log::error('Order not found for webhook', [
                'external_id' => $payload['external_id'],
                'payload' => $payload
            ]);
            return response()->json(['message' => 'Order not found'], 404);
        }

        $oldStatus = $order->status;
        $newStatus = strtoupper($payload['status']);

        // Log status change
        Log::info("Processing webhook for order", [
            'order_id' => $order->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'payment_data' => [
                'channel' => $payload['payment_channel'] ?? null,
                'method' => $payload['payment_method'] ?? null,
                'amount' => $payload['amount'] ?? null
            ]
        ]);

        // Only update if status actually changed
        if ($oldStatus !== $newStatus) {
            $order->update([
                'status' => $newStatus,
                'payment_channel' => $payload['payment_channel'] ?? $order->payment_channel,
                'payment_method' => $payload['payment_method'] ?? $order->payment_method,
                'updated_at' => now()
            ]);

            Log::info("Order status updated successfully", [
                'order_id' => $order->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus
            ]);
        } else {
            Log::info("Order status unchanged", [
                'order_id' => $order->id,
                'status' => $oldStatus
            ]);
        }

        return response()->json([
            'message' => 'Webhook processed successfully',
            'order_id' => $order->id,
            'status' => $order->status
        ], 200);

    } catch (Exception $e) {
        Log::error('Webhook processing failed', [
            'error_message' => $e->getMessage(),
            'request_data' => $request->all(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'message' => 'Webhook processing failed',
            'error' => $e->getMessage()
        ], 500);
    }
}
    /**
     * Get user's orders
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserOrders(Request $request)
    {
        try {
            $user = Auth::user();
            $orders = Order::where('user_id', $user->id)
                ->with(['orderProducts.productVariant.product'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $orders
            ], 200);

        } catch (Exception $e) {
            Log::error('Failed to retrieve user orders', [
                'user_id' => Auth::id(),
                'error_message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific order details
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrderDetails($id)
    {
        try {
            $user = Auth::user();
            $order = Order::where('user_id', $user->id)
                ->with(['orderProducts.productVariant.product'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $order
            ], 200);

        } catch (Exception $e) {
            Log::error('Failed to retrieve order details', [
                'order_id' => $id,
                'user_id' => Auth::id(),
                'error_message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
    }

    /**
     * Cancel an order (only if status is PENDING)
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancelOrder($id)
    {
        DB::beginTransaction();
        
        try {
            $user = Auth::user();
            $order = Order::where('user_id', $user->id)->findOrFail($id);

            // Only allow cancellation for pending orders
            if ($order->status !== 'PENDING') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending orders can be cancelled'
                ], 400);
            }

            // Restore stock for cancelled order
            foreach ($order->orderProducts as $orderProduct) {
                $orderProduct->productVariant->increment('stock', $orderProduct->quantity);
            }

            // Update order status
            $order->update(['status' => 'CANCELLED']);

            DB::commit();

            Log::info('Order cancelled successfully', [
                'order_id' => $order->id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to cancel order', [
                'order_id' => $id,
                'user_id' => Auth::id(),
                'error_message' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }
    public function checkStatus($id)
   {
    try {
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)
            ->with(['orderProducts.productVariant.product'])
            ->findOrFail($id);

        Log::info('Order status check requested', [
            'order_id' => $order->id,
            'user_id' => $user->id,
            'current_status' => $order->status
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
                'price' => $order->price,
                'total' => $order->total,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'payment_channel' => $order->payment_channel,
                'payment_method' => $order->payment_method,
                'url' => $order->url,
                'orderProducts' => $order->orderProducts
            ],
            'message' => 'Order status retrieved successfully'
        ], 200);

    } catch (Exception $e) {
        Log::error('Failed to check order status', [
            'order_id' => $id,
            'user_id' => Auth::id(),
            'error_message' => $e->getMessage()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Order not found or access denied',
            'error' => $e->getMessage()
        ], 404);
    }
}
public function syncOrderStatus($id)
{
    try {
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->findOrFail($id);

        // Skip if already completed
        if (in_array($order->status, ['PAID', 'CANCELLED', 'FAILED'])) {
            return response()->json([
                'success' => true,
                'data' => $order,
                'message' => 'Order already completed'
            ]);
        }

        Log::info('Manual sync requested for order', [
            'order_id' => $order->id,
            'current_status' => $order->status
        ]);

        // Get status from Xendit API
        Configuration::setXenditKey(env('XENDIT_API_KEY'));
        $apiInstance = new InvoiceApi();
        
        try {
            $invoice = $apiInstance->getInvoices([
                'external_id' => (string)$order->id,
                'limit' => 1
            ]);

            if (!empty($invoice) && isset($invoice[0])) {
                $invoiceData = $invoice[0];
                $xenditStatus = strtoupper($invoiceData['status']);
                
                if ($order->status !== $xenditStatus) {
                    $order->update([
                        'status' => $xenditStatus,
                        'updated_at' => now()
                    ]);
                    
                    Log::info('Order status synced from Xendit', [
                        'order_id' => $order->id,
                        'old_status' => $order->status,
                        'new_status' => $xenditStatus
                    ]);
                }
            }
        } catch (Exception $xenditError) {
            Log::warning('Failed to sync from Xendit API', [
                'order_id' => $order->id,
                'error' => $xenditError->getMessage()
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $order->fresh(['orderProducts.productVariant.product']),
            'message' => 'Order status synced successfully'
        ]);

    } catch (Exception $e) {
        Log::error('Manual sync failed', [
            'order_id' => $id,
            'error' => $e->getMessage()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to sync order status'
        ], 500);
    }
}
}
