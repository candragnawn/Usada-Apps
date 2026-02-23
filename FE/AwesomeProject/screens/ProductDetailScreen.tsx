// src/Screens/ProductDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '@/context/CartContext';
import withProviders from '@/utils/withProviders';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.0.100:8000';
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE || 'http://192.168.0.100:8000/storage/';

interface ProductVariant {
  id: number;
  variant_name: string;
  stock: number;
  price?: number;
}

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  images: string | string[];
  category?: {
    id: number;
    name: string;
  };
  rating?: number;
  reviews_count?: number;
  is_organic?: boolean;
  is_fresh?: boolean;
  stock?: number;
  variants?: ProductVariant[];
  benefits?: string[];
  ingredients?: string[];
  usage_instructions?: string;
  weight?: string;
  dimensions?: string;
  manufacturer?: string;
  company?: string;
  expiry_date?: string;
  is_wishlisted?: boolean;
}

// Helper function to calculate total stock from variants (consistent with ProductCard)
const calculateTotalStock = (variants: ProductVariant[] | undefined, directStock?: number): number => {
  // If variants exist and is not empty array, calculate from variants only
  if (variants && Array.isArray(variants) && variants.length > 0) {
    return variants.reduce((total, variant) => {
      const variantStock = parseInt(String(variant.stock)) || 0;
      return total + variantStock;
    }, 0);
  }
  
  // If no variants, fallback to direct stock property
  return directStock || 0;
};

// Helper function to get full image URL
const getImageUrl = (imagePath: string | string[]): string => {
  if (!imagePath) return `${IMAGE_BASE_URL}default-product.jpg`;
  
  // Handle array of images (take the first one)
  const imageString = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  
  if (!imageString) return `${IMAGE_BASE_URL}default-product.jpg`;
  
  if (imageString.startsWith('http')) return imageString;
  
  const cleanPath = imageString.startsWith('/') ? imageString.slice(1) : imageString;
  return `${IMAGE_BASE_URL}${cleanPath}`;
};

// Helper function to get auth token (implement based on your auth system)
const getAuthToken = (): string | null => {
  // Replace with your actual auth token retrieval method
  try {
    // For React Native, you might use AsyncStorage or SecureStore
    // Example: return AsyncStorage.getItem('auth_token');
    return null; // Implement your auth token logic here
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// API function to fetch product details
const fetchProductDetail = async (productId: number): Promise<ProductDetail> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

// API function to add to cart
const addToCartApi = async (productId: number, quantity: number): Promise<any> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        product_id: productId, 
        quantity: quantity 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// API function to toggle wishlist
const toggleWishlistApi = async (productId: number): Promise<boolean> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/toggle`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ product_id: productId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.is_wishlisted;
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    throw error;
  }
};

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: number };
  
  // Fixed: Use cartItems instead of cart, and add proper destructuring
  const { addToCart, cartItems, totalItems, getCartItem } = useCart();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);
  const [cartNotification, setCartNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation values
  const [cartButtonScale] = useState(new Animated.Value(1));
  const [cartButtonRotate] = useState(new Animated.Value(0));
  
  const totalCartItems = totalItems || 0;
  
  // Get available stock considering current cart items
  const getAvailableStock = useCallback(() => {
    if (!product) return 0;
    
    // Calculate total stock from variants (consistent with ProductCard)
    const totalStock = calculateTotalStock(product.variants, product.stock);
    
    if (totalStock === 0) return 0;
    
    // Check if this product is already in cart - use cartItems instead of cart
    const cartItem = cartItems && Array.isArray(cartItems) 
      ? cartItems.find(item => item.productId === product.id) 
      : null;
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    
    // Available stock = total stock - already in cart
    return Math.max(0, totalStock - cartQuantity);
  }, [product, cartItems]);
  
  // Check if we can add more items to cart
  const canAddToCart = useCallback(() => {
    if (!product) return false;
    
    const availableStock = getAvailableStock();
    return availableStock > 0 && quantity <= availableStock;
  }, [product, quantity, getAvailableStock]);
  
  // Fetch product data
  const loadProductData = async (showLoading: boolean = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const productData = await fetchProductDetail(productId);
      setProduct(productData);
      
      // Reset quantity if it exceeds available stock
      const totalStock = calculateTotalStock(productData.variants, productData.stock);
      const cartItem = cartItems && Array.isArray(cartItems) 
        ? cartItems.find(item => item.productId === productData.id) 
        : null;
      const cartQuantity = cartItem ? cartItem.quantity : 0;
      const availableStock = Math.max(0, totalStock - cartQuantity);
      
      if (quantity > availableStock && availableStock > 0) {
        setQuantity(Math.min(quantity, availableStock));
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product details. Please try again.');
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProductData(true);
  }, [productId]);

  // Update quantity when cart changes - use cartItems instead of cart
  useEffect(() => {
    if (product) {
      const availableStock = getAvailableStock();
      if (quantity > availableStock && availableStock > 0) {
        setQuantity(Math.min(quantity, availableStock));
      }
    }
  }, [cartItems, product, quantity, getAvailableStock]);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProductData(false);
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleViewCart = useCallback(() => {
    // Animate the cart button when clicked
    Animated.sequence([
      Animated.timing(cartButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cartButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    navigation.navigate('CartStack');
  }, [navigation, cartButtonScale]);
  
  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    const availableStock = getAvailableStock();
    
    if (action === 'increase') {
      if (quantity < availableStock) {
        setQuantity(quantity + 1);
      } else {
        // Show alert when trying to exceed available stock
        const cartItem = cartItems && Array.isArray(cartItems) 
          ? cartItems.find(item => item.productId === product?.id) 
          : null;
        Alert.alert(
          'Stock Limit Reached',
          `Only ${availableStock} items available in stock${cartItem ? ' (including items already in cart)' : ''}.`,
          [{ text: 'OK' }]
        );
      }
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Animate cart button when adding items
  const animateCartButton = useCallback(() => {
    // Scale animation
    Animated.sequence([
      Animated.timing(cartButtonScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cartButtonScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Rotate animation
    Animated.sequence([
      Animated.timing(cartButtonRotate, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cartButtonRotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cartButtonScale, cartButtonRotate]);
  
  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    
    // Validate stock before adding
    const availableStock = getAvailableStock();
    
    if (availableStock <= 0) {
      Alert.alert(
        'Out of Stock',
        'This product is currently out of stock.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (quantity > availableStock) {
      Alert.alert(
        'Insufficient Stock',
        `Only ${availableStock} items available. Please reduce the quantity.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      // Try to add to cart via API
      await addToCartApi(product.id, quantity);
      
      // Also add to local cart context for immediate UI update
      addToCart(product, quantity);
      
      // Animate the cart button
      animateCartButton();
      
      // Set notification message showing the total price
      setNotificationMessage(`${formatPrice(product.price * quantity)} added`);
      
      // Show cart notification
      setCartNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setCartNotification(false);
        setNotificationMessage('');
      }, 3000);
      
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local cart only
      addToCart(product, quantity);
      animateCartButton();
      setNotificationMessage(`${formatPrice(product.price * quantity)} added (offline)`);
      setCartNotification(true);
      
      setTimeout(() => {
        setCartNotification(false);
        setNotificationMessage('');
      }, 3000);
      
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, addToCart, animateCartButton, getAvailableStock]);

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback(async () => {
    if (!product) return;
    
    setIsWishlistToggling(true);
    
    try {
      const isWishlisted = await toggleWishlistApi(product.id);
      setProduct(prev => prev ? { ...prev, is_wishlisted: isWishlisted } : null);
      
      // Show feedback
      Alert.alert(
        isWishlisted ? 'Added to Wishlist' : 'Removed from Wishlist',
        isWishlisted ? 'Product added to your wishlist' : 'Product removed from your wishlist'
      );
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      Alert.alert('Error', 'Failed to update wishlist. Please try again.');
    } finally {
      setIsWishlistToggling(false);
    }
  }, [product]);

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  // Get product image URL
  const getProductImageUrl = () => {
    if (!product?.images) return 'https://via.placeholder.com/600x400/4F7942/FFFFFF?text=🌿+Herbal+Product';
    
    return getImageUrl(product.images);
  };

  // Error state
  if (error && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
          backgroundColor="#4F7942"
        />
        
        <ImageBackground 
          source={require('@/assets/images/batik.png')} 
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Product Details</Text>
          </View>
        </ImageBackground>
        
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadProductData(true)}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (loading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
          backgroundColor="#4F7942"
        />
        
        <ImageBackground 
          source={require('@/assets/images/batik.png')} 
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Product Details</Text>
          </View>
        </ImageBackground>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F7942" />
          <Text style={styles.loadingText}>🌿 Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate rotation for the cart icon animation
  const spin = cartButtonRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg']
  });

  const availableStock = getAvailableStock();
  const totalStock = calculateTotalStock(product.variants, product.stock);
  const isOutOfStock = availableStock <= 0;
  const canAdd = canAddToCart();

  // Get current cart item - use cartItems instead of cart
  const currentCartItem = cartItems && Array.isArray(cartItems) 
    ? cartItems.find(item => item.productId === product.id) 
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />
      
      {/* Header with Batik Background Image */}
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
          
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        
        <View style={styles.headerActions}>
          {/* Wishlist Button */}
          <TouchableOpacity 
            style={[styles.wishlistButton, { marginRight: 10 }]} 
            onPress={handleWishlistToggle}
            disabled={isWishlistToggling}
            activeOpacity={0.7}
          >
            {isWishlistToggling ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Feather 
                name={product.is_wishlisted ? "heart" : "heart"} 
                size={20} 
                color={product.is_wishlisted ? "#FF6B6B" : "white"} 
                style={product.is_wishlisted ? { fill: "#FF6B6B" } : {}}
              />
            )}
          </TouchableOpacity>
          
          {/* Cart Button */}
          <Animated.View
            style={[
              { transform: [{ scale: cartButtonScale }, { rotate: spin }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.cartButton} 
              onPress={handleViewCart}
              activeOpacity={0.7}
            >
              <Feather name="shopping-cart" size={20} color="white" />
              {totalCartItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4F7942']}
            tintColor="#4F7942"
          />
        }
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getProductImageUrl() }}
            style={styles.productImage}
            defaultSource={{ uri: 'https://via.placeholder.com/600x400/4F7942/FFFFFF?text=🌿+Herbal+Product' }}
            onError={() => setImageError(true)}
          />
          
          {/* Fresh Badge */}
          {product.is_fresh && !isOutOfStock && (
            <View style={styles.freshBadge}>
              <Text style={styles.freshBadgeText}>🌱 Fresh</Text>
            </View>
          )}
          
          {/* Organic Badge */}
          {product.is_organic && !isOutOfStock && (
            <View style={[styles.freshBadge, { top: 70 }]}>
              <Text style={styles.freshBadgeText}>🌾 Organic</Text>
            </View>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
        
        {/* Product Content */}
        <View style={styles.contentContainer}>
          {/* Product Name and Category */}
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category.name}</Text>
              </View>
            )}
          </View>
          
          {/* Product Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price:</Text>
            <Text style={styles.currentPrice}>{formatPrice(product.price)}</Text>
            {product.original_price && product.original_price > product.price && (
              <Text style={styles.originalPrice}>{formatPrice(product.original_price)}</Text>
            )}
            <Text style={styles.unitText}>per unit</Text>
          </View>
          
          {/* Stock Info - Simplified */}
          <View style={styles.stockInfo}>
            <Text style={styles.stockText}>
              Stock: {availableStock > 0 ? `${availableStock} available` : 'Out of stock'}
              {currentCartItem && ` (${currentCartItem.quantity} in cart)`}
            </Text>
          </View>
          
          {/* Quantity Selector */}
          {!isOutOfStock && (
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonDisabled]}>−</Text>
                </TouchableOpacity>
                <View style={styles.quantityValueContainer}>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange('increase')}
                  disabled={quantity >= availableStock}
                >
                  <Text style={[
                    styles.quantityButtonText, 
                    quantity >= availableStock && styles.quantityButtonDisabled
                  ]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {product.description || 
                'Natural herbal product made with traditional Balinese wisdom for your wellbeing. ' +
                'Carefully sourced from local organic farms and processed using traditional methods to ' +
                'preserve all natural benefits and healing properties.'}
            </Text>
          </View>
          
          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsList}>
              {product.benefits && product.benefits.length > 0 ? (
                product.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✅</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✅</Text>
                    <Text style={styles.benefitText}>100% Natural ingredients</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✅</Text>
                    <Text style={styles.benefitText}>Organically grown in Bali</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✅</Text>
                    <Text style={styles.benefitText}>No preservatives or chemicals</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✅</Text>
                    <Text style={styles.benefitText}>Traditional Balinese herbal wisdom</Text>
                  </View>
                </>
              )}
            </View>
          </View>
          
          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <View style={styles.ingredientsContainer}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.ingredientsText}>
                {product.ingredients.join(', ')}
              </Text>
            </View>
          )}
          
          {/* Additional Info */}
          <View style={styles.additionalInfoContainer}>
        
            {product.weight && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{product.weight}</Text>
              </View>
            )}
            {product.manufacturer && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Manufacturer:</Text>
                <Text style={styles.infoValue}>{product.manufacturer}</Text>
              </View>
            )}
            {product.company && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Company:</Text>
                <Text style={styles.infoValue}>{product.company}</Text>
              </View>
            )}
            {product.expiry_date && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Expiry Date:</Text>
                <Text style={styles.infoValue}>{product.expiry_date}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Add to Cart Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(product.price * quantity)}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.addToCartButton, 
            (isAddingToCart || isOutOfStock) && styles.addToCartButtonDisabled
          ]} 
          onPress={handleAddToCart}
          disabled={isAddingToCart || isOutOfStock}
          activeOpacity={0.8}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Feather name="shopping-cart" size={18} color="white" style={styles.addToCartIcon} />
              <Text style={styles.addToCartText}>
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Cart Notification */}
      {cartNotification && (
        <View style={styles.notificationContainer}>
          <View style={styles.notification}>
            <Text style={styles.notificationIcon}>✅</Text>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Added to Cart</Text>
              <Text style={styles.notificationMessage}>{notificationMessage}</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewCartButton}
              onPress={handleViewCart}
              activeOpacity={0.7}
            >
              <Text style={styles.viewCartButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4F7942',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E5233',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#5C8C62',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  cartIcon: {
    fontSize: 18,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cartNotification: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  cartNotificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: width * 0.8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  freshBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(79, 121, 66, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  freshBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 25,
    paddingBottom: 100,
  },
  productHeader: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E5233',
    lineHeight: 32,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#4F7942',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  fullStar: {
    fontSize: 18,
    color: '#FFD700',
  },
  halfStar: {
    fontSize: 18,
    color: '#FFD700',
  },
  emptyStar: {
    fontSize: 18,
    color: '#E5E7EB',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F7942',
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: '#86A789',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: '#2E5233',
    fontWeight: '500',
    marginRight: 10,
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F7942',
    marginRight: 8,
  },
  unitText: {
    fontSize: 14,
    color: '#86A789',
    fontStyle: 'italic',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#2E5233',
    fontWeight: '500',
    marginRight: 15,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: 12,
    backgroundColor: '#F0F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F7942',
  },
  quantityButtonDisabled: {
    color: '#C8E6C9',
  },
  quantityValueContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  descriptionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5C8C62',
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 15,
    color: '#5C8C62',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  totalContainer: {
    flexDirection: 'column',
  },
  totalLabel: {
    fontSize: 14,
    color: '#86A789',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  addToCartButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#86A789',
    opacity: 0.8,
  },
  addToCartIcon: {
    marginRight: 10,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modified notification styles - positioned higher
  notificationContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 100, // Moved higher up the screen
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  notification: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  notificationIcon: {
    fontSize: 22,
    color: '#4F7942',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#5C8C62',
  },
  viewCartButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartButtonText: {
    color: '#4F7942',
    fontSize: 14,
    fontWeight: '600',
  },
   stockInfo: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4F7942',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5233',
    flex: 1,
  },
  stockIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F7942',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  stockIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -20 }],
    backgroundColor: 'rgba(255, 107, 107, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  originalPrice: {
    fontSize: 18,
    color: '#86A789',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  ingredientsContainer: {
    marginBottom: 25,
    backgroundColor: '#F8FDF8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  ingredientsText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5C8C62',
    fontStyle: 'italic',
  },
  additionalInfoContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F8F0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#5C8C62',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#2E5233',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  companyInfoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: '#F8FFFE',
  borderRadius: 12,
  marginVertical: 6,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},

companyLabel: {
  fontSize: 14,
  color: '#6B7280',
  fontWeight: '500',
  flex: 1,
},

companyValue: {
  fontSize: 14,
  color: '#1F2937',
  fontWeight: '600',
  flex: 2,
  textAlign: 'right',
},

manufacturerIcon: {
  marginRight: 10,
  opacity: 0.7,
},

  
});

export default withProviders(ProductDetailScreen);