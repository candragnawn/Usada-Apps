// src/contexts/ProductsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, ProductsContextType } from '../types';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
}

// API configuration
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.18.207:8000';
// const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE || 'http://192.168.18.207:8000/storage/';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.0.100:8000';
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE || 'http://192.168.0.100:8000/storage';

// API helper function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Only add Content-Type for JSON requests, not FormData
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers = {
      'Content-Type': 'application/json',
      ...defaultOptions.headers,
    };
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Transform product data to include full image URLs
const transformProduct = (product: any): Product => {
  return {
    ...product,
    images: product.images?.map((imagePath: string) => 
      imagePath.startsWith('http') ? imagePath : `${IMAGE_BASE_URL}${imagePath}`
    ) || [],
    // Ensure variants are properly structured
    variants: product.variants || [],
  };
};

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch all products
  const fetchProducts = async (): Promise<void> => {
    setProductsLoading(true);
    try {
      const response = await apiCall('/api/products');
      
      // Laravel returns { status: 'success', data: [...] }
      if (response.status === 'success' && Array.isArray(response.data)) {
        const transformedProducts = response.data.map(transformProduct);
        setProducts(transformedProducts);
      } else {
        console.warn('Unexpected response structure:', response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      throw error;
    } finally {
      setProductsLoading(false);
    }
  };

  // Get product by ID
  const getProductById = async (id: number): Promise<Product> => {
    setProductLoading(true);
    
    try {
      const response = await apiCall(`/api/products/${id}`);
      
      // Laravel returns { status: 'success', data: {...} }
      if (response.status === 'success' && response.data && response.data.id) {
        const transformedProduct = transformProduct(response.data);
        setProduct(transformedProduct);
        return transformedProduct;
      } else {
        throw new Error(`Product with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    } finally {
      setProductLoading(false);
    }
  };

  // Get all categories
  const getAllCategories = async (): Promise<void> => {
    try {
      const response = await apiCall('/api/categories');
      
      // Handle Laravel response structure
      if (response.status === 'success' && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        setCategories(response);
      } else {
        console.warn('Unexpected categories response structure:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      throw error;
    }
  };

  // Create new product
  const createProduct = async (productData: FormData): Promise<Product> => {
    try {
      const response = await apiCall('/api/products', {
        method: 'POST',
        body: productData,
      });

      // Laravel returns { status: 'success', message: '...', data: {...} }
      if (response.status === 'success') {
        // Refresh products list
        await fetchProducts();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  // Update product
  const updateProduct = async (id: number, productData: FormData): Promise<Product> => {
    try {
      // Add _method field for Laravel method spoofing
      productData.append('_method', 'PUT');
      
      const response = await apiCall(`/api/products/${id}`, {
        method: 'POST', // Using POST with _method for FormData
        body: productData,
      });

      // Laravel returns { status: 'success', message: '...', data: {...} }
      if (response.status === 'success') {
        // Refresh products list
        await fetchProducts();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (id: number): Promise<void> => {
    try {
      const response = await apiCall(`/api/products/${id}`, {
        method: 'DELETE',
      });

      // Laravel returns { status: 'success', message: '...' }
      if (response.status === 'success') {
        // Remove product from local state
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProducts(),
          getAllCategories()
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        loading,
        productsLoading,
        productLoading,
        products,
        product,
        categories,
        fetchProducts,
        getProductById,
        getAllCategories,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
};