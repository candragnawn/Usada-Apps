<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    // Fetch categories (you can paginate if needed)
    $categories = Category::with('products')->paginate(10);  // Optional: change '10' based on how many categories per page

    // Pass the categories to the view
    return view('categories.index', compact('categories'));
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('categories.form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|unique:categories,name',
            'description' => 'nullable'
        ]);

        Category::create([
            'name' => $request->name,
            'is_active' => $request->is_active ? true : false,
            'description' => $request->description
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $category = Category::find($id);
        
        if (!$category) {
            return redirect()->route('categories.index')->with('error', 'Category not found');
        }
        
        return view('categories.form', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::find($id);
        
        if (!$category) {
            return redirect()->route('categories.index')->with('error', 'Category not found');
        }
        
        $request->validate([
            'name' => 'required|min:3|unique:categories,name,' . $id,
            'description' => 'nullable'
        ]);

        $category->update([
            'name' => $request->name,
            'is_active' => $request->is_active ? true : false,
            'description' => $request->description
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        
        if ($category) {
            $category->delete();
            return redirect()->route('categories.index')->with('success', 'Category deleted successfully!');
        }
        
        return redirect()->route('categories.index')->with('error', 'Category not found');
    }
}