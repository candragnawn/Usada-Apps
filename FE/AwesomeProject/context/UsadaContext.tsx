console.log('🟢🟢🟢 [CRITICAL DEBUG] UsadaContext.tsx EVALUATING LINE 1');
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { robustJsonParse } from '../utils/apiUtils';
import { Article, UsadaContextType } from '../types/usada';

const UsadaContext = createContext<UsadaContextType>({
  articles: [],
  selectedArticle: null,
  favorites: [],
  loading: false,
  error: null as string | null,
  categories: ['Semua'],
  currentFilter: null,
  fetchArticles: async (params?: any) => ({} as any),
  fetchArticleBySlug: async (slug: string) => ({} as any),
  fetchArticleById: async (id: any) => ({} as any),
  fetchArticlesByCategory: async (category: string, params?: any) => ({} as any),
  searchArticles: async (searchTerm: string, category?: any, params?: any) => ({} as any),
  fetchCategories: async () => [] as any[],
  fetchLatestArticles: async (limit?: number) => [] as any[],
  fetchPopularArticles: async (limit?: number) => [] as any[],
  selectArticle: (article: any) => {},
  toggleFavorite: (articleId: any) => {},
  isFavorite: (articleId: any) => false as boolean,
  getDiseaseCategories: () => [] as any[],
  getAllCategories: () => [] as string[],
  filterArticles: (category: any, searchText: any) => [] as any[],
  getArticlesByDiseaseCategory: (categoryName: any) => [] as any[],
  getFilteredArticlesForNavigation: (categoryName: any, searchText?: string) => [] as any[],
  categoryHasArticles: (categoryName: any) => false as boolean,
  setActiveFilter: (filterData: any) => {},
  clearActiveFilter: () => {},
  getActiveFilter: () => null as any,
  navigateToCategory: (navigation: any, categoryName: any, categoryData?: any) => {},
  navigateToArticle: (navigation: any, article: any, fromCategory?: any) => {},
  handleCategoryNavigation: async (navigation: any, category: any) => ({ success: false } as any),
  getCategoryForNavigation: (categoryObject: any) => '',
  getFullImageUrl: (imagePath: any) => '',
  clearError: () => {},
  refreshData: async (params?: any) => {},
  initializeData: async () => {},
  API_BASE_URL: '',
  IMAGE_BASE_URL: '',
});

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL || '';
// FIX 1: REACT_APP_IMAGE → REACT_APP_IMAGE_URL (typo fix)
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || process.env.REACT_APP_IMAGE_URL || `${API_BASE_URL}/storage`;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    // Use robust parser to handle potential double-encoding or bad characters
    response.data = robustJsonParse(response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Custom provider component
export const UsadaProvider = ({ children }: { children: React.ReactNode }) => {
  // Core state
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [currentFilter, setCurrentFilter] = useState<any>(null);

  // Cache for better performance
  const [cache, setCache] = useState<{
    categories: any[] | null;
    allArticles: any[] | null;
    categoryArticles: Record<string, any[]>;
    lastFetch: number | null;
  }>({
    categories: null,
    allArticles: null,
    categoryArticles: {},
    lastFetch: null
  });

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Initialize all required data
  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchCategories(),
        fetchArticles()
      ]);
      
      console.log('✅ UsadaContext initialized successfully');
    } catch (error: unknown) {
      console.error('❌ Error initializing UsadaContext:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`;
    const path = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${base}${path}`;
  };

  // FIX 2: transformArticle — handle images as JSON array (consistent with products table)
  // Priority: images array (new format) → image_url string (old format) → image field
  const transformArticle = (article: any): Article => {
    // Parse images field — backend stores as JSON array: ["articles/xxx.jpg"]
    let firstImage: string | null = null;
    try {
      if (Array.isArray(article.images)) {
        firstImage = article.images[0] ?? null;
      } else if (typeof article.images === 'string' && article.images.trim().startsWith('[')) {
        const parsed = JSON.parse(article.images);
        firstImage = Array.isArray(parsed) ? parsed[0] ?? null : null;
      }
    } catch {
      // ignore JSON parse error
    }

    // Fallback to old image_url / image fields for backward compatibility
    const resolvedImage = firstImage ?? article.image_url ?? article.image ?? null;

    return {
      ...article,
      image_url: getFullImageUrl(resolvedImage),
      image: getFullImageUrl(resolvedImage),
      // Ensure required fields exist
      id: article.id,
      title: article.title || 'Untitled',
      description: article.description || article.excerpt || '',
      category: article.category || 'Uncategorized',
      created_at: article.created_at || article.published_at || new Date().toISOString(),
      slug: article.slug || article.id?.toString() || '',
    };
  };

  // Standardized fetchArticles using Axios (apiClient)
 const fetchArticles = async (params: Record<string, any> = {}) => {
  try {
    setLoading(true);
    setError(null);

    // 1. Tambahkan limit secara default (misal 10) 
    // agar data tidak terlalu besar dan tidak terpotong (truncated)
    const safeParams = { 
      limit: 10, 
      ...params 
    };

    // 2. Gunakan Axios (apiClient) - Interceptor akan memanggil robustJsonParse
    const response = await apiClient.get('/articles', { params: safeParams });

    // 3. Pastikan data terurai dengan benar (menangani double-encoding jika ada)
    const raw = robustJsonParse(response.data);
    const articlesData = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);

    if (!articlesData || !Array.isArray(articlesData)) {
      throw new Error("Format data dari server tidak dikenali");
    }

    // 4. Transformasi data
    const transformed = articlesData.map(transformArticle);
    
    setArticles(transformed);
    setCache(prev => ({
      ...prev,
      allArticles: transformed,
      lastFetch: Date.now()
    }));

    console.log('✅ [UsadaContext] Sukses memuat ' + transformed.length + ' artikel');
    return { articles: transformed, meta: raw?.meta };

  } catch (err: unknown) {
    // 5. JANGAN PAKSA PARSING kalau error. Balikkan cache saja jika tersedia.
    console.error('❌ [UsadaContext] Error Jaringan/Server:', err instanceof Error ? err.message : String(err));
    
    if (cache.allArticles) {
      setArticles(cache.allArticles);
      return { articles: cache.allArticles };
    }
    return { articles: [] };
  } finally {
    setLoading(false);
  }
};

  const fetchArticleBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`/articles/${slug}`);
      
      if (response.data && (response.data.success || response.data.data)) {
        const articleData = response.data.data || response.data;
        const articleWithFullUrl = transformArticle(articleData);
        setSelectedArticle(articleWithFullUrl);
        
        console.log('✅ Article fetched by slug:', slug);
        
        return {
          article: articleWithFullUrl,
          relatedArticles: response.data.related_articles?.map(transformArticle) || []
        };
      } else {
        throw new Error('Article not found');
      }
    } catch (err: any) {
      console.error('❌ Error fetching article by slug:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch article';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleById = async (id: number | string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to find in current articles
      const existingArticle = articles.find(article => article.id === parseInt(id as string));
      if (existingArticle) {
        setSelectedArticle(existingArticle);
        return existingArticle;
      }
      
      // Try direct API call first
      try {
        const response = await apiClient.get(`/articles/${id}`);
        if (response.data && (response.data.success || response.data.data)) {
          const articleData = response.data.data || response.data;
          const articleWithFullUrl = transformArticle(articleData);
          setSelectedArticle(articleWithFullUrl);
          return articleWithFullUrl;
        }
      } catch (directError: unknown) {
        console.log('Direct fetch failed, trying list approach');
      }
      
      // Fallback: get from articles list
      const response = await apiClient.get('/articles', { 
        params: { per_page: 100 }
      });
      
      let raw = response.data;
      const articlesData = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      const article = articlesData.find((a: any) => a.id === parseInt(id as string));
      
      if (article) {
        const articleWithFullUrl = transformArticle(article);
        setSelectedArticle(articleWithFullUrl);
        return articleWithFullUrl;
      } else {
        throw new Error('Article not found');
      }
    } catch (err: any) {
      console.error('❌ Error fetching article by ID:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch article';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByCategory = async (category: string, params: Record<string, any> = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = `${category}_${JSON.stringify(params)}`;
      if (cache.categoryArticles[cacheKey]) {
        console.log('📋 [UsadaContext] Using cached category articles:', category);
        return { articles: cache.categoryArticles[cacheKey] };
      }
      
      let response;
      const endpoints = [
        `/articles/category/${category}`,
        `/articles?category=${category}`,
        '/articles'
      ];
      
      console.log(`📡 [UsadaContext] Fetching articles for category: ${category}`);
      
      for (const endpoint of endpoints) {
        try {
          if (endpoint === '/articles') {
            response = await apiClient.get(endpoint, { 
              params: { ...params, category } 
            });
          } else {
            response = await apiClient.get(endpoint, { params });
          }
          break;
        } catch (endpointError: unknown) {
          console.log(`📡 [UsadaContext] Endpoint ${endpoint} failed, trying next...`);
          continue;
        }
      }
      
      if (!response) {
        throw new Error('All category endpoints failed');
      }
      
      const raw = robustJsonParse(response.data);

      let articlesData: any[] = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);

      // Filter by category if we got all articles from the generic /articles fallback
      if (category !== 'Semua' && category !== 'All') {
        articlesData = articlesData.filter(article =>
          article.category === category ||
          article.category?.toLowerCase() === category.toLowerCase()
        );
      }

      const transformed = articlesData.map(transformArticle);
      
      setCache(prev => ({
        ...prev,
        categoryArticles: {
          ...prev.categoryArticles,
          [cacheKey]: transformed
        }
      }));
      
      console.log('✅ [UsadaContext] Category articles fetched:', category, transformed.length);
      return {
        articles: transformed,
        meta: raw?.meta
      };

    } catch (err: unknown) {
      console.error('❌ [UsadaContext] Error fetching articles by category:', err instanceof Error ? err.message : String(err));
      
      if (articles.length > 0) {
        console.log('📋 [UsadaContext] Falling back to local filtering for:', category);
        const filtered = getArticlesByDiseaseCategory(category);
        return { articles: filtered };
      }
      
      return { articles: [] };
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (searchTerm: string, category: string | null = null, params: Record<string, any> = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!searchTerm || !searchTerm.trim()) {
        throw new Error('Search term is required');
      }

      const searchParams: Record<string, any> = {
        q: searchTerm.trim(),
        search: searchTerm.trim(),
        ...params
      };
      
      if (category && category !== 'Semua' && category !== 'All') {
        searchParams.category = category;
      }

      let response;
      const endpoints = ['/articles/search', '/search', '/articles'];
      
      for (const endpoint of endpoints) {
        try {
          response = await apiClient.get(endpoint, { params: searchParams });
          break;
        } catch (endpointError: unknown) {
          console.log(`Search endpoint ${endpoint} failed, trying next...`);
          continue;
        }
      }
      
      if (!response) {
        console.log('🔍 Using local search fallback');
        return performLocalSearch(searchTerm, category);
      }
      
      const raw = robustJsonParse(response.data);

      const articlesData: any[] = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      const transformed = articlesData.map(transformArticle);
      
      console.log('✅ [UsadaContext] Search completed:', searchTerm, transformed.length);
      return {
        articles: transformed,
        meta: raw?.meta
      };

    } catch (err: unknown) {
      console.error('❌ Error searching articles:', err);
      console.log('🔍 Using local search fallback due to error');
      return performLocalSearch(searchTerm, category);
    } finally {
      setLoading(false);
    }
  };

  // Local search fallback
  const performLocalSearch = (searchTerm: string, category: string | null = null) => {
    const searchLower = searchTerm.toLowerCase();
    let filtered = articles.filter(article =>
      article.title?.toLowerCase().includes(searchLower) ||
      article.description?.toLowerCase().includes(searchLower) ||
      article.category?.toLowerCase().includes(searchLower)
    );

    if (category && category !== 'Semua' && category !== 'All') {
      filtered = filtered.filter(article => 
        article.category === category ||
        article.category?.toLowerCase() === category.toLowerCase()
      );
    }

    console.log('✅ Local search completed:', searchTerm, filtered.length);
    return { articles: filtered };
  };

  const fetchCategories = async () => {
    try {
      setError(null);
      
      if (cache.categories && (cache.categories as any[]).length > 0) {
        console.log('📋 Using cached categories');
        const finalCategories = ['Semua', ...(cache.categories as string[])];
        setCategories(finalCategories);
        return finalCategories;
      }
      
      try {
        const response = await apiClient.get('/articles/categories');
        const rawBody = robustJsonParse(response.data);
        
        if (rawBody && (rawBody.success || rawBody.data || Array.isArray(rawBody))) {
          const categoriesData = rawBody.data || rawBody;
          const validCategories = Array.isArray(categoriesData) 
            ? categoriesData.filter(Boolean)
            : [];
          
          const finalCategories = ['Semua', ...validCategories];
          setCategories(finalCategories);
          setCache(prev => ({ ...prev, categories: validCategories }));
          
          console.log('✅ [UsadaContext] Categories fetched from API:', validCategories.length);
          return finalCategories;
        }
      } catch (apiError: unknown) {
        console.warn('📡 API categories fetch failed, extracting from articles');
      }
      
      if (articles.length > 0) {
        const extractedCategories = [...new Set(
          articles.map(article => article.category).filter(Boolean)
        )];
        
        const finalCategories = ['Semua', ...extractedCategories];
        setCategories(finalCategories);
        
        console.log('✅ Categories extracted from articles:', extractedCategories.length);
        return finalCategories;
      }
      
      const fallbackCategories = ['Semua'];
      setCategories(fallbackCategories);
      return fallbackCategories;
      
    } catch (err: any) {
      console.error('❌ Error fetching categories:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      
      const fallbackCategories = ['Semua'];
      setCategories(fallbackCategories);
      return fallbackCategories;
    }
  };

  const fetchLatestArticles = async (limit = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/articles/latest', { params: { limit } });
      const raw = robustJsonParse(response.data);

      const articlesData: any[] = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);

      if (articlesData.length > 0) {
        const result = articlesData.map(transformArticle);
        console.log('✅ [UsadaContext] Latest articles fetched:', result.length);
        return result;
      }

      // Fallback to local sort
      const sorted = [...articles]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
      console.log('✅ Latest articles from fallback:', sorted.length);
      return sorted;

    } catch (err: unknown) {
      console.error('❌ Error fetching latest articles:', err);
      const sorted = [...articles]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
      console.log('✅ Latest articles from local fallback:', sorted.length);
      return sorted;
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularArticles = async (limit = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/articles/popular', { params: { limit } });
      const raw = robustJsonParse(response.data);

      const articlesData: any[] = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);

      if (articlesData.length > 0) {
        const result = articlesData.map(transformArticle);
        console.log('✅ [UsadaContext] Popular articles fetched:', result.length);
        return result;
      }

      const random = [...articles].sort(() => 0.5 - Math.random()).slice(0, limit);
      console.log('✅ Popular articles from fallback:', random.length);
      return random;

    } catch (err: unknown) {
      console.error('❌ Error fetching popular articles:', err);
      const random = [...articles].sort(() => 0.5 - Math.random()).slice(0, limit);
      console.log('✅ Popular articles from local fallback:', random.length);
      return random;
    } finally {
      setLoading(false);
    }
  };

  // Local utility functions
  const selectArticle = (articleId: number) => {
    const article = articles.find(article => article.id === articleId);
    setSelectedArticle(article || null);
  };

  const toggleFavorite = (articleId: number) => {
    if (favorites.includes(articleId)) {
      setFavorites(favorites.filter(id => id !== articleId));
    } else {
      setFavorites([...favorites, articleId]);
    }
  };

  const isFavorite = (articleId: number) => {
    return favorites.includes(articleId);
  };

  const getDiseaseCategories = () => {
    const uniqueCategories: { id: string; name: string; category: string; icon: string | null; color: string; articleCount: number }[] = [];
    const seenCategories = new Set<string>();

    articles.forEach(article => {
      if (article.category && !seenCategories.has(article.category)) {
        seenCategories.add(article.category);
        uniqueCategories.push({
          id: `category-${article.category}`,
          name: article.category,
          category: article.category,
          icon: (article.image_url || article.image || null) as string | null,
          color: '#E8F5E8',
          articleCount: articles.filter(a => a.category === article.category).length
        });
      }
    });

    return uniqueCategories;
  };

  const getAllCategories = () => {
    return categories;
  };

  const getArticlesByDiseaseCategory = (categoryName: any) => {
    if (!categoryName || categoryName === 'Semua' || categoryName === 'All') {
      return articles;
    }
    
    return articles.filter(article => 
      article.category === categoryName ||
      article.category?.toLowerCase() === categoryName.toLowerCase()
    );
  };

  const filterArticles = (category: any, searchText: any) => {
    let filtered = articles;

    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(searchLower) ||
        article.description?.toLowerCase().includes(searchLower) ||
        article.category?.toLowerCase().includes(searchLower)
      );
    }

    if (category && category !== 'Semua' && category !== 'All') {
      filtered = filtered.filter(article => 
        article.category === category ||
        article.category?.toLowerCase() === category.toLowerCase()
      );
    }

    return filtered;
  };

  const navigateToCategory = (navigation: any, categoryName: any, categoryData: any = null) => {
    console.log('🧭 Navigating to category:', categoryName);
    
    setCurrentFilter({
      type: 'category',
      name: categoryName,
      data: categoryData
    });

    navigation.navigate('UsadaScreen', {
      selectedCategory: categoryName,
      categoryId: categoryData?.id,
      categoryFilter: {
        id: categoryData?.id || `category-${categoryName}`,
        name: categoryName,
        type: 'disease_category',
        originalData: categoryData
      },
      initialFilter: {
        category: categoryName,
        searchText: ''
      }
    });
  };

  const navigateToArticle = (navigation: any, article: any, fromCategory: any = null) => {
    console.log('🧭 Navigating to article:', article.title);
    
    navigation.navigate('ArticleDetail', {
      article: article,
      articleId: article.id,
      articleSlug: article.slug,
      fromCategory: fromCategory,
      backTo: fromCategory ? 'ArticlesTab' : 'Home',
    });
  };

  const handleCategoryNavigation = async (navigation: any, category: any) => {
    try {
      const categoryName = getCategoryForNavigation(category);
      
      if (categoryName !== 'Semua' && categoryName !== 'All') {
        await fetchArticlesByCategory(categoryName);
      }
      
      navigateToCategory(navigation, categoryName, category);
      
      return {
        success: true,
        categoryName,
        articleCount: getArticlesByDiseaseCategory(categoryName).length
      };
    } catch (error: any) {
      console.error(' Error in category navigation:', error);
      setError(error.message || 'Navigation error');
      return {
        success: false,
        error: error.message || 'Navigation error'
      };
    }
  };

  const getCategoryForNavigation = (categoryObject: any) => {
    return categoryObject?.category || categoryObject?.name || categoryObject;
  };

  const getFilteredArticlesForNavigation = (categoryName: any, searchText = '') => {
    return filterArticles(categoryName, searchText);
  };

  const categoryHasArticles = (categoryName: any) => {
    if (!categoryName) return false;
    
    // Optimistic: if category is in our formal list from server, assume it's available
    if (cache.categories && cache.categories.includes(categoryName)) {
      return true;
    }
    
    // Fallback: check currently loaded articles
    return getArticlesByDiseaseCategory(categoryName).length > 0;
  };

  const setActiveFilter = (filterData: any) => {
    setCurrentFilter(filterData);
  };

  const clearActiveFilter = () => {
    setCurrentFilter(null);
  };

  const getActiveFilter = () => {
    return currentFilter;
  };

  const clearError = () => {
    setError(null);
  };

  const refreshData = async () => {
    setCache({
      categories: null,
      allArticles: null,
      categoryArticles: {},
      lastFetch: null
    });
    await initializeData();
  };

  return (
    <UsadaContext.Provider
      value={{
        articles,
        selectedArticle,
        favorites,
        categories,
        currentFilter,
        loading,
        error,
        selectArticle,
        toggleFavorite,
        isFavorite,
        getDiseaseCategories,
        getAllCategories,
        filterArticles,
        getArticlesByDiseaseCategory,
        getFilteredArticlesForNavigation,
        categoryHasArticles,
        navigateToCategory,
        navigateToArticle,
        handleCategoryNavigation,
        getCategoryForNavigation,
        setActiveFilter,
        clearActiveFilter,
        getActiveFilter,
        fetchArticles,
        fetchArticleBySlug,
        fetchArticleById,
        fetchArticlesByCategory,
        searchArticles,
        fetchCategories,
        fetchLatestArticles,
        fetchPopularArticles,
        getFullImageUrl,
        clearError,
        refreshData,
        initializeData,
        API_BASE_URL,
        IMAGE_BASE_URL,
      }}
    >
      {children}
    </UsadaContext.Provider>
  );
};

export const useUsada = () => {
  const context = useContext(UsadaContext);
  if (!context) {
    throw new Error('useUsada must be used within a UsadaProvider');
  }
  return context;
};