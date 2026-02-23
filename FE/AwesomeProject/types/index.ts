// src/types.ts

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  price: number;
  stock: number;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  category?: Category;
  images: string[];
  variants?: ProductVariant[];
  sku?: string;
  status?: 'active' | 'inactive';
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsContextType {
  // Loading states
  loading: boolean;
  productsLoading: boolean;
  productLoading: boolean;
  
  // Data
  products: Product[];
  product: Product | null;
  categories: Category[];
  
  // Methods
  fetchProducts: () => Promise<void>;
  getProductById: (id: number) => Promise<Product>;
  getAllCategories: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<Product>;
  updateProduct: (id: number, productData: FormData) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
}

// Additional types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Navigation types (if using React Navigation)
export interface ProductScreenNavigationProp {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

export interface ProductScreenRouteProp {
  params?: {
    productId?: number;
    categoryId?: number;
  };
}
export interface ProductFormData {
  name: string;
  price: number;
  company: string;
  category_id: number;
  description?: string;
  is_active?: boolean;
  variants: ProductVariant[];
  new_images?: File[];
  deleted_images?: string[];
}

export interface PriceRange {
  min: string;
  max: string;
}



export interface FilterContextType {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  priceRange: PriceRange;
  setPriceRange: React.Dispatch<React.SetStateAction<PriceRange>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  categories: string[];
  filteredAndSortedProducts: Product[];
  paginatedProducts: Product[];
  totalPages: number;
  clearFilters: () => void;
  productsPerPage: number;
  viewMode: string;
  setViewMode: React.Dispatch<React.SetStateAction<string>>;
}

export interface ProductCardProps {
  product: Product;
  viewMode?: string;
}

export interface HeroProps {
  title: string;
  description: string;
}

export interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  priceRange: PriceRange;
  setPriceRange: React.Dispatch<React.SetStateAction<PriceRange>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  clearFilters: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

