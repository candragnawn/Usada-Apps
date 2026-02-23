<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Get all articles with optional filters
     */
    public function getArticles(Request $request): JsonResponse
    {
        try {
            $query = Article::query();

            // Apply search filter
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            // Apply category filter
            if ($request->filled('category')) {
                $query->byCategory($request->category);
            }

            // Apply publication status filter (default to published only for API)
            if ($request->filled('published')) {
                if ($request->published === '1') {
                    $query->published();
                } elseif ($request->published === '0') {
                    $query->where('is_published', false);
                }
            } else {
                // Default: only show published articles for public API
                $query->published();
            }

            // Apply ordering
            $orderBy = $request->input('order_by', 'published_at');
            $orderDirection = $request->input('order_direction', 'desc');
            $query->orderBy($orderBy, $orderDirection);

            // Pagination
            $perPage = min((int) $request->input('per_page', 10), 50); // Max 50 items per page
            $articles = $query->paginate($perPage);

            return response()->json([
                'data' => $articles->items(),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                    'per_page' => $articles->perPage(),
                    'total' => $articles->total(),
                    'from' => $articles->firstItem(),
                    'to' => $articles->lastItem(),
                ],
                'success' => true,
                'message' => 'Articles retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'success' => false,
                'message' => 'Failed to retrieve articles'
            ], 500);
        }
    }

    /**
     * Get single article by slug
     */
    public function getArticle(string $slug): JsonResponse
    {
        try {
            $article = Article::where('slug', $slug)->first();

            if ($article) {
                // Only show published articles for public API (unless specifically requested)
                if (!$article->is_published && !request()->has('include_unpublished')) {
                    return response()->json([
                        'data' => null,
                        'success' => false,
                        'message' => 'Article not found'
                    ], 404);
                }

                // Increment view count
                $article->incrementViews();

                // Get related articles
                $relatedArticles = Article::published()
                    ->where('id', '!=', $article->id)
                    ->where('category', $article->category)
                    ->take(3)
                    ->get(['id', 'title', 'slug', 'description', 'image_url', 'published_at']);

                return response()->json([
                    'data' => $article,
                    'related_articles' => $relatedArticles,
                    'success' => true,
                    'message' => 'Article retrieved successfully'
                ]);
            } else {
                return response()->json([
                    'data' => null,
                    'success' => false,
                    'message' => 'Article not found'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'success' => false,
                'message' => 'Failed to retrieve article'
            ], 500);
        }
    }

    /**
     * Get articles by category
     */
    public function getArticlesByCategory(string $category): JsonResponse
    {
        try {
            $perPage = min((int) request()->input('per_page', 12), 50);
            
            $articles = Article::published()
                ->byCategory($category)
                ->orderBy('published_at', 'desc')
                ->paginate($perPage);

            if ($articles->isEmpty()) {
                return response()->json([
                    'data' => [],
                    'meta' => [
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => $perPage,
                        'total' => 0,
                    ],
                    'success' => true,
                    'message' => 'No articles found in this category'
                ]);
            }

            return response()->json([
                'data' => $articles->items(),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                    'per_page' => $articles->perPage(),
                    'total' => $articles->total(),
                    'category' => $category,
                ],
                'success' => true,
                'message' => 'Articles by category retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'success' => false,
                'message' => 'Failed to retrieve articles by category'
            ], 500);
        }
    }

    /**
     * Search articles
     */
    public function searchArticles(Request $request): JsonResponse
    {
        try {
            $searchTerm = $request->input('q');
            $category = $request->input('category');
            $perPage = min((int) $request->input('per_page', 12), 50);

            if (empty($searchTerm)) {
                return response()->json([
                    'data' => [],
                    'success' => false,
                    'message' => 'Search term is required'
                ], 400);
            }

            $articles = Article::published()
                ->search($searchTerm)
                ->byCategory($category)
                ->orderBy('published_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'data' => $articles->items(),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                    'per_page' => $articles->perPage(),
                    'total' => $articles->total(),
                    'search_term' => $searchTerm,
                    'category' => $category,
                ],
                'success' => true,
                'message' => 'Search completed successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'success' => false,
                'message' => 'Search failed'
            ], 500);
        }
    }

    /**
     * Get available categories
     */
    public function getCategories(): JsonResponse
    {
        try {
            $categories = Article::getCategories();

            return response()->json([
                'data' => $categories,
                'success' => true,
                'message' => 'Categories retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'success' => false,
                'message' => 'Failed to retrieve categories'
            ], 500);
        }
    }

    /**
     * Get latest articles
     */
    public function getLatestArticles(Request $request): JsonResponse
    {
        try {
            $limit = min((int) $request->input('limit', 5), 20); // Max 20 articles

            $articles = Article::published()
                ->orderBy('published_at', 'desc')
                ->take($limit)
                ->get(['id', 'title', 'slug', 'description', 'image_url', 'category', 'published_at']);

            return response()->json([
                'data' => $articles,
                'success' => true,
                'message' => 'Latest articles retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'success' => false,
                'message' => 'Failed to retrieve latest articles'
            ], 500);
        }
    }

    /**
     * Get popular articles (by view count)
     */
    public function getPopularArticles(Request $request): JsonResponse
    {
        try {
            $limit = min((int) $request->input('limit', 5), 20); // Max 20 articles

            $articles = Article::published()
                ->orderBy('view_count', 'desc')
                ->take($limit)
                ->get(['id', 'title', 'slug', 'description', 'image_url', 'category', 'view_count', 'published_at']);

            return response()->json([
                'data' => $articles,
                'success' => true,
                'message' => 'Popular articles retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'success' => false,
                'message' => 'Failed to retrieve popular articles'
            ], 500);
        }
    }
}