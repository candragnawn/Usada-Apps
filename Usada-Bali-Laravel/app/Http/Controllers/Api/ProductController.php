<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    
    public function index()
    {
        $products = Product::with(['variants', 'category'])->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:products,name',
            'description' => 'nullable',
            'company' => 'required',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'images' => 'required|array',
            'is_active' => 'boolean',
            'variants' => 'array',
            'variants.*.variant_name' => 'required|string',
            'variants.*.stock' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if category exists and is active
        $category = Category::find($request->category_id);
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found'
            ], 404);
        }

        if (!$category->is_active) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot add product to inactive category'
            ], 400);
        }

        // Create the product
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'company' => $request->company,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'images' => $request->images,
            'is_active' => $request->has('is_active') ? $request->is_active : true,
        ]);

        // Create variants if provided
        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $variantData) {
                $product->variants()->create([
                    'variant_name' => $variantData['variant_name'],
                    'stock' => $variantData['stock']
                ]);
            }
        }

        // Load the relationships for the response
        $product->load(['variants', 'category']);

        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully!',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified product with its variants and category.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        try {
            $product = Product::with(['variants', 'category'])->findOrFail($id);
            
            return response()->json([
                'status' => 'success',
                'data' => $product
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
    }

   
    public function update(Request $request, string $id)
    {
        try {
            $product = Product::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|unique:products,name,' . $id,
                'description' => 'nullable',
                'company' => 'sometimes|required',
                'category_id' => 'sometimes|required|exists:categories,id',
                'price' => 'sometimes|required|numeric|min:0',
                'images' => 'sometimes|required|array',
                'is_active' => 'boolean',
                'variants' => 'array',
                'variants.*.id' => 'nullable|exists:product_variants,id,product_id,' . $id,
                'variants.*.variant_name' => 'required|string',
                'variants.*.stock' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            
            if ($request->has('category_id')) {
                $category = Category::find($request->category_id);
                if (!$category) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Category not found'
                    ], 404);
                }

                if (!$category->is_active) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Cannot move product to inactive category'
                    ], 400);
                }
            }

           
            $product->update([
                'name' => $request->name ?? $product->name,
                'description' => $request->description ?? $product->description,
                'company' => $request->company ?? $product->company,
                'category_id' => $request->category_id ?? $product->category_id,
                'price' => $request->price ?? $product->price,
                'images' => $request->images ?? $product->images,
                'is_active' => $request->has('is_active') ? $request->is_active : $product->is_active,
            ]);

       
            if ($request->has('variants') && is_array($request->variants)) {
                $existingVariantIds = [];
                
                foreach ($request->variants as $variantData) {
                    if (isset($variantData['id'])) {
                  
                        $variant = ProductVariant::where('id', $variantData['id'])
                                                ->where('product_id', $product->id)
                                                ->first();
                        
                        if ($variant) {
                            $variant->update([
                                'variant_name' => $variantData['variant_name'],
                                'stock' => $variantData['stock']
                            ]);
                            $existingVariantIds[] = $variant->id;
                        }
                    } else {
                 
                        $variant = $product->variants()->create([
                            'variant_name' => $variantData['variant_name'],
                            'stock' => $variantData['stock']
                        ]);
                        $existingVariantIds[] = $variant->id;
                    }
                }
                
              
                if ($request->has('replace_variants') && $request->replace_variants) {
                    $product->variants()->whereNotIn('id', $existingVariantIds)->delete();
                }
            }

           
            $product->load(['variants', 'category']);

            return response()->json([
                'status' => 'success',
                'message' => 'Product updated successfully!',
                'data' => $product
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
    }

    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);
            
          
            $product->variants()->delete();
            
       
            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product and all its variants deleted successfully!'
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
    }

    public function getByCategory(string $categoryId)
    {
        try {
            $category = Category::findOrFail($categoryId);
            
            if (!$category->is_active) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category is inactive'
                ], 400);
            }
            
            $products = Product::with(['variants'])
                               ->where('category_id', $categoryId)
                               ->where('is_active', true)
                               ->get();
            
            return response()->json([
                'status' => 'success',
                'category' => $category->name,
                'data' => $products
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found'
            ], 404);
        }
    }

    public function addVariant(Request $request, string $productId)
    {
        try {
            $product = Product::findOrFail($productId);
            
            $validator = Validator::make($request->all(), [
                'variant_name' => 'required|string',
                'stock' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $variant = $product->variants()->create([
                'variant_name' => $request->variant_name,
                'stock' => $request->stock
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Variant added successfully!',
                'data' => $variant
            ], 201);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
    }

    public function updateVariant(Request $request, string $productId, string $variantId)
    {
        try {
            $product = Product::findOrFail($productId);
            
            $variant = $product->variants()->findOrFail($variantId);
            
            $validator = Validator::make($request->all(), [
                'variant_name' => 'sometimes|required|string',
                'stock' => 'sometimes|required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $variant->update([
                'variant_name' => $request->variant_name ?? $variant->variant_name,
                'stock' => $request->stock ?? $variant->stock
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Variant updated successfully!',
                'data' => $variant
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product or variant not found'
            ], 404);
        }
    }

    public function deleteVariant(string $productId, string $variantId)
    {
        try {
            $product = Product::findOrFail($productId);
            
            $variant = $product->variants()->findOrFail($variantId);
            $variant->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Variant deleted successfully!'
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product or variant not found'
            ], 404);
        }
    }
}