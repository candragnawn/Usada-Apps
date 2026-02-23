<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles
     */
    public function index()
    {
        $articles = Article::orderBy('created_at', 'desc')->paginate(10);
        return view('articles.index', compact('articles'));
    }

    /**
     * Show the form for creating a new article
     */
    public function create()
    {
        return view('articles.form');
    }

    /**
     * Store a newly created article
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:articles,slug',
            'category' => 'nullable|string|max:100',
            'icon' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'keywords' => 'nullable|string',
            'meta_description' => 'nullable|string|max:160',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'ingredients' => 'nullable|array',
            'ingredients.*' => 'string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string',
            'preparation_steps' => 'nullable|array',
            'preparation_steps.*' => 'string',
        ]);

        try {
            // Generate slug if not provided
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
            }

            // Handle image upload
            if ($request->hasFile('image_url')) {
                $validated['image_url'] = $request->file('image_url')->store('articles', 'public');
            }

            // Handle published date
            if ($validated['is_published'] && empty($validated['published_at'])) {
                $validated['published_at'] = now();
            }

            // Filter out empty array values
            $validated['ingredients'] = array_filter($validated['ingredients'] ?? []);
            $validated['benefits'] = array_filter($validated['benefits'] ?? []);
            $validated['preparation_steps'] = array_filter($validated['preparation_steps'] ?? []);

            Article::create($validated);

            return redirect()->route('articles.index')->with('success', 'Article created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified article
     */
    public function show($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return redirect()->route('articles.index')->with('error', 'Article not found');
        }
        return view('articles.show', compact('article'));
    }

    /**
     * Show the form for editing the specified article
     */
    public function edit($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return redirect()->route('articles.index')->with('error', 'Article not found');
        }
        return view('articles.form', compact('article'));
    }

    /**
     * Update the specified article
     */
    public function update(Request $request, $id)
    {
        $article = Article::find($id);
        if (!$article) {
            return redirect()->back()->with('error', 'Article not found');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
            'category' => 'nullable|string|max:100',
            'icon' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'keywords' => 'nullable|string',
            'meta_description' => 'nullable|string|max:160',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'ingredients' => 'nullable|array',
            'ingredients.*' => 'string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string',
            'preparation_steps' => 'nullable|array',
            'preparation_steps.*' => 'string',
        ]);

        try {
            // Generate slug if not provided
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
            }

            // Handle image upload
            if ($request->hasFile('image_url')) {
                // Delete old image
                if ($article->image_url) {
                    Storage::disk('public')->delete($article->image_url);
                }
                $validated['image_url'] = $request->file('image_url')->store('articles', 'public');
            }

            // Handle published date
            if ($validated['is_published'] && empty($validated['published_at'])) {
                $validated['published_at'] = $validated['published_at'] ?? now();
            }

            // Filter out empty array values
            $validated['ingredients'] = array_filter($validated['ingredients'] ?? []);
            $validated['benefits'] = array_filter($validated['benefits'] ?? []);
            $validated['preparation_steps'] = array_filter($validated['preparation_steps'] ?? []);

            $article->update($validated);

            return redirect()->route('articles.index')->with('success', 'Article updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified article
     */
    public function destroy($id)
    {
        try {
            $article = Article::find($id);
            if (!$article) {
                return redirect()->route('articles.index')->with('error', 'Article not found');
            }

            // Delete image if exists
            if ($article->image_url) {
                Storage::disk('public')->delete($article->image_url);
            }

            $article->delete();

            return redirect()->route('articles.index')->with('success', 'Article deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->route('articles.index')->with('error', $e->getMessage());
        }
    }
}