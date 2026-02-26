// src/contexts/FilterContext.tsx
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { useProductsContext } from './ProductsContext';
import { Product, Category } from '../types';

// Types
interface PriceRange {
  min: string;
  max: string;
}

interface FilterContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  productsPerPage: number;
  setProductsPerPage: (count: number) => void;
  
  // Computed values
  categories: string[]; // Changed to string array to match ProductScreen usage
  filteredAndSortedProducts: Product[];
  paginatedProducts: Product[];
  totalPages: number;
  totalProducts: number;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  clearFilters: () => void;
  refreshData: () => Promise<void>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>("grid");
  const [productsPerPage, setProductsPerPage] = useState<number>(6); // Reduced to match pagination display

  const { 
    products, 
    categories: categoryData, 
    loading,
    productsLoading,
    fetchProducts,
    getAllCategories
  } = useProductsContext();

  // Extract unique categories from products and combine with API categories
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    categorySet.add("All"); // Always include "All" option

    // Add categories from API
    if (categoryData && Array.isArray(categoryData)) {
      categoryData.forEach((category: Category) => {
        if (category.name) {
          categorySet.add(category.name);
        }
      });
    }

    // Add categories from products (fallback)
    if (products && Array.isArray(products)) {
      products.forEach((product: Product) => {
        if (product.category?.name) {
          categorySet.add(product.category.name);
        }
      });
    }

    return Array.from(categorySet);
  }, [categoryData, products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      console.log('No products available or products is not an array');
      return [];
    }

    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((product: Product) => {
        if (product.category?.name) {
          return product.category.name === selectedCategory;
        }
        return false;
      });
    }

    // Search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product: Product) => {
        const name = product.name?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        const categoryName = product.category?.name?.toLowerCase() || '';
        
        return name.includes(query) || 
               description.includes(query) || 
               categoryName.includes(query);
      });
    }

    // Price range filter
    if (priceRange.min && priceRange.min !== "" && !isNaN(Number(priceRange.min))) {
      const minPrice = Number(priceRange.min);
      result = result.filter((product: Product) => {
        const price = Number(product.price) || 0;
        return price >= minPrice;
      });
    }
    
    if (priceRange.max && priceRange.max !== "" && !isNaN(Number(priceRange.max))) {
      const maxPrice = Number(priceRange.max);
      result = result.filter((product: Product) => {
        const price = Number(product.price) || 0;
        return price <= maxPrice;
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a: Product, b: Product) => {
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a: Product, b: Product) => {
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        result.sort((a: Product, b: Product) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        });
        break;
      case "name-desc":
        result.sort((a: Product, b: Product) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameB.localeCompare(nameA);
        });
        break;
      case "newest":
        result.sort((a: Product, b: Product) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "oldest":
        result.sort((a: Product, b: Product) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case "featured":
      default:
        // Keep original order for featured/default
        // You could add featured logic here if you have a featured field
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy, searchQuery, priceRange]);

  // Calculate pagination
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, productsPerPage]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchQuery, priceRange, productsPerPage]);

  // Validate current page when total pages change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("featured");
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const refreshData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        getAllCategories()
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      throw error;
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const value: FilterContextType = {
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode: handleViewModeChange,
    productsPerPage,
    setProductsPerPage,
    categories,
    filteredAndSortedProducts,
    paginatedProducts,
    totalPages,
    totalProducts,
    isLoading: loading || productsLoading,
    clearFilters,
    refreshData,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};