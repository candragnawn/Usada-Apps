// OrderContext.tsx - Type-safe implementation
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define order related types
export type Order = {
  id: number;
  status: string;
  price: number | string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ShippingInfo = {
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  address_description: string;
};

export type OrderState = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  shippingInfo: ShippingInfo;
  pagination: Pagination;
};

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  
  shippingInfo: {
    phone: '',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Indonesia',
    address_description: '',
  },
  
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_SHIPPING_INFO: 'UPDATE_SHIPPING_INFO',
  CLEAR_SHIPPING_INFO: 'CLEAR_SHIPPING_INFO',
  SET_ORDERS: 'SET_ORDERS',
  SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  CLEAR_ORDERS: 'CLEAR_ORDERS',
  SET_PAGINATION: 'SET_PAGINATION',
} as const;

type Action = 
  | { type: typeof ActionTypes.SET_LOADING; payload: boolean }
  | { type: typeof ActionTypes.SET_ERROR; payload: string | null }
  | { type: typeof ActionTypes.CLEAR_ERROR }
  | { type: typeof ActionTypes.UPDATE_SHIPPING_INFO; payload: Partial<ShippingInfo> }
  | { type: typeof ActionTypes.CLEAR_SHIPPING_INFO }
  | { type: typeof ActionTypes.SET_ORDERS; payload: Order[] }
  | { type: typeof ActionTypes.SET_CURRENT_ORDER; payload: Order | null }
  | { type: typeof ActionTypes.ADD_ORDER; payload: Order }
  | { type: typeof ActionTypes.UPDATE_ORDER_STATUS; payload: { id: number; updates: Partial<Order> } }
  | { type: typeof ActionTypes.CLEAR_ORDERS }
  | { type: typeof ActionTypes.SET_PAGINATION; payload: Pagination };

// Reducer
const orderReducer = (state: OrderState, action: Action): OrderState => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.UPDATE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: { ...state.shippingInfo, ...action.payload }
      };
    
    case ActionTypes.CLEAR_SHIPPING_INFO:
      return { ...state, shippingInfo: initialState.shippingInfo };
    
    case ActionTypes.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null
      };
    
    case ActionTypes.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
        loading: false,
        error: null
      };
    
    case ActionTypes.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
        loading: false,
        error: null
      };
    
    case ActionTypes.UPDATE_ORDER_STATUS:
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload.id
          ? { ...order, ...action.payload.updates }
          : order
      );
      
      const updatedCurrentOrder = state.currentOrder?.id === action.payload.id
        ? { ...state.currentOrder, ...action.payload.updates }
        : state.currentOrder;
      
      return {
        ...state,
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder
      };
    
    case ActionTypes.CLEAR_ORDERS:
      return {
        ...state,
        orders: [],
        currentOrder: null
      };
    
    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };
    
    default:
      return state;
  }
};

export type OrderContextType = OrderState & {
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  clearError: () => void;
  updateShippingInfo: (updates: Partial<ShippingInfo>) => void;
  clearShippingInfo: () => void;
  loadShippingInfo: () => Promise<void>;
  createOrder: (orderData: any) => Promise<any>;
  generatePaymentInvoice: (orderId: number) => Promise<any>;
  checkOrderStatus: (orderId: number) => Promise<any>;
  completePaymentFlow: (orderId: number) => Promise<any>;
  getUserOrders: (page?: number) => Promise<any>;
  getOrderDetails: (orderId: number) => Promise<any>;
  cancelOrder: (orderId: number) => Promise<any>;
  refreshOrders: () => Promise<any>;
  loadMoreOrders: () => Promise<any>;
  clearOrders: () => void;
  setCurrentOrder: (order: Order | null) => void;
};

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// API configuration
const API_BASE_URL_ORDER = process.env.EXPO_PUBLIC_API_URL_ORDER || process.env.REACT_APP_API_URL_ORDER;

// API helper functions
const getAuthToken = async (): Promise<string | null> => {
  try {
    // Try multiple possible token keys
    let token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      token = await AsyncStorage.getItem('token');
    }
    if (!token) {
      token = await AsyncStorage.getItem('access_token');
    }
    
    console.log('🔑 Retrieved token:', token ? 'Token found' : 'No token found');
    return token;
  } catch (error) {
    console.error('❌ Error getting auth token:', error);
    return null;
  }
};

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

const makeApiRequest = async (endpoint: string, options: ApiOptions = {}): Promise<any> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    };

    console.log(`🌐 Making API request to: ${API_BASE_URL_ORDER}${endpoint}`);
    console.log('📤 Request config:', {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : undefined
    });

    const response = await fetch(`${API_BASE_URL_ORDER}${endpoint}`, config);
    
    console.log(`📡 API Response status: ${response.status}`);
    
    const responseData = await response.json();
    console.log('📥 API Response data:', responseData);

    if (!response.ok) {
      // Handle different error responses
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      } else if (response.status === 422) {
        // Validation errors
        const errorMessage = responseData.message || 'Validation failed';
        const errors = responseData.errors;
        throw new Error(errors ? `${errorMessage}: ${Object.values(errors).flat().join(', ')}` : errorMessage);
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(responseData.message || `Request failed with status ${response.status}`);
      }
    }

    return responseData;
  } catch (error: any) {
    console.error(`❌ API request failed for ${endpoint}:`, error);
    
    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw error;
  }
};

// Context Provider
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Helper functions
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error: any) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  // Shipping info management
  const updateShippingInfo = useCallback((updates: Partial<ShippingInfo>) => {
    dispatch({ type: ActionTypes.UPDATE_SHIPPING_INFO, payload: updates });
    
    // Persist to AsyncStorage
    AsyncStorage.setItem('shippingInfo', JSON.stringify({
      ...state.shippingInfo,
      ...updates
    })).catch(console.error);
  }, [state.shippingInfo]);

  const clearShippingInfo = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_SHIPPING_INFO });
    AsyncStorage.removeItem('shippingInfo').catch(console.error);
  }, []);

  const loadShippingInfo = useCallback(async () => {
    try {
      const savedInfo = await AsyncStorage.getItem('shippingInfo');
      if (savedInfo) {
        const parsedInfo = JSON.parse(savedInfo);
        dispatch({ type: ActionTypes.UPDATE_SHIPPING_INFO, payload: parsedInfo });
      }
    } catch (error) {
      console.error('Error loading shipping info:', error);
    }
  }, []);

  // 🚀 STEP 1: Create order function (called from CheckoutScreen)
  const createOrder = useCallback(async (orderData: any) => {
    try {
      setLoading(true);
      clearError();

      console.log('=== STEP 1: Creating order ===');
      console.log('Raw order data received:', orderData);

      // Validate that we have complete order data
      if (!orderData || typeof orderData !== 'object') {
        throw new Error('Invalid order data: must be an object');
      }

      // Validate required fields based on backend requirements
      const requiredFields = [
        'phone', 'first_name', 'email', 'address', 
        'city', 'postal_code', 'country', 'price', 'products'
      ];

      const missingFields = requiredFields.filter(field => {
        const value = orderData[field];
        
        // Special handling for products array
        if (field === 'products') {
          return !Array.isArray(value) || value.length === 0;
        }
        
        // Special handling for price
        if (field === 'price') {
          return !value || value <= 0;
        }
        
        // General validation for other fields
        return !value || (typeof value === 'string' && !value.trim());
      });

      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate products array structure
      if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
        throw new Error('Products array is required and must not be empty');
      }

      // 🚀 STEP 1.2: Sync with inventory (backend handles this, but we validate local state)
      const productsForApi = orderData.products.map((product: any, index: number) => {
        const requiredProductFields = ['product_variant_id', 'quantity', 'price'];
        const missingProductFields = requiredProductFields.filter(field => {
          const value = product[field];
          return !value || (typeof value === 'number' && value <= 0);
        });

        if (missingProductFields.length > 0) {
          console.error(`❌ Product ${index + 1} missing fields:`, missingProductFields);
          throw new Error(`Product ${index + 1} missing required fields: ${missingProductFields.join(', ')}`);
        }

        // Validate data types
        if (!Number.isInteger(product.product_variant_id) || product.product_variant_id <= 0) {
          throw new Error(`Product ${index + 1}: product_variant_id must be a positive integer`);
        }

        if (!Number.isInteger(product.quantity) || product.quantity <= 0) {
          throw new Error(`Product ${index + 1}: quantity must be a positive integer`);
        }

        if (typeof product.price !== 'number' || product.price <= 0) {
          throw new Error(`Product ${index + 1}: price must be a positive number`);
        }
        return product; // Return the product after validation
      });

      // Log final validation
      console.log('✅ Order validation passed:');
      console.log(`- Customer: ${orderData.first_name} ${orderData.last_name || ''}`);
      console.log(`- Email: ${orderData.email}`);
      console.log(`- Phone: ${orderData.phone}`);
      console.log(`- Total price: ${orderData.price}`);
      console.log(`- Products count: ${orderData.products.length}`);

      // Send the complete order data to backend
      console.log('📤 Sending order data to backend API...');
      
      const response = await makeApiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      console.log('✅ Backend API response:', response);

      // Handle both possible response structures from backend
      if (response.success) {
        const orderResult = response.order || response.data;
        
        if (orderResult && orderResult.id) {
          dispatch({ type: ActionTypes.ADD_ORDER, payload: orderResult });
          
          console.log('✅ STEP 1 COMPLETE: Order created successfully:', orderResult.id);
          
          return {
            success: true,
            data: orderResult,
            message: response.message || 'Order created successfully'
          };
        } else {
          throw new Error('Order data not found in response');
        }
      } else {
        // Handle validation errors from backend
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          throw new Error(errorMessages.join(', '));
        } else {
          throw new Error(response.message || 'Failed to create order');
        }
      }

    } catch (error: any) {
      console.error('❌ STEP 1: Create order failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      setError(errorMessage);
      return {
        success: false,
        message: error.message || 'Failed to create order',
        errors: error.errors || null
      };
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setError]);

  // 🚀 STEP 2: Generate payment invoice (Xendit)
  const generatePaymentInvoice = useCallback(async (orderId: number) => {
    try {
      setLoading(true);
      clearError();

      console.log('=== STEP 2: Generating payment invoice for order:', orderId, '===');

      if (!orderId || orderId <= 0) {
        throw new Error('Invalid order ID');
      }

      const response = await makeApiRequest(`/orders/${orderId}/pay`, {
        method: 'POST',
      });

      console.log('💳 Payment invoice API response:', response);

      // Handle backend response structure that matches CheckoutScreen expectations
      if (response.success) {
        // Handle different possible response structures from backend
        const invoiceUrl = response.invoice_url || response.invoiceUrl || response.url;
        
        if (!invoiceUrl) {
          console.error('❌ No invoice URL found in response:', response);
          throw new Error('Invoice URL not received from server');
        }

        console.log('✅ STEP 2 COMPLETE: Invoice URL received:', invoiceUrl);

        // Update order with invoice URL
        dispatch({
          type: ActionTypes.UPDATE_ORDER_STATUS,
          payload: {
            id: orderId,
            updates: { 
              url: invoiceUrl,
              invoice_url: invoiceUrl // Store both formats for compatibility
            }
          }
        });

        // Return structure that matches CheckoutScreen expectations
        return {
          success: true,
          invoice_url: invoiceUrl, // CheckoutScreen expects this exact field name
          message: response.message || 'Invoice generated successfully'
        };

      } else {
        const errorMessage = response.message || 'Failed to generate payment invoice';
        console.error('❌ STEP 2 FAILED: Payment invoice generation failed:', errorMessage);
        throw new Error(errorMessage);
      }

    } catch (error: any) {
      console.error('❌ STEP 2: Generate invoice failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate payment info.';
      setError(errorMessage);
      
      return {
        success: false,
        message: error.message || 'Failed to generate payment invoice'
      };
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setError]);

  // Get user orders
  const getUserOrders = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      clearError();

      const response = await makeApiRequest(`/orders?page=${page}`);

      if (response.success && response.data) {
        const { data: orders, ...pagination } = response.data;
        
        dispatch({ type: ActionTypes.SET_ORDERS, payload: orders });
        dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination });

        return {
          success: true,
          data: orders,
          pagination
        };
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }

    } catch (error: any) {
      console.error('Get user orders error:', error);
      setError(error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch orders'
      };
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setError]);

  // Get order details
  const getOrderDetails = useCallback(async (orderId: number) => {
    try {
      setLoading(true);
      clearError();

      const response = await makeApiRequest(`/orders/${orderId}`);

      if (response.success && response.data) {
        dispatch({ type: ActionTypes.SET_CURRENT_ORDER, payload: response.data });

        return {
          success: true,
          data: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to fetch order details');
      }

    } catch (error: any) {
      console.error('Get order details error:', error);
      setError(error);
      return {
        success: false,
        message: error?.message || 'Failed to fetch order details'
      };
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setError]);

  // 🚀 STEP 3: Check order payment status (Polled from PaymentInfoScreen)
  const checkOrderStatus = useCallback(async (orderId: number) => {
    try {
      console.log('=== STEP 3: Checking order status for:', orderId, '===');

      // Validate input
      if (!orderId || orderId <= 0) {
        console.error('❌ Invalid order ID provided:', orderId);
        return {
          success: false,
          message: 'Invalid order ID'
        };
      }

      // Get token first
      const token = await getAuthToken();
      if (!token) {
        console.error('❌ No authentication token found');
        return {
          success: false,
          message: 'Authentication required. Please login again.'
        };
      }

      console.log('🔑 Token found, proceeding with status check...');

      // Method 1: Try the dedicated status endpoint first
      try {
        console.log('🔍 Method 1: Trying status endpoint...');
        
        const statusResponse = await fetch(`${API_BASE_URL_ORDER}/orders/${orderId}/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log('📊 Status endpoint response status:', statusResponse.status);

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('✅ Status endpoint successful:', statusData);

          // Update order in context if successful
          if (statusData.success && statusData.data) {
            dispatch({
              type: ActionTypes.UPDATE_ORDER_STATUS,
              payload: {
                id: orderId,
                updates: statusData.data
              }
            });

            console.log('✅ STEP 3 COMPLETE (Method 1): Order status updated:', statusData.data.status);
            return statusData;
          } else {
            console.log('⚠️ Status endpoint returned unsuccessful response, trying method 2');
          }
        } else {
          const errorText = await statusResponse.text();
          console.log('⚠️ Status endpoint failed with status:', statusResponse.status, 'Error:', errorText);
        }
      } catch (statusError: any) {
        console.warn(`⚠️ Polling attempt failed for order ${orderId}:`, statusError.message, '- Trying method 2');
      }

      // Method 2: Fallback to order details endpoint
      try {
        console.log('🔍 Method 2: Trying order details endpoint...');
        
        const detailsResponse = await fetch(`${API_BASE_URL_ORDER}/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log('📊 Details endpoint response status:', detailsResponse.status);

        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          console.log('✅ Details endpoint successful:', detailsData);

          // Handle different response structures
          if (detailsData.success && detailsData.data) {
            // Standard successful response
            dispatch({
              type: ActionTypes.UPDATE_ORDER_STATUS,
              payload: {
                id: orderId,
                updates: detailsData.data
              }
            });

            console.log('✅ STEP 3 COMPLETE (Method 2): Order status updated:', detailsData.data.status);
            return detailsData;
          } else if (detailsData.id) {
            // Direct order object response
            dispatch({
              type: ActionTypes.UPDATE_ORDER_STATUS,
              payload: {
                id: orderId,
                updates: detailsData
              }
            });

            console.log('✅ STEP 3 COMPLETE (Method 2): Order status updated:', detailsData.status);
            return {
              success: true,
              data: detailsData,
              message: 'Order status retrieved successfully'
            };
          } else {
            console.error('❌ Unexpected response structure from details endpoint:', detailsData);
            return {
              success: false,
              message: 'Unexpected response format from server'
            };
          }
        } else {
          const errorText = await detailsResponse.text();
          console.error('❌ Details endpoint failed with status:', detailsResponse.status, 'Error:', errorText);
          
          return {
            success: false,
            message: `Failed to check order status: ${detailsResponse.status}`,
            error: errorText
          };
        }
      } catch (detailsError: any) {
        console.error('❌ Critical: Failed to fetch order details after success status:', detailsError);
        return {
          success: false,
          message: 'Network error while checking order status',
          error: detailsError.message
        };
      }

    } catch (error: any) {
      console.error('❌ STEP 3 FAILED: Unexpected error in checkOrderStatus:', error);
      
      return {
        success: false,
        message: 'Unexpected error while checking order status',
        error: error?.message || 'Unknown error'
      };
    }
  }, []);

  // 🚀 STEP 4: Complete payment flow (automatic after successful payment)
  const completePaymentFlow = useCallback(async (orderId: number) => {
    try {
      console.log('=== STEP 4: Completing payment flow for order:', orderId, '===');

      // Get final order details
      const orderResult = await getOrderDetails(orderId);
      
      if (orderResult.success) {
        console.log('✅ STEP 4 COMPLETE: Payment flow completed for order:', orderId);
        
        return {
          success: true,
          data: orderResult.data,
          message: 'Payment completed successfully'
        };
      } else {
        throw new Error(orderResult.message || 'Failed to complete payment flow');
      }

    } catch (error: any) {
      console.error('❌ STEP 4 FAILED: Complete payment flow error:', error);
      setError(error);
      
      return {
        success: false,
        message: error?.message || 'Failed to complete payment flow'
      };
    }
  }, [getOrderDetails, setError]);

  // Cancel order
  const cancelOrder = useCallback(async (orderId: number) => {
    try {
      setLoading(true);
      clearError();

      const response = await makeApiRequest(`/orders/${orderId}/cancel`, {
        method: 'PUT',
      });

      if (response.success) {
        // Update order status to cancelled
        dispatch({
          type: ActionTypes.UPDATE_ORDER_STATUS,
          payload: {
            id: orderId,
            updates: { status: 'CANCELLED' }
          }
        });

        return {
          success: true,
          message: response.message || 'Order cancelled successfully'
        };
      } else {
        throw new Error(response.message || 'Failed to cancel order');
      }

    } catch (error: any) {
      console.error('Cancel order error:', error);
      setError(error);
      return {
        success: false,
        message: error?.message || 'Failed to cancel order'
      };
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setError]);

  const refreshOrders = useCallback(async () => {
    return await getUserOrders(1);
  }, [getUserOrders]);

  const loadMoreOrders = useCallback(async () => {
    if (state.pagination.current_page < state.pagination.last_page) {
      const nextPage = state.pagination.current_page + 1;
      const result = await getUserOrders(nextPage);
      
      if (result.success) {
        // Append new orders to existing ones
        dispatch({
          type: ActionTypes.SET_ORDERS,
          payload: [...state.orders, ...result.data]
        });
      }
      
      return result;
    }
    
    return { success: true, data: [], message: 'No more orders to load' };
  }, [state.orders, state.pagination, getUserOrders]);

  // Initialize shipping info on mount
  React.useEffect(() => {
    loadShippingInfo();
  }, [loadShippingInfo]);

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    clearError,
    
    // Shipping info
    updateShippingInfo,
    clearShippingInfo,
    loadShippingInfo,
    
    createOrder,              // STEP 1: Create order (CheckoutScreen)
    generatePaymentInvoice,   // STEP 2: Generate Xendit invoice (CheckoutScreen)
    checkOrderStatus,         // STEP 3: Monitor payment status (PaymentInfoScreen) - FIXED
    completePaymentFlow,      // STEP 4: Complete flow (PaymentInfoScreen → SuccessScreen)
    
    // Order management
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    refreshOrders,
    loadMoreOrders,
    
    // Utility functions
    clearOrders: () => dispatch({ type: ActionTypes.CLEAR_ORDERS }),
    setCurrentOrder: (order: Order | null) => dispatch({ type: ActionTypes.SET_CURRENT_ORDER, payload: order }),
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  
  return context;
};

// Export context for advanced usage
export default OrderContext;