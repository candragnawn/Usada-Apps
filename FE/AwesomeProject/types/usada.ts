import { ReactNode } from 'react';

export interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  image_url_full?: string | null;
  image?: string | null;
  images?: string[] | string;
  created_at: string;
  published_at?: string;
  slug: string;
  excerpt?: string;
  benefits?: string[];
  ingredients?: string[];
  preparation_steps?: any;
  view_count?: number;
}

export interface UsadaContextType {
  articles: Article[];
  selectedArticle: Article | null;
  favorites: number[];
  loading: boolean;
  error: string | null;
  categories: string[];
  currentFilter: any;
  fetchArticles: (params?: any) => Promise<{ articles: Article[]; meta?: any }>;
  fetchArticleBySlug: (slug: string) => Promise<{ article: Article; relatedArticles: Article[] }>;
  fetchArticleById: (id: any) => Promise<Article>;
  fetchArticlesByCategory: (category: string, params?: any) => Promise<{ articles: Article[]; meta?: any }>;
  searchArticles: (searchTerm: string, category?: any, params?: any) => Promise<{ articles: Article[]; meta?: any }>;
  fetchCategories: () => Promise<string[]>;
  fetchLatestArticles: (limit?: number) => Promise<Article[]>;
  fetchPopularArticles: (limit?: number) => Promise<Article[]>;
  selectArticle: (articleId: number) => void;
  toggleFavorite: (articleId: number) => void;
  isFavorite: (articleId: number) => boolean;
  getDiseaseCategories: () => any[];
  getAllCategories: () => string[];
  filterArticles: (category: any, searchText: any) => Article[];
  getArticlesByDiseaseCategory: (categoryName: any) => Article[];
  getFilteredArticlesForNavigation: (categoryName: any, searchText?: string) => Article[];
  categoryHasArticles: (categoryName: any) => boolean;
  setActiveFilter: (filterData: any) => void;
  clearActiveFilter: () => void;
  getActiveFilter: () => any;
  navigateToCategory: (navigation: any, categoryName: any, categoryData?: any) => void;
  navigateToArticle: (navigation: any, article: any, fromCategory?: any) => void;
  handleCategoryNavigation: (navigation: any, category: any) => Promise<{ success: boolean; categoryName?: string; articleCount?: number; error?: string }>;
  getCategoryForNavigation: (categoryObject: any) => string;
  getFullImageUrl: (imagePath: any) => string | null;
  clearError: () => void;
  refreshData: (params?: any) => Promise<void>;
  initializeData: () => Promise<void>;
  API_BASE_URL: string;
  IMAGE_BASE_URL: string;
}
