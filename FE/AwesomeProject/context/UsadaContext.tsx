import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UsadaContext = createContext({
  articles: [],
  selectedArticle: null,
  favorites: [],
  loading: false,
  error: null,
  categories: ['Semua'],
  currentFilter: null,
  fetchArticles: async (params?: any) => {},
  fetchArticleBySlug: async (slug: string) => {},
  fetchArticleById: async (id: any) => {},
  fetchArticlesByCategory: async (category: string, params?: any) => {},
  searchArticles: async (searchTerm: string, category?: any, params?: any) => {},
  fetchCategories: async () => [] as any[],
  fetchLatestArticles: async (limit?: number) => [] as any[],
  fetchPopularArticles: async (limit?: number) => [] as any[],
  selectArticle: (article: any) => {},
  toggleFavorite: (articleId: any) => {},
  isFavorite: (articleId: any) => false,
  getDiseaseCategories: () => [] as any[],
  getAllCategories: () => [] as string[],
  filterArticles: (category: any, searchText: any) => [] as any[],
  getArticlesByDiseaseCategory: (categoryName: any) => [] as any[],
  getFilteredArticlesForNavigation: (categoryName: any, searchText?: string) => [] as any[],
  categoryHasArticles: (categoryName: any) => false,
  setActiveFilter: (filterData: any) => {},
  clearActiveFilter: () => {},
  getActiveFilter: () => null as any,
  navigateToCategory: (navigation: any, categoryName: any, categoryData?: any) => {},
  navigateToArticle: (navigation: any, article: any, fromCategory?: any) => {},
  handleCategoryNavigation: async (navigation: any, category: any) => ({ success: false }),
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
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || process.env.REACT_APP_IMAGE || `${API_BASE_URL}/storage`;

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
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Custom provider component
export const UsadaProvider = ({ children }) => {
  // Core state
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['Semua']);
  const [currentFilter, setCurrentFilter] = useState(null);

  // Cache for better performance
  const [cache, setCache] = useState({
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
      
      // Fetch categories and articles in parallel for better performance
      await Promise.all([
        fetchCategories(),
        fetchArticles()
      ]);
      
      console.log('✅ UsadaContext initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing UsadaContext:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  // Helper function to transform article data
  const transformArticle = (article) => ({
    ...article,
    image_url: getFullImageUrl(article.image_url || article.image),
    image: getFullImageUrl(article.image_url || article.image), // For compatibility
    // Ensure required fields exist
    id: article.id,
    title: article.title || 'Untitled',
    description: article.description || article.excerpt || '',
    category: article.category || 'Uncategorized',
    created_at: article.created_at || article.published_at || new Date().toISOString(),
    slug: article.slug || article.id?.toString() || '',
  });

  // API Functions
  const fetchArticles = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first (cache for 5 minutes)
      const now = Date.now();
      if (cache.allArticles && cache.lastFetch && (now - cache.lastFetch) < 300000) {
        console.log('📋 Using cached articles');
        setArticles(cache.allArticles);
        return { articles: cache.allArticles };
      }
      
      const response = await apiClient.get('/articles', { params });
      
      if (response.data && (response.data.success || response.data.data)) {
        const articlesData = response.data.data || response.data;
        const articlesWithFullUrls = Array.isArray(articlesData) 
          ? articlesData.map(transformArticle)
          : [];
        
        setArticles(articlesWithFullUrls);
        
        // Update cache
        setCache(prev => ({
          ...prev,
          allArticles: articlesWithFullUrls,
          lastFetch: now
        }));
        
        console.log('✅ Articles fetched:', articlesWithFullUrls.length);
        
        return {
          articles: articlesWithFullUrls,
          meta: response.data.meta
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error fetching articles:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch articles';
      setError(errorMessage);
      
      // Return cached data if available
      if (cache.allArticles) {
        console.log('📋 Returning cached articles due to error');
        setArticles(cache.allArticles);
        return { articles: cache.allArticles };
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleBySlug = async (slug) => {
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
    } catch (err) {
      console.error('❌ Error fetching article by slug:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch article';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to find in current articles
      const existingArticle = articles.find(article => article.id === parseInt(id));
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
      } catch (directError) {
        console.log('Direct fetch failed, trying list approach');
      }
      
      // Fallback: get from articles list
      const response = await apiClient.get('/articles', { 
        params: { per_page: 100 }
      });
      
      if (response.data && (response.data.success || response.data.data)) {
        const articlesData = response.data.data || response.data;
        const article = Array.isArray(articlesData) 
          ? articlesData.find(article => article.id === parseInt(id))
          : null;
        
        if (article) {
          const articleWithFullUrl = transformArticle(article);
          setSelectedArticle(articleWithFullUrl);
          return articleWithFullUrl;
        } else {
          throw new Error('Article not found');
        }
      } else {
        throw new Error('Failed to fetch article');
      }
    } catch (err) {
      console.error('❌ Error fetching article by ID:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch article';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByCategory = async (category, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = `${category}_${JSON.stringify(params)}`;
      if (cache.categoryArticles[cacheKey]) {
        console.log('📋 Using cached category articles:', category);
        return { articles: cache.categoryArticles[cacheKey] };
      }
      
      // Try different API endpoints
      let response;
      const endpoints = [
        `/articles/category/${category}`,
        `/articles?category=${category}`,
        '/articles'
      ];
      
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
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed, trying next...`);
          continue;
        }
      }
      
      if (!response) {
        throw new Error('All category endpoints failed');
      }
      
      if (response.data && (response.data.success || response.data.data)) {
        let articlesData = response.data.data || response.data;
        
        // If we got all articles, filter by category
        if (Array.isArray(articlesData)) {
          if (category !== 'Semua' && category !== 'All') {
            articlesData = articlesData.filter(article => 
              article.category === category ||
              article.category?.toLowerCase() === category.toLowerCase()
            );
          }
        }
        
        const articlesWithFullUrls = Array.isArray(articlesData) 
          ? articlesData.map(transformArticle)
          : [];
        
        // Update cache
        setCache(prev => ({
          ...prev,
          categoryArticles: {
            ...prev.categoryArticles,
            [cacheKey]: articlesWithFullUrls
          }
        }));
        
        console.log('✅ Category articles fetched:', category, articlesWithFullUrls.length);
        
        return {
          articles: articlesWithFullUrls,
          meta: response.data.meta
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error fetching articles by category:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch articles by category';
      setError(errorMessage);
      
      // Fallback to local filtering if we have articles
      if (articles.length > 0) {
        console.log('📋 Using local filtering for category:', category);
        const filtered = getArticlesByDiseaseCategory(category);
        return { articles: filtered };
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (searchTerm, category = null, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!searchTerm || !searchTerm.trim()) {
        throw new Error('Search term is required');
      }

      const searchParams = {
        q: searchTerm.trim(),
        search: searchTerm.trim(), // Alternative parameter name
        ...params
      };
      
      if (category && category !== 'Semua' && category !== 'All') {
        searchParams.category = category;
      }

      // Try different search endpoints
      let response;
      const endpoints = ['/articles/search', '/search', '/articles'];
      
      for (const endpoint of endpoints) {
        try {
          response = await apiClient.get(endpoint, { params: searchParams });
          break;
        } catch (endpointError) {
          console.log(`Search endpoint ${endpoint} failed, trying next...`);
          continue;
        }
      }
      
      if (!response) {
        // Fallback to local search
        console.log('🔍 Using local search fallback');
        return performLocalSearch(searchTerm, category);
      }
      
      if (response.data && (response.data.success || response.data.data)) {
        let articlesData = response.data.data || response.data;
        
        const articlesWithFullUrls = Array.isArray(articlesData) 
          ? articlesData.map(transformArticle)
          : [];
        
        console.log('✅ Search completed:', searchTerm, articlesWithFullUrls.length);
        
        return {
          articles: articlesWithFullUrls,
          meta: response.data.meta
        };
      } else {
        throw new Error('Search failed');
      }
    } catch (err) {
      console.error('❌ Error searching articles:', err);
      
      // Fallback to local search
      console.log('🔍 Using local search fallback due to error');
      return performLocalSearch(searchTerm, category);
    } finally {
      setLoading(false);
    }
  };

  // Local search fallback
  const performLocalSearch = (searchTerm, category = null) => {
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
      
      // Check cache first
      if (cache.categories && (cache.categories as any[]).length > 0) {
        console.log('📋 Using cached categories');
        const finalCategories = ['Semua', ...(cache.categories as any[])];
        setCategories(finalCategories);
        return finalCategories;
      }
      
      // Try to fetch from API
      try {
        const response = await apiClient.get('/articles/categories');
        
        if (response.data && (response.data.success || response.data.data)) {
          const categoriesData = response.data.data || response.data;
          const validCategories = Array.isArray(categoriesData) 
            ? categoriesData.filter(Boolean)
            : [];
          
          const finalCategories = ['Semua', ...validCategories];
          setCategories(finalCategories);
          
          // Update cache
          setCache(prev => ({
            ...prev,
            categories: validCategories
          }));
          
          console.log('✅ Categories fetched from API:', validCategories.length);
          return finalCategories;
        }
      } catch (apiError) {
        console.log('API categories fetch failed, extracting from articles');
      }
      
      // Fallback: extract from articles
      if (articles.length > 0) {
        const extractedCategories = [...new Set(
          articles.map(article => article.category).filter(Boolean)
        )];
        
        const finalCategories = ['Semua', ...extractedCategories];
        setCategories(finalCategories);
        
        console.log('✅ Categories extracted from articles:', extractedCategories.length);
        return finalCategories;
      }
      
      // Final fallback
      const fallbackCategories = ['Semua'];
      setCategories(fallbackCategories);
      return fallbackCategories;
      
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      
      // Return basic categories on error
      const fallbackCategories = ['Semua'];
      setCategories(fallbackCategories);
      return fallbackCategories;
    }
  };

  const fetchLatestArticles = async (limit = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/articles/latest', { 
        params: { limit } 
      });
      
      if (response.data && (response.data.success || response.data.data)) {
        const articlesData = response.data.data || response.data;
        const articlesWithFullUrls = Array.isArray(articlesData) 
          ? articlesData.map(transformArticle)
          : [];
        
        console.log('✅ Latest articles fetched:', articlesWithFullUrls.length);
        return articlesWithFullUrls;
      } else {
        // Fallback to regular articles sorted by date
        const sortedArticles = [...articles]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, limit);
        
        console.log('✅ Latest articles from fallback:', sortedArticles.length);
        return sortedArticles;
      }
    } catch (err) {
      console.error('❌ Error fetching latest articles:', err);
      
      // Fallback to local sorting
      const sortedArticles = [...articles]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);
      
      console.log('✅ Latest articles from local fallback:', sortedArticles.length);
      return sortedArticles;
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularArticles = async (limit = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/articles/popular', { 
        params: { limit } 
      });
      
      if (response.data && (response.data.success || response.data.data)) {
        const articlesData = response.data.data || response.data;
        const articlesWithFullUrls = Array.isArray(articlesData) 
          ? articlesData.map(transformArticle)
          : [];
        
        console.log('✅ Popular articles fetched:', articlesWithFullUrls.length);
        return articlesWithFullUrls;
      } else {
        // Fallback to random articles
        const randomArticles = [...articles]
          .sort(() => 0.5 - Math.random())
          .slice(0, limit);
        
        console.log('✅ Popular articles from fallback:', randomArticles.length);
        return randomArticles;
      }
    } catch (err) {
      console.error('❌ Error fetching popular articles:', err);
      
      // Fallback to random selection
      const randomArticles = [...articles]
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
      
      console.log('✅ Popular articles from local fallback:', randomArticles.length);
      return randomArticles;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced local utility functions for UI compatibility
  const selectArticle = (articleId) => {
    const article = articles.find(article => article.id === articleId);
    setSelectedArticle(article);
  };

  const toggleFavorite = (articleId) => {
    if (favorites.includes(articleId)) {
      setFavorites(favorites.filter(id => id !== articleId));
    } else {
      setFavorites([...favorites, articleId]);
    }
  };

  const isFavorite = (articleId) => {
    return favorites.includes(articleId);
  };

  const getDiseaseCategories = () => {
    const uniqueCategories = [];
    const seenCategories = new Set();

    articles.forEach(article => {
      if (article.category && !seenCategories.has(article.category)) {
        seenCategories.add(article.category);
        uniqueCategories.push({
          id: `category-${article.category}`,
          name: article.category,
          category: article.category,
          icon: article.image_url || article.image,
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

  const getArticlesByDiseaseCategory = (categoryName) => {
    if (!categoryName || categoryName === 'Semua' || categoryName === 'All') {
      return articles;
    }
    
    return articles.filter(article => 
      article.category === categoryName ||
      article.category?.toLowerCase() === categoryName.toLowerCase()
    );
  };

  const filterArticles = (category, searchText) => {
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

  // Enhanced navigation functions
  const navigateToCategory = (navigation, categoryName, categoryData = null) => {
    console.log('🧭 Navigating to category:', categoryName);
    
    // Set current filter for state management
    setCurrentFilter({
      type: 'category',
      name: categoryName,
      data: categoryData
    });

    // Navigate with comprehensive category data
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

  const navigateToArticle = (navigation, article, fromCategory = null) => {
    console.log('🧭 Navigating to article:', article.title);
    
    navigation.navigate('ArticleDetail', {
      article: article,
      articleId: article.id,
      articleSlug: article.slug,
      fromCategory: fromCategory,
      backTo: fromCategory ? 'UsadaScreen' : 'Home',
    });
  };

  const handleCategoryNavigation = async (navigation, category) => {
    try {
      const categoryName = getCategoryForNavigation(category);
      
      // Optionally fetch fresh articles for this category
      if (categoryName !== 'Semua' && categoryName !== 'All') {
        await fetchArticlesByCategory(categoryName);
      }
      
      // Navigate with category context
      navigateToCategory(navigation, categoryName, category);
      
      return {
        success: true,
        categoryName,
        articleCount: getArticlesByDiseaseCategory(categoryName).length
      };
    } catch (error) {
      console.error('❌ Error in category navigation:', error);
      setError(error.message);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const getCategoryForNavigation = (categoryObject) => {
    return categoryObject?.category || categoryObject?.name || categoryObject;
  };

  const getFilteredArticlesForNavigation = (categoryName, searchText = '') => {
    return filterArticles(categoryName, searchText);
  };

  const categoryHasArticles = (categoryName) => {
    return getArticlesByDiseaseCategory(categoryName).length > 0;
  };


  const setActiveFilter = (filterData) => {
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
        // Data
        articles,
        selectedArticle,
        favorites,
        categories,
        currentFilter,
        
        // States
        loading,
        error,
        
        // Local functions (UI compatibility)
        selectArticle,
        toggleFavorite,
        isFavorite,
        getDiseaseCategories,
        getAllCategories,
        filterArticles,
        getArticlesByDiseaseCategory,
        getFilteredArticlesForNavigation,
        categoryHasArticles,
        
        // Enhanced navigation functions
        navigateToCategory,
        navigateToArticle,
        handleCategoryNavigation,
        getCategoryForNavigation,
        
        // Filter management
        setActiveFilter,
        clearActiveFilter,
        getActiveFilter,
        
        // API functions
        fetchArticles,
        fetchArticleBySlug,
        fetchArticleById,
        fetchArticlesByCategory,
        searchArticles,
        fetchCategories,
        fetchLatestArticles,
        fetchPopularArticles,
        
        // Utilities
        getFullImageUrl,
        clearError,
        refreshData,
        initializeData,
        
        // API Configuration
        API_BASE_URL,
        IMAGE_BASE_URL,
      }}
    >
      {children}
    </UsadaContext.Provider>
  );
};

// Custom hook for using the context
export const useUsada = () => {
  const context = useContext(UsadaContext);
  if (!context) {
    throw new Error('useUsada must be used within a UsadaProvider');
  }
  return context;
};