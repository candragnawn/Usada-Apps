<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $table = 'articles';
    
    protected $fillable = [
        'title',
        'slug', 
        'image_url',
        'icon',
        'category',
        'description',
        'content',
        'ingredients',
        'benefits',
        'preparation_steps',
        'keywords',
        'meta_description',
        'published_at',
        'is_published',
        'views_count'
    ];

    protected $casts = [
        'ingredients' => 'array',
        'benefits' => 'array',
        'preparation_steps' => 'array',
        'published_at' => 'datetime',
        'is_published' => 'boolean',
        'views_count' => 'integer'
    ];

    protected $dates = [
        'published_at',
        'created_at',
        'updated_at'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });

        static::updating(function ($article) {
            if ($article->isDirty('title') && empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });
    }

    // Scopes for filtering
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByCategory($query, $category)
    {
        if ($category && $category !== 'Semua') {
            return $query->where('category', $category);
        }
        return $query;
    }

    public function scopeSearch($query, $searchText)
    {
        if (!$searchText) {
            return $query;
        }

        return $query->where(function ($q) use ($searchText) {
            $q->where('title', 'LIKE', "%{$searchText}%")
              ->orWhere('description', 'LIKE', "%{$searchText}%")
              ->orWhere('content', 'LIKE', "%{$searchText}%")
              ->orWhere('category', 'LIKE', "%{$searchText}%")
              ->orWhereJsonContains('ingredients', $searchText)
              ->orWhereJsonContains('benefits', $searchText);
        });
    }

    // Accessors and Mutators
    public function getRouteKeyName()
    {
        return 'slug';
    }

    // Helper methods
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public static function getCategories()
    {
        return self::published()
                   ->whereNotNull('category')
                   ->distinct()
                   ->pluck('category')
                   ->sort()
                   ->values();
    }

    public static function getCategoriesWithData()
    {
        return self::published()
                   ->select('category', 'icon')
                   ->whereNotNull('category')
                   ->groupBy('category', 'icon')
                   ->get()
                   ->map(function ($item) {
                       return [
                           'id' => 'category-' . Str::slug($item->category),
                           'name' => $item->category,
                           'category' => $item->category,
                           'icon' => $item->icon,
                           'color' => '#E8F5E8'
                       ];
                   });
    }

    // API Resource transformation
    public function toApiArray()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'image' => $this->image_url,
            'icon' => $this->icon,
            'category' => $this->category,
            'description' => $this->description,
            'content' => $this->content,
            'ingredients' => $this->ingredients,
            'benefits' => $this->benefits,
            'preparation_steps' => $this->preparation_steps,
            'published_at' => $this->published_at?->toISOString(),
            'views_count' => $this->views_count,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}