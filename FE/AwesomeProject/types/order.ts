export interface ShippingInfo {
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  address_description: string;
}

export interface OrderItem {
  product_variant_id: number;
  quantity: number;
  price: number;
}

export interface OrderData {
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  address_description: string;
  price: number;
  products: OrderItem[];
  payment_channel?: string;
  payment_method?: string;
}

export interface Order {
  id: number;
  status: string;
  price: number;
  url?: string;
  invoice_url?: string;
  created_at?: string;
  // Add other order fields as needed
}

export interface OrderContextType {
  orders: Order[];
   getUserOrders: Order
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  shippingInfo: ShippingInfo;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  clearError: () => void;
  updateShippingInfo: (updates: Partial<ShippingInfo>) => void;
  clearShippingInfo: () => void;
  loadShippingInfo: () => Promise<void>;
  createOrder: (orderData: OrderData) => Promise<{ success: boolean; data?: Order; message?: string; errors?: any }>;
  generatePaymentInvoice: (orderId: number) => Promise<{ success: boolean; invoice_url?: string; message?: string }>;
  checkOrderStatus: (orderId: number) => Promise<{ success: boolean; data?: any; message?: string; error?: string }>;
  completePaymentFlow: (orderId: number) => Promise<{ success: boolean; data?: Order; message?: string }>;
  getUserOrders: (page?: number) => Promise<{ success: boolean; data?: Order[]; pagination?: any; message?: string }>;
  getOrderDetails: (orderId: number) => Promise<{ success: boolean; data?: Order; message?: string }>;
  cancelOrder: (orderId: number) => Promise<{ success: boolean; message?: string }>;
  refreshOrders: () => Promise<{ success: boolean; data?: Order[]; pagination?: any; message?: string }>;
  loadMoreOrders: () => Promise<{ success: boolean; data?: Order[]; message?: string }>;
}
