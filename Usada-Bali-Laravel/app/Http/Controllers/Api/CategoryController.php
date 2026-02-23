<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index()
    {
        try {
            $categories = Category::with('products')->get();
            
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|unique:categories,name',
            'description' => 'nullable'
        ]);
        
        try {
            $category = Category::create([
                'name' => $request->name,
                'is_active' => $request->is_active ? true : false,
                'description' => $request->description
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully!',
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

  
    public function show(string $id)
    {
        try {
            $category = Category::with('products')->find($id);
            
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

   
    public function update(Request $request, string $id)
    {
        $category = Category::find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }
        
        $request->validate([
            'name' => 'required|min:3|unique:categories,name,' . $id,
            'description' => 'nullable'
        ]);
        
        try {
            $category->update([
                'name' => $request->name,
                'is_active' => $request->is_active ? true : false,
                'description' => $request->description
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully!',
                'data' => $category->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    
    public function destroy(string $id)
    {
        try {
            $category = Category::find($id);
            
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found'
                ], 404);
            }
            
            $category->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
   
    public function getActiveCategories()
    {
        try {
            $categories = Category::where('is_active', true)->get();
            
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}