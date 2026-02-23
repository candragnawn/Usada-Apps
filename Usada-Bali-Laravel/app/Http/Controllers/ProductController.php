<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();

        return view('products.index', ['products' => $products]);
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return view('products.form', ['categories' => $categories]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products',
            'price' => 'required|numeric',
            'company' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {

            $product = new Product();
            $product->name = $request->name;
            $product->price = $request->price;
            $product->company = $request->company;
            $product->category_id = $request->category_id;
            $product->description = $request->description;
            $product->is_active = $request->is_active;

            // Menyimpan gambar
            $imagePaths = [];
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $image) {
                    $imagePaths[] = $image->store('products', 'public'); // Menyimpan gambar di folder 'public/products'
                }
            }

            $product->images = $imagePaths;
            $product->save();

            $variants = json_decode($request->variants, true);

            if (is_array($variants)) {
                foreach ($variants as $variant) {
                    $product->variants()->create([
                        'stock' => $variant['stock'],
                        'variant_name' => $variant['variant_name'],
                        'size' => $variant['size'],
                        'weight' => $variant['weight']
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Create product success',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with('variants')->find($id);
        $categories = Category::all();
        if (!$product) {
            return redirect()->route('products.index');
        }

        return view('products.form', ['product' => $product, 'categories' => $categories]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return redirect()->back()->with('error', 'Product not found');
        }

        $request->validate([
            'name' => "required|string|max:255|unique:products,name,{$product->id}",
            'price' => 'required|numeric',
            'company' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',

        ]);

        try {
            if ($request->has('deleted_images')) {
                foreach ($request->deleted_images as $deleteImage) {
                    if (Storage::disk('public')->exists($deleteImage)) {
                        Storage::disk('public')->delete($deleteImage);
                    }
                }
            }

            $uploadedImages = [];
            if ($request->hasFile('new_images')) {
                foreach ($request->file("new_images") as $image) {
                    $imagePath = $image->store('products', 'public');
                    $uploadedImages[] = $imagePath;
                }
            }

            $product->update([
                'name' => $request->name,
                'price' => $request->price,
                'company' => $request->company,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'images' => array_merge(array_diff($product->images ?? [], $request->deleted_images ?? []), $uploadedImages),
            ]);

            $variants = json_decode($request->variants, true);
            if (is_array($variants)) {
                $existingVariantIds = $product->variants()->pluck('id')->toArray();

                $newVariantIds = [];
                foreach ($variants as $variant) {
                    if (isset($variant['id'])) {
                        $product->variants()->where('id', $variant['id'])->update([
                            'variant_name' => $variant['variant_name'],
                            'stock' => $variant['stock'],
                            'size' => $variant['size'],
                            'weight' => $variant['weight']
                        ]);

                        $newVariantIds[] = $variant['id'];
                    } else {
                        $newVariant = $product->variants()->create([
                            'variant_name' => $variant['variant_name'],
                            'stock' => $variant['stock'],
                            'size' => $variant['size'],
                            'weight' => $variant['weight']
                        ]);

                        $newVariantIds[] = $newVariant->id;
                    }
                }


                $variantsToDelete = array_diff($existingVariantIds, $newVariantIds);
                $product->variants()->whereIn('id', $variantsToDelete)->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('products.index')->with(['success' => 'Product deleted success']);
    }
}
