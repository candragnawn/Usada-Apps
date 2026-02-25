// ArticleDetail.js - Fixed version with backend variable alignment
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Share,
  ImageBackground,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useUsada } from '@/context/UsadaContext';

const ArticleDetail = ({ route }) => {
  
  const { articleId, articleSlug } = route?.params || {};
  const navigation = useNavigation();
  
  // Safely destructure context with fallbacks
  const usadaContext = useUsada();
  const { 
    selectedArticle = null, 
    articles = [],
    fetchArticleById = () => Promise.resolve(null), 
    fetchArticleBySlug = () => Promise.resolve({ article: null }),
    toggleFavorite = () => {}, 
    isFavorite = () => false,
    loading = false 
  } = usadaContext || {};
  
  const [localLoading, setLocalLoading] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  // Memoize article data to prevent unnecessary re-renders
  const currentArticle = useMemo(() => {
    return article || selectedArticle;
  }, [article, selectedArticle]);

  // Check if article is already in local articles array (faster lookup)
  const findLocalArticle = useCallback(() => {
    if (!articles || articles.length === 0) return null;
    
    try {
      if (articleId) {
        const id = typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
        return articles.find(item => item?.id === id);
      }
      if (articleSlug) {
        return articles.find(item => item?.slug === articleSlug);
      }
    } catch (err) {
      console.warn('Error finding local article:', err);
    }
    return null;
  }, [articles, articleId, articleSlug]);

  // Load article data when component mounts
  useEffect(() => {
    // Early return if no identifier provided
    if (!articleId && !articleSlug) {
      setError('No article identifier provided');
      return;
    }

    const loadArticle = async () => {
      try {
        setError(null);
        
        // First, try to find article in local cache for instant loading
        const localArticle = findLocalArticle();
        if (localArticle) {
          setArticle(localArticle);
          setFavorite(isFavorite(localArticle.id));
          return; // Exit early if found locally
        }

        // If not found locally, fetch from API
        setLocalLoading(true);
        
        let fetchedArticle = null;
        
        try {
          if (articleSlug) {
            const result = await fetchArticleBySlug(articleSlug);
            fetchedArticle = result?.article || null;
          } else if (articleId) {
            fetchedArticle = await fetchArticleById(articleId);
          }
        } catch (fetchError) {
          console.error('API fetch error:', fetchError);
          throw new Error('Failed to fetch article from server');
        }

        if (fetchedArticle) {
          setArticle(fetchedArticle);
          setFavorite(isFavorite(fetchedArticle.id));
        } else {
          throw new Error('Article not found');
        }

      } catch (err) {
        console.error('Error loading article:', err);
        setError(err.message || 'Failed to load article');
      } finally {
        setLocalLoading(false);
      }
    };

    loadArticle();
  }, [articleId, articleSlug, findLocalArticle, fetchArticleById, fetchArticleBySlug, isFavorite]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  }, [navigation]);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(() => {
    if (!currentArticle?.id) return;
    
    try {
      toggleFavorite(currentArticle.id);
      setFavorite(!favorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  }, [currentArticle, favorite, toggleFavorite]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (!currentArticle) return;
    
    try {
      const shareContent = {
        message: `Check out this Usada Bali remedy: ${currentArticle.title || 'Traditional Remedy'}`,
        title: currentArticle.title || 'Usada Bali Remedy',
      };
      
      if (currentArticle.description) {
        shareContent.message += ` - ${currentArticle.description}`;
      }
      
      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing article:', error);
      // Don't show alert for share cancellation
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share article');
      }
    }
  }, [currentArticle]);

  // Memoize preparation steps parsing - Fixed to match backend field name
  const preparationSteps = useMemo(() => {
    if (!currentArticle) return [];
    
    // Use the correct backend field name: preparation_steps
    const preparationData = currentArticle.preparation_steps;
    
    if (!preparationData) return [];
    
    try {
      // Handle array format (this should be the primary format from your backend)
      if (Array.isArray(preparationData)) {
        return preparationData.filter(step => step && typeof step === 'string' && step.trim());
      }
      
      // Handle string format (fallback)
      if (typeof preparationData === 'string') {
        return preparationData
          .split(/\.\s+|[\r\n]+/)
          .map(step => step.trim())
          .filter(step => step.length > 0)
          .map(step => step.endsWith('.') ? step : step + '.');
      }
      
      // Handle object format (if steps are stored as object properties)
      if (typeof preparationData === 'object') {
        return Object.values(preparationData)
          .filter(step => step && typeof step === 'string')
          .map(step => step.trim())
          .filter(step => step.length > 0);
      }
    } catch (err) {
      console.warn('Error parsing preparation steps:', err);
    }
    
    return [];
  }, [currentArticle]);

  // Safe array rendering helper
  const renderArrayItems = useCallback((items, renderItem) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    
    return items
      .filter(item => item && (typeof item === 'string' ? item.trim() : true))
      .map((item, index) => renderItem(item, index));
  }, []);

  // Show loading state
  if (localLoading || loading || (!currentArticle && !error)) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
          backgroundColor="#4F7942"
        />
        
        {/* Header with back button for loading state */}
        <ImageBackground 
          source={require('@/assets/images/batik.png')} 
          style={styles.header}
          imageStyle={{ opacity: 0.8 }}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </ImageBackground>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F7942" />
          <Text style={styles.loadingText}>Memuat artikel...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !currentArticle) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
          backgroundColor="#4F7942"
        />
        
        <ImageBackground 
          source={require('@/assets/images/batik.png')} 
          style={styles.header}
          imageStyle={{ opacity: 0.8 }}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Error</Text>
          </View>
        </ImageBackground>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Artikel tidak ditemukan</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <Text style={styles.retryButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />
      
      {/* Header with ImageBackground */}
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
        imageStyle={{ opacity: 0.8 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentArticle?.title || 'Article'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleFavoriteToggle}
          >
            <Ionicons 
              name={favorite ? "heart" : "heart-outline"} 
              size={24} 
              color={favorite ? "#FF6B6B" : "white"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
      >
        {/* Hero Image with error handling */}
        <Image 
          source={{ 
            uri: currentArticle?.image_url_full || currentArticle?.image_url || currentArticle?.image || 'https://via.placeholder.com/400x200?text=No+Image'
          }} 
          style={styles.heroImage} 
          resizeMode="cover"
          onError={(e) => {
            console.warn('Image load error:', e.nativeEvent.error);
          }}
          // defaultSource={require('@/assets/images/placeholder.png')} // Add a placeholder image
        />
        
        {/* Article Category and Title */}
        <View style={styles.titleContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {currentArticle?.category || 'Uncategorized'}
            </Text>
          </View>
          <Text style={styles.articleTitle}>
            {currentArticle?.title || 'Untitled Article'}
          </Text>
          {currentArticle?.description && (
            <Text style={styles.description}>{currentArticle.description}</Text>
          )}
        </View>
        
        {/* Benefits Section */}
        {currentArticle?.benefits && Array.isArray(currentArticle.benefits) && currentArticle.benefits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf-outline" size={20} color="#4F7942" />
              <Text style={styles.sectionTitle}>Manfaat</Text>
            </View>
            <View style={styles.benefitsList}>
              {renderArrayItems(currentArticle.benefits, (benefit, index) => (
                <View key={`benefit-${index}`} style={styles.benefitItem}>
                  <Text style={styles.benefitBullet}>•</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Ingredients Section */}
        {currentArticle?.ingredients && Array.isArray(currentArticle.ingredients) && currentArticle.ingredients.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="basket-outline" size={20} color="#4F7942" />
              <Text style={styles.sectionTitle}>Bahan-Bahan</Text>
            </View>
            <View style={styles.ingredientsList}>
              {renderArrayItems(currentArticle.ingredients, (ingredient, index) => (
                <View key={`ingredient-${index}`} style={styles.ingredientItem}>
                  <Text style={styles.ingredientBullet}>•</Text>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Preparation Section */}
        {preparationSteps.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medkit-outline" size={20} color="#4F7942" />
              <Text style={styles.sectionTitle}>Cara Pembuatan</Text>
            </View>
            <View style={styles.preparationContainer}>
              {preparationSteps.map((step, index) => (
                <View key={`step-${index}`} style={styles.preparationStep}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>
                    {step.replace(/^\d+\.\s*/, '')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Safety Notice */}
        <View style={styles.safetyNotice}>
          <Ionicons name="information-circle-outline" size={24} color="#E67E22" />
          <Text style={styles.safetyText}>
            Konsultasikan dengan ahli kesehatan sebelum menggunakan ramuan tradisional
            untuk kondisi medis yang serius. Ramuan ini adalah pelengkap, bukan pengganti
            perawatan medis modern.
          </Text>
        </View>
        
        {/* Related Articles Placeholder */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Artikel Terkait</Text>
          <Text style={styles.relatedMessage}>Fitur ini akan segera hadir.</Text>
        </View>
      </ScrollView>
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
    fontSize: 16,
    color: '#4F7942',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
    paddingHorizontal: 30,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
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
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F8F0',
  },
  titleContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#4F7942',
    fontWeight: '600',
    fontSize: 14,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E5233',
    marginLeft: 8,
  },
  benefitsList: {
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  benefitBullet: {
    fontSize: 16,
    color: '#4F7942',
    marginRight: 8,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  ingredientsList: {
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  ingredientBullet: {
    fontSize: 16,
    color: '#4F7942',
    marginRight: 8,
    marginTop: 2,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  preparationContainer: {
    backgroundColor: '#F0F8F0',
    padding: 16,
    borderRadius: 8,
  },
  preparationStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    backgroundColor: '#4F7942',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  safetyNotice: {
    backgroundColor: '#FFF5E6',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  safetyText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  relatedSection: {
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E5233',
    marginBottom: 8,
  },
  relatedMessage: {
    fontSize: 16,
    color: '#86A789',
    fontStyle: 'italic',
  }
});

export default ArticleDetail;