import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';
import { Alert } from 'react-native';

// Define cart item type dengan product_variant_id
export interface CartItem {
  id: number;
  productId: number;
  product_variant_id: number; 
  name: string;
  price: number;
  quantity: number;
  images: string;
  category?: {
    id: number;
    name: string;
  };
}

// Define cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  totalItems: number;
  totalAmount: number;
  isInCart: (productId: number) => boolean;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  refreshCart: () => Promise<void>;
  getCartItem: (productId: number) => CartItem | undefined;
  addCartChangeListener: (listener: () => void) => number;
  removeCartChangeListener: (id: number) => void;
  handleCheckoutSuccess: () => Promise<void>;
  // Method untuk mendapatkan data format checkout
  getCheckoutData: () => { product_variant_id: number; quantity: number; }[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = '@usada_herbal:cart';
const CHECKOUT_TIMESTAMP_KEY = '@usada_herbal:last_checkout';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const initialLoadComplete = useRef<boolean>(false);
  const cartChangeListeners = useRef<{ [id: number]: () => void }>({});
  const nextListenerId = useRef<number>(1);

  // Add listeners for real-time updates
  const addCartChangeListener = useCallback((listener: () => void): number => {
    const id = nextListenerId.current++;
    cartChangeListeners.current[id] = listener;
    return id;
  }, []);

  const removeCartChangeListener = useCallback((id: number): void => {
    delete cartChangeListeners.current[id];
  }, []);

  // Notify all listeners about cart changes
  const notifyCartChange = useCallback(() => {
    Object.values(cartChangeListeners.current).forEach(listener => listener());
  }, []);

  // Load cart from AsyncStorage on initial load
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        if (Array.isArray(parsedCart)) {
          // Migrate old cart data jika belum ada product_variant_id
          const migratedCart = parsedCart.map(item => ({
            ...item,
            product_variant_id: item.product_variant_id || item.productId
          }));
          
          setCartItems(migratedCart);
          
          // Save migrated data back to storage
          if (migratedCart.some(item => !parsedCart.find(old => old.product_variant_id === item.product_variant_id))) {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(migratedCart));
          }
        } else {
          console.warn('Invalid cart data format in storage, resetting cart');
          await AsyncStorage.removeItem(CART_STORAGE_KEY);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
      
      initialLoadComplete.current = true;
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Function to manually refresh cart data
  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  // Save cart to AsyncStorage and notify listeners
  const saveCart = useCallback(async (items: CartItem[]) => {
    try {
      if (initialLoadComplete.current) {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        notifyCartChange();
      }
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }, [notifyCartChange]);

  // Update totals whenever cart changes
  useEffect(() => {
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setTotalItems(items);
    setTotalAmount(amount);
  }, [cartItems]);

  // Get a cart item by product ID
  const getCartItem = useCallback((productId: number): CartItem | undefined => {
    return cartItems.find(item => item.productId === productId);
  }, [cartItems]);

  // Check if an item is already in cart
  const isInCart = useCallback((productId: number): boolean => {
    return cartItems.some(item => item.productId === productId);
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    try {
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);
        let updatedItems;
        
        if (existingItemIndex >= 0) {
          // Product exists, update quantity
          updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          
          Alert.alert('Added to Cart', `${product.name} quantity updated in your cart!`);
        } else {
          // Product doesn't exist, add new item
          const newItem: CartItem = {
            id: Date.now(),
            productId: product.id,
            product_variant_id: product.id, // Menggunakan product.id sebagai variant_id
            name: product.name,
            price: product.price,
            quantity: quantity,
            images: product.images,
            category: product.category
          };
          
          updatedItems = [...prevItems, newItem];
          Alert.alert('Added to Cart', `${product.name} added to your cart!`);
        }
        
        saveCart(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Could not add item to cart. Please try again.');
    }
  }, [saveCart]);

  // Remove item from cart
  const removeFromCart = useCallback((productId: number) => {
    try {
      setCartItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.productId !== productId);
        saveCart(updatedItems);
        return updatedItems;
      });
      
      Alert.alert('Removed', 'Item removed from your cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Could not remove item from cart. Please try again.');
    }
  }, [saveCart]);

  // Update item quantity
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      
      setCartItems(prevItems => {
        const updatedItems = prevItems.map(item => {
          if (item.productId === productId) {
            return { ...item, quantity };
          }
          return item;
        });
        
        saveCart(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Could not update quantity. Please try again.');
    }
  }, [removeFromCart, saveCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      notifyCartChange();
      Alert.alert('Cart Cleared', 'All items have been removed from your cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Could not clear cart. Please try again.');
    }
  }, [notifyCartChange]);

  // Handle checkout success
  const handleCheckoutSuccess = useCallback(async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem(CHECKOUT_TIMESTAMP_KEY, timestamp);
      
      notifyCartChange();
      
      console.log('Checkout successful, cart cleared at:', timestamp);
    } catch (error) {
      console.error('Error handling checkout:', error);
    }
  }, [notifyCartChange]);

  // Calculate cart total
  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Get checkout data format untuk API
  const getCheckoutData = useCallback(() => {
    return cartItems.map(item => ({
      product_variant_id: item.product_variant_id,
      quantity: item.quantity
    }));
  }, [cartItems]);

  // Values to expose via context
  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    totalItems,
    totalAmount, 
    isInCart,
    isLoading,
    setIsLoading,
    refreshCart,
    getCartItem,
    addCartChangeListener,
    removeCartChangeListener,
    handleCheckoutSuccess,
    getCheckoutData
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};