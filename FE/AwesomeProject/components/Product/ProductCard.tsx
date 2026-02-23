// src/components/product/ProductCard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onPress: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
  onAddToCart?: (productId: number, quantity: number) => void;
  showFeedback?: (message: string, type: 'success' | 'error') => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2;
const GRID_CARD_HEIGHT = 380;
const GRID_IMAGE_HEIGHT = CARD_WIDTH * 0.7;
const LIST_IMAGE_WIDTH = 140;
const LIST_IMAGE_HEIGHT = 320;

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE || 'http://127.0.0.1:8000/storage/';

// Helper function to get authentication token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || 
         localStorage.getItem('token') || 
         localStorage.getItem('access_token') ||
         null;
};

// Helper function to get full image URL
const getImageUrl = (imagePath: string | string[]): string => {
  if (!imagePath) return `${IMAGE_BASE_URL}default-product.jpg`;
  
  const imageString = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  
  if (!imageString) return `${IMAGE_BASE_URL}default-product.jpg`;
  
  if (imageString.startsWith('http')) return imageString;
  
  const cleanPath = imageString.startsWith('/') ? imageString.slice(1) : imageString;
  return `${IMAGE_BASE_URL}${cleanPath}`;
};

// Helper function to format price
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'Rp 0';
  return `Rp ${numPrice.toLocaleString('id-ID')}`;
};

// Helper function to calculate total stock from variants
const calculateTotalStock = (variants: any[] | undefined, directStock?: number): number => {
  if (variants && Array.isArray(variants) && variants.length > 0) {
    return variants.reduce((total, variant) => {
      const variantStock = parseInt(String(variant.stock)) || 0;
      return total + variantStock;
    }, 0);
  }
  
  return directStock || 0;
};

// Helper function to get herbal benefits indicator
const getHerbalIndicator = (category: string | { name: string; id: number } | null): string => {
  const indicators: { [key: string]: string } = {
    'herbal': '🌿',
    'tea': '🍃',
    'supplement': '💊',
    'oil': '🫒',
    'powder': '🥄',
    'root': '🌱',
    'flower': '🌸',
    'leaf': '🍀',
    'traditional': '🏺',
    'organic': '🌾',
    'detox': '🧘‍♀️',
    'immunity': '💪',
    'health': '❤️'
  };
  
  if (!category) return '🌿';
  
  const categoryName = typeof category === 'string' ? category : category.name;
  const lowerCategory = categoryName.toLowerCase();
  
  for (const [key, emoji] of Object.entries(indicators)) {
    if (lowerCategory.includes(key)) {
      return emoji;
    }
  }
  return '🌿';
};

// API function to toggle wishlist
const toggleWishlist = async (productId: number): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.is_wishlisted || data.wishlisted || false;
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    throw error;
  }
};

// API function to add to cart
const addToCartApi = async (productId: number, quantity: number = 1): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        product_id: productId, 
        quantity: quantity 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode = 'grid',
  onPress,
  onAddToWishlist,
  onAddToCart,
  showFeedback
}) => {
  const [isWishlisted, setIsWishlisted] = useState(
    product.is_wishlisted || product.wishlisted || false
  );
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Update wishlist state when product prop changes


  const handlePress = () => {
    onPress(product.id);
  };

  const handleWishlistToggle = async () => {
    if (isWishlistLoading) return;
    
    // Simple toggle untuk tampilan saja - tanpa API call
    setIsWishlisted(!isWishlisted);
    
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }

    showFeedback?.(
      !isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
      'success'
    );
  };

  const handleAddToCart = async () => {
    if (isCartLoading) return;
    
    const totalStock = calculateTotalStock(product.variants, product.stock);
    if (totalStock <= 0) {
      showFeedback?.('Product is out of stock', 'error');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showFeedback?.('Please login to add items to cart', 'error');
      return;
    }
    
    setIsCartLoading(true);
    try {
      await addToCartApi(product.id, 1);
      
      if (onAddToCart) {
        onAddToCart(product.id, 1);
      }
      
      showFeedback?.('Added to cart successfully', 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showFeedback?.('Failed to add to cart', 'error');
    } finally {
      setIsCartLoading(false);
    }
  };

  // Extract product data with fallbacks
  const productName = product.name || 'Untitled Product';
  const productPrice = product.price || 0;
  const productCategory = product.category;
  const productDescription = product.description || 'Natural herbal product made with traditional Balinese wisdom for your wellbeing.';
  const productCompany = product.company ;
  
  const totalStock = calculateTotalStock(product.variants, product.stock);
  const herbalIndicator = getHerbalIndicator(productCategory);
  
  const productImage = product.images || product.images || product.images || '';
  const imageUrl = getImageUrl(productImage);

  const isOutOfStock = totalStock <= 0;

  // Render wishlist button dengan heart yang berubah warna
  const renderWishlistButton = () => (
    <TouchableOpacity 
      style={styles.wishlistButton} 
      onPress={handleWishlistToggle}
      activeOpacity={0.7}
      disabled={isWishlistLoading}
    >
      {isWishlistLoading ? (
        <ActivityIndicator size="small" color="#FF1744" />
      ) : (
        <Text style={[
          styles.heartIcon,
          { color: isWishlisted ? '#FF1744' : '#9E9E9E' }
        ]}>
          ♥
        </Text>
      )}
    </TouchableOpacity>
  );

  if (viewMode === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.listContainer}>
          {/* Image Section */}
          <View style={styles.listImageContainer}>
            <Image
              source={{ uri: imageError ? `${IMAGE_BASE_URL}default-product.jpg` : imageUrl }}
              style={[styles.listImage, isOutOfStock && styles.outOfStockImage]}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
            
           
            {/* Out of Stock Badge */}
            {isOutOfStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}

            {/* Wishlist Button */}
            {renderWishlistButton()}
          </View>

          {/* Content Section */}
          <View style={styles.listContent}>
            <View style={styles.productHeader}>
              <View style={styles.productTitleRow}>
                <Text style={styles.herbalIndicator}>{herbalIndicator}</Text>
                <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
              </View>
              
              {/* Category and Company Row */}
              <View style={styles.categoryCompanyRow}>
                {productCategory && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                      {typeof productCategory === 'string' ? productCategory : productCategory.name}
                    </Text>
                  </View>
                )}
                {productCompany && (
                  <View style={styles.companyBadge}>
                    <Text style={styles.companyText}>{productCompany}</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {productDescription}
            </Text>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsText}>• 100% Natural ingredients</Text>
              <Text style={styles.benefitsText}>• Traditional Balinese wisdom</Text>
            </View>

            {/* Stock Info */}
            {totalStock > 0 && totalStock <= 10 && (
              <Text style={styles.stockWarning}>Only {totalStock} left in stock</Text>
            )}


            {/* Price and Actions */}
            <View style={styles.listBottomSection}>
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>{formatPrice(productPrice)}</Text>
                <Text style={styles.priceLabel}>per unit</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid View
  return (
    <TouchableOpacity style={styles.gridCard} onPress={handlePress} activeOpacity={0.8}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageError ? `${IMAGE_BASE_URL}default-product.jpg` : imageUrl }}
          style={[styles.productImage, isOutOfStock && styles.outOfStockImage]}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Sold Out</Text>
          </View>
        )}

        {/* Wishlist Button */}
        {renderWishlistButton()}

        {/* Overlay Gradient */}
        <View style={styles.imageOverlay} />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <View style={styles.productTitleRow}>
          <Text style={styles.herbalIndicator}>{herbalIndicator}</Text>
          <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
        </View>
        
        {/* Category and Company Row */}
        <View style={styles.categoryCompanyRow}>
          {productCategory && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {typeof productCategory === 'string' ? productCategory : productCategory.name}
              </Text>
            </View>
          )}
          {productCompany && (
            <View style={styles.companyBadge}>
              <Text style={styles.companyText}>{productCompany}</Text>
            </View>
          )}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsText}>• 100% Natural</Text>
          <Text style={styles.benefitsText}>• Traditional wisdom</Text>
        </View>

        {/* Stock Info */}
        {totalStock > 0 && totalStock <= 10 && (
          <Text style={styles.stockWarning}>Only {totalStock} left</Text>
        )}

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{formatPrice(productPrice)}</Text>
          <Text style={styles.priceLabel}>per unit</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid View Styles
  gridCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    width: CARD_WIDTH,
    height: GRID_CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    height: GRID_IMAGE_HEIGHT,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  outOfStockImage: {
    opacity: 0.6,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  freshBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(79, 121, 66, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  freshBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -35 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Fixed Wishlist Button Styles - Background tetap putih, hanya heart yang berubah warna
  wishlistButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(158, 158, 158, 0.3)',
  },
  // Heart icon yang berubah warna - menggunakan Unicode heart solid ♥
  heartIcon: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 12,
    backgroundColor: '#F8FDF8',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  herbalIndicator: {
    fontSize: 14,
    marginRight: 5,
  },
  productName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#2E5233',
    lineHeight: 16,
  },
  categoryCompanyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
    gap: 4,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 9,
    color: '#4F7942',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  companyBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  companyText: {
    fontSize: 9,
    color: '#F57C00',
    fontWeight: '600',
  },
  benefitsContainer: {
    marginBottom: 5,
  },
  benefitsText: {
    fontSize: 9,
    color: '#86A789',
    fontWeight: '500',
    lineHeight: 12,
  },
  stockWarning: {
    fontSize: 9,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  priceContainer: {
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 1,
  },
  priceLabel: {
    fontSize: 9,
    color: '#86A789',
  },
  gridAddToCartButton: {
    backgroundColor: '#4F7942',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gridAddToCartIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  gridAddToCartText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#86A789',
    opacity: 0.6,
  },

  // List View Styles
  listCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    marginHorizontal: 0,
  },
  listContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 15,
  },
  listImageContainer: {
    position: 'relative',
    width: LIST_IMAGE_WIDTH,
    height: LIST_IMAGE_HEIGHT,
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listContent: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8FDF8',
    justifyContent: 'space-between',
  },
  productHeader: {
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#86A789',
    lineHeight: 16,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  variantsContainer: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
  },
  variantsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F7942',
    marginBottom: 4,
  },
  variantText: {
    fontSize: 10,
    color: '#86A789',
    lineHeight: 14,
  },
  listBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4F7942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});