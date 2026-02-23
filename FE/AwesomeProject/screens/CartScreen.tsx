import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
  Animated,
  ImageBackground
} from 'react-native';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Feather } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import withProviders from '@/utils/withProviders';

interface CartScreenProps {
  // Using navigation prop instead to fix navigation issues
  navigation?: any;
  route?: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation, route }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalAmount, 
    clearCart, 
    isLoading, 
    refreshCart,
    addCartChangeListener,
    removeCartChangeListener
  } = useCart();
  
  // 🔥 Add authentication context
  const { isAuthenticated, user } = useAuth();
  
  // Get navigation object when not passed as prop
  const defaultNavigation = useNavigation();
  const nav = navigation || defaultNavigation;
  
  const isFocused = useIsFocused();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [localCartItems, setLocalCartItems] = useState(cartItems);
  
  // Cart listener for real-time updates
  const cartListenerId = useRef<number | null>(null);
  
  // Track items being removed to prevent UI glitches
  const [itemsBeingRemoved, setItemsBeingRemoved] = useState<number[]>([]);
  
  // Animation map using refs for better stability
  const fadeAnimsRef = useRef<Map<number, Animated.Value>>(new Map());
  
  // Initialize animation values for current items
  useEffect(() => {
    // Create animations for new items that don't have one yet
    cartItems.forEach(item => {
      if (!fadeAnimsRef.current.has(item.id)) {
        const anim = new Animated.Value(1);
        fadeAnimsRef.current.set(item.id, anim);
      }
    });
  }, [cartItems]);
  
  // Register cart change listener on mount
  useEffect(() => {
 
    if (cartListenerId.current !== null) {
      removeCartChangeListener(cartListenerId.current);
    }
    
    // Register new listener
    cartListenerId.current = addCartChangeListener(() => {
      // Filter out items being removed to prevent UI flashing
      const filteredItems = cartItems.filter(
        item => !itemsBeingRemoved.includes(item.id)
      );
      setLocalCartItems(filteredItems);
    });
    
    // Cleanup listener on unmount
    return () => {
      if (cartListenerId.current !== null) {
        removeCartChangeListener(cartListenerId.current);
        cartListenerId.current = null;
      }
    };
  }, [addCartChangeListener, removeCartChangeListener, cartItems, itemsBeingRemoved]);
  
  // Refresh cart when screen comes into focus with forced reload from storage
  useEffect(() => {
    let mounted = true;
    
    if (isFocused) {
      const loadData = async () => {
        setRefreshing(true);
        await refreshCart();
        if (mounted) {
          // Reset the removed items state when coming back to the screen
          setItemsBeingRemoved([]);
          setRefreshing(false);
        }
      };
      
      loadData();
    }
    
    return () => {
      mounted = false;
    };
  }, [isFocused, refreshCart]);
  
  // Update local cart items when cart items change and no items are being removed
  useEffect(() => {
    if (itemsBeingRemoved.length === 0) {
      setLocalCartItems([...cartItems]);
    }
  }, [cartItems]);

  // Format price with IDR currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      Alert.alert('Error', 'Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    // Simulate coupon validation
    setTimeout(() => {
      setIsApplyingCoupon(false);
      Alert.alert('Sorry', 'This coupon code is invalid or has expired');
      setCouponCode('');
    }, 1000);
  };

  const handleConfirmClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: clearCart, style: 'destructive' },
      ]
    );
  };

  const handleUpdateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      // Update quantity in cart context
      updateQuantity(productId, newQuantity);
    }
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((item: any) => {
    const productId = item.productId;
    const itemId = item.id;
    
    // Mark this item as being removed to prevent UI updates
    setItemsBeingRemoved(prev => [...prev, itemId]);
    
    // Get animation value for this item
    const fadeAnim = fadeAnimsRef.current.get(itemId);
    
    if (fadeAnim) {
      // Animate the item out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Actually remove from cart after animation completes
        removeFromCart(productId);
        
        // Remove from being removed list after a short delay
        setTimeout(() => {
          setItemsBeingRemoved(prev => prev.filter(id => id !== itemId));
          // Clean up the animation value
          fadeAnimsRef.current.delete(itemId);
        }, 50);
      });
    } else {
      // Fallback if no animation exists
      removeFromCart(productId);
      setItemsBeingRemoved(prev => prev.filter(id => id !== itemId));
    }
  }, [removeFromCart]);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshCart();
    setRefreshing(false);
  }, [refreshCart]);

  // 🔥 UPDATED: Authentication check for checkout
  const handleNavigateToCheckout = () => {
    console.log('🛒 Checkout button pressed - checking authentication...');
    console.log('🔐 Auth status:', { isAuthenticated, userEmail: user?.email || 'none' });
    
    if (!isAuthenticated) {
      console.log('❌ User not authenticated - showing login prompt');
      
      Alert.alert(
        'Login Required',
        'Anda harus login terlebih dahulu untuk melanjutkan ke checkout.',
        [
          {
            text: 'Batal',
            style: 'cancel'
          },
          {
            text: 'Login',
            onPress: () => {
              console.log('🎯 Navigating to CartLogin screen');
              nav.navigate('CartLogin', {
                // Pass return route so user can come back to cart after login
                returnRoute: 'CartMain',
                message: 'Silakan login untuk melanjutkan checkout'
              });
            }
          }
        ]
      );
      return;
    }
    
    console.log('✅ User authenticated - proceeding to checkout');
    nav.navigate('Checkout');
  };
  
  const handleNavigateBack = () => {
    nav.goBack();
  };
  
  const handleNavigateToHome = () => {
    // Navigate to home through the tab navigator
    nav.navigate('ProductScreen');
  };
  
  const handleNavigateToProduct = (productId: number) => {
    // Navigate to product detail in the Product stack
    nav.navigate('ProductScreen', {
      screen: 'ProductDetail',
      params: { productId }
    });
  };

  const renderCartItem = useCallback(({ item }: { item: any }) => {
    // Get or create animation value for this item
    let fadeAnim = fadeAnimsRef.current.get(item.id);
    if (!fadeAnim) {
      fadeAnim = new Animated.Value(1);
      fadeAnimsRef.current.set(item.id, fadeAnim);
    }
    
    return (
      <Animated.View 
        style={[
          styles.cartItem,
          { 
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.itemImage}
          onPress={() => handleNavigateToProduct(item.productId)}
        >
          <Image
            source={{ uri: item.images }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
        
        <View style={styles.itemDetails}>
          <TouchableOpacity onPress={() => handleNavigateToProduct(item.productId)}>
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
          
          <Text style={styles.itemCategory}>
            {item.category?.name || 'Herbal Product'}
          </Text>
          
          <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
            
            <Text style={styles.itemTotalPrice}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item)}
        >
          <Feather name="trash-2" size={22} color="#FF6B6B" />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [fadeAnimsRef, handleNavigateToProduct, handleRemoveItem, handleUpdateQuantity, formatPrice]);

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Text style={styles.emptyCartIcon}>🛒</Text>
      <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyCartText}>
        Looks like you haven't added any herbal products to your cart yet.
      </Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={handleNavigateToHome}
      >
        <Text style={styles.continueShoppingText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
          backgroundColor="#4F7942"
        />
        <ActivityIndicator size="large" color="#4F7942" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </SafeAreaView>
    );
  }

  // Get the actual count of items in cart
  const itemCount = localCartItems.reduce((total, item) => total + item.quantity, 0);

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
        <TouchableOpacity style={styles.backButton} onPress={handleNavigateBack}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>
            {localCartItems.length > 0
              ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
              : 'No items'}
          </Text>
        </View>
        
        {/* 🔥 Show authentication status in header */}
        {isAuthenticated && (
          <View style={styles.userIndicator}>
            <Feather name="user-check" size={20} color="white" />
          </View>
        )}
      </ImageBackground>

      {/* Cart Items List */}
      <FlatList
        data={localCartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cartListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyCart}
        refreshing={refreshing}
        onRefresh={onRefresh}
        removeClippedSubviews={false} // Important for animations
        extraData={itemsBeingRemoved} // Re-render when items are being removed
      />

      {/* Cart Summary */}
      {localCartItems.length > 0 && (
        <View style={styles.cartSummary}>
          {/* Coupon Section */}
          <View style={styles.couponSection}>
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon code"
                value={couponCode}
                onChangeText={setCouponCode}
                placeholderTextColor="#86A789"
              />
            </View>
            <TouchableOpacity
              style={[styles.applyCouponButton, isApplyingCoupon && styles.disabledButton]}
              onPress={handleApplyCoupon}
              disabled={isApplyingCoupon}
            >
              {isApplyingCoupon ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.applyCouponText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Price Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping Fee</Text>
              <Text style={styles.summaryValue}>{formatPrice(10000)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (10%)</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalAmount * 0.1)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Animated.Text style={styles.totalValue}>
                {formatPrice(totalAmount + 10000 + (totalAmount * 0.1))}
              </Animated.Text>
            </View>
          </View>

          {/* 🔥 UPDATED: Checkout Button with authentication check */}
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              !isAuthenticated && styles.checkoutButtonUnauthenticated
            ]}
            onPress={handleNavigateToCheckout}
          >
            <View style={styles.checkoutButtonContent}>
              {!isAuthenticated && (
                <Feather name="lock" size={18} color="white" style={styles.lockIcon} />
              )}
              <Text style={styles.checkoutButtonText}>
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Text>
              <Feather name="arrow-right" size={20} color="white" />
            </View>
          </TouchableOpacity>
          
          {/* 🔥 Auth hint text */}
          {!isAuthenticated && (
            <Text style={styles.authHintText}>
              Anda perlu login untuk melanjutkan ke checkout
            </Text>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4F7942',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden', // Important for borderRadius with ImageBackground
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
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  // 🔥 NEW: User authentication indicator
  userIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearCartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartListContent: {
    padding: 15,
    paddingBottom: 20,
    flexGrow: 1, // Ensure it takes all available space
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4F7942',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F0F8F0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5233',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#86A789',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F7942',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7942',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5233',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E5233',
    marginLeft: 'auto',
  },
  removeButton: {
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyCartIcon: {
    fontSize: 70,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#86A789',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  continueShoppingButton: {
    backgroundColor: '#4F7942',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  continueShoppingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cartSummary: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  couponSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  couponInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  couponInput: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2E5233',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  applyCouponButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  applyCouponText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#F0F8F0',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#2E5233',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E5233',
  },
  divider: {
    height: 1,
    backgroundColor: '#C8E6C9',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F7942',
  },
  checkoutButton: {
    backgroundColor: '#4F7942',
    paddingVertical: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // 🔥 NEW: Styling for unauthenticated state
  checkoutButtonUnauthenticated: {
    backgroundColor: '#FF8C00', // Orange color to indicate login required
  },
  checkoutButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: 10,
  },
  lockIcon: {
    marginRight: 5,
  },
  // 🔥 NEW: Auth hint text
  authHintText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#86A789',
    fontStyle: 'italic',
  },
});

export default withProviders(CartScreen);