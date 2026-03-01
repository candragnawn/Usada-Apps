// Usada.js - Fixed version with properly centered loading like ProductScreen
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useUsada } from '@/context/UsadaContext';

const Usada = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const searchTimeoutRef = useRef(null);
  
  const { 
    articles,
    categories,
    loading,
    error,
    searchArticles,
    getArticlesByDiseaseCategory,
    clearError
  } = useUsada();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Enhanced route parameter handling
  useFocusEffect(
    useCallback(() => {
      // Get parameters from route
      const params: any = route.params || {};
      const categoryFromParams = params.selectedCategory;
      const searchTextFromParams = params.searchText || '';
      const fromCategorySelection = params.fromCategorySelection;
      const resetFilter = params.resetFilter;
      const timestamp = params.timestamp;
      
      console.log('🔄 Usada Focus Effect - Params:', {
        categoryFromParams,
        searchTextFromParams,
        fromCategorySelection,
        timestamp,
        currentCategory: selectedCategory,
        currentSearch: searchText
      });
      
      // Handle category selection or reset from Home/Tab
      if (resetFilter || fromCategorySelection || categoryFromParams) {
        const targetCategory = categoryFromParams || 'Semua';
        const targetSearch = searchTextFromParams || '';
        
        console.log('🔄 Applying navigation params:', { targetCategory, targetSearch, resetFilter });
        
        setSelectedCategory(targetCategory);
        setSearchText(targetSearch);
        
        // Force immediate filtering
        setTimeout(() => {
          handleFilterArticles(targetCategory, targetSearch);
        }, 100);
        
        // Clear the route params to prevent repeated actions on subsequent focus
        navigation.setParams({
          selectedCategory: undefined,
          searchText: undefined,
          fromCategorySelection: undefined,
          resetFilter: undefined,
          timestamp: undefined
        } as any);
      }
      
      // Initialize if not done yet
      if (!isInitialized) {
        initializeComponent();
      }
    }, [route.params, selectedCategory, searchText, isInitialized])
  );

  // Initialize component
  const initializeComponent = useCallback(() => {
    console.log('🚀 Initializing Usada component...');
    
    if (articles && articles.length > 0) {
      console.log('✅ Articles available:', articles.length);
      setFilteredArticles(articles);
      setIsInitialized(true);
      
      // Apply initial filtering based on current state
      const params = route.params || {};
      const categoryFromParams = params.selectedCategory;
      const searchTextFromParams = params.searchText || '';
      
      if (categoryFromParams || searchTextFromParams) {
        setTimeout(() => {
          handleFilterArticles(
            categoryFromParams || selectedCategory,
            searchTextFromParams || searchText
          );
        }, 100);
      }
    } else {
      console.log('⏳ Waiting for articles to load...');
      setFilteredArticles([]);
    }
  }, [articles, route.params, selectedCategory, searchText]);

  // Watch for articles changes
  useEffect(() => {
    if (articles && articles.length > 0 && !isInitialized) {
      initializeComponent();
    }
  }, [articles, isInitialized, initializeComponent]);

  // Handle filtering articles
  const handleFilterArticles = useCallback(async (category = selectedCategory, search = searchText) => {
    try {
      console.log('🔍 Filtering articles:', { 
        category, 
        search, 
        articlesCount: articles?.length,
        fromState: { selectedCategory, searchText }
      });
      
      if (!articles || articles.length === 0) {
        console.log('❌ No articles available for filtering');
        setFilteredArticles([]);
        return;
      }

      let filtered = [...articles];

      // Apply search filter first
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(article =>
          article.title?.toLowerCase().includes(searchLower) ||
          article.description?.toLowerCase().includes(searchLower) ||
          article.category?.toLowerCase().includes(searchLower)
        );
        console.log('🔍 After search filter:', filtered.length);
      }

      // Apply category filter
      if (category && category !== 'Semua') {
        filtered = filtered.filter(article => {
          const articleCategory = article.category;
          return articleCategory === category ||
                 articleCategory?.toLowerCase() === category.toLowerCase();
        });
        console.log('🏷️ After category filter:', filtered.length);
      }

      console.log('✅ Final filtered articles:', filtered.length);
      setFilteredArticles(filtered);
      setCurrentPage(1);
      setHasMoreData(false); // Disable pagination for local filtering
      
    } catch (error) {
      console.error('❌ Error filtering articles:', error);
      setFilteredArticles([]);
    }
  }, [articles, selectedCategory, searchText]);

  // Handle search with debouncing
  const handleSearch = useCallback((text) => {
    console.log('🔍 Search input:', text);
    setSearchText(text);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      handleFilterArticles(selectedCategory, text);
    }, 300);
  }, [selectedCategory, handleFilterArticles]);

  // Handle category selection
  const handleCategorySelect = useCallback((category) => {
    console.log('🏷️ Category selected:', category, 'Current:', selectedCategory);
    
    if (category === selectedCategory) {
      console.log('⏭️ Same category selected, skipping');
      return;
    }
    
    setSelectedCategory(category);
    
    // Clear search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Apply filtering immediately
    handleFilterArticles(category, searchText);
  }, [selectedCategory, searchText, handleFilterArticles]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Reset to show all articles
      if (articles && articles.length > 0) {
        setFilteredArticles(articles);
        handleFilterArticles(selectedCategory, searchText);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Gagal memuat ulang data. Silakan coba lagi.');
    } finally {
      setIsRefreshing(false);
    }
  }, [articles, selectedCategory, searchText, handleFilterArticles]);

  // Navigate to article detail
  const navigateToArticleDetail = useCallback((article) => {
    navigation.navigate('ArticleDetail', { 
      articleId: article.id,
      articleSlug: article.slug 
    });
  }, [navigation]);

  // Get available categories with better fallback
  const getAvailableCategories = useCallback(() => {
    const baseCategories = ['Semua'];
    
    if (articles && articles.length > 0) {
      // Extract unique categories from articles
      const uniqueCategories = [...new Set(
        articles
          .map(article => article.category)
          .filter(Boolean)
          .filter(cat => cat.trim() !== '')
      )].sort();
      
      console.log('📚 Available categories from articles:', uniqueCategories);
      return [...baseCategories, ...uniqueCategories];
    }
    
    // Fallback to context categories
    if (categories && categories.length > 0) {
      const filteredCategories = categories
        .filter(cat => cat && cat !== 'Semua' && cat.trim() !== '')
        .sort();
      console.log('📚 Available categories from context:', filteredCategories);
      return [...baseCategories, ...filteredCategories];
    }
    
    console.log('📚 Using base categories only');
    return baseCategories;
  }, [articles, categories]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Render category filter chips
  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory === item;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isSelected && styles.selectedCategoryChip,
        ]}
        onPress={() => handleCategorySelect(item)}
      >
        <Text
          style={[
            styles.categoryChipText,
            isSelected && styles.selectedCategoryChipText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render article list item
  const renderArticleItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.articleCard}
      onPress={() => navigateToArticleDetail(item)}
    >
      <Image 
        source={{ uri: item.image_url_full || item.image_url || item.image }} 
        style={styles.articleImage}
        onError={(e) => {
          console.warn('Image load error:', e.nativeEvent.error);
        }}
      />
      <View style={styles.articleContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'Uncategorized'}</Text>
          {item.view_count && (
            <Text style={styles.additionalText}>{item.view_count} views</Text>
          )}
        </View>
        <Text style={styles.articleTitle} numberOfLines={3}>{item.title}</Text>
        {item.description && (
          <Text style={styles.articleDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {(item.created_at || item.published_at) && (
          <Text style={styles.articleDate}>
            {new Date(item.created_at || item.published_at).toLocaleDateString('id-ID')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🌿</Text>
      <Text style={styles.emptyText}>
        {loading ? 'Memuat artikel...' : 'Tidak ada artikel ditemukan'}
      </Text>
      {!loading && (
        <>
          <Text style={styles.emptySubtext}>
            {searchText 
              ? `Tidak ada artikel ditemukan untuk "${searchText}" dalam kategori ${selectedCategory}` 
              : `Tidak ada artikel ditemukan dalam kategori ${selectedCategory}`
            }
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => {
              setSelectedCategory('Semua');
              setSearchText('');
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
              }
              handleFilterArticles('Semua', '');
            }}
          >
            <Text style={styles.emptyButtonText}>Reset Filter</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  // ✨ FIXED: Loading component now properly centered like ProductScreen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F7942" />
        <Text style={styles.loadingText}>🌿 Loading herbal articles...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />
      
      {/* Header */}
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>🌿 Usada Bali</Text>
            <Text style={styles.headerSubtitle}>
              {selectedCategory !== 'Semua' ? `Pengobatan Tradisional - ${selectedCategory}` : "Traditional Balinese Herbal Medicine"}
            </Text>
          </View>
        </View>
        <View style={styles.headerStats}>
          <Text style={styles.headerStatsText}>
            {filteredArticles.length} artikel
          </Text>
          {selectedCategory !== 'Semua' && (
            <Text style={styles.headerStatsSubtext}>Kategori: {selectedCategory}</Text>
          )}
        </View>
        
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning" size={16} color="#FFB74D" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              onPress={clearError}
              style={styles.errorCloseButton}
            >
              <Ionicons name="close" size={14} color="#FFB74D" />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color="#86A789" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari pengobatan herbal..."
          placeholderTextColor="#86A789"
          value={searchText}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }
            handleFilterArticles(selectedCategory, searchText);
          }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color="#86A789" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={getAvailableCategories()}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContent}
          extraData={selectedCategory} // This forces re-render when selectedCategory changes
        />
      </View>

      {/* Article List */}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        style={styles.articleList}
        contentContainerStyle={styles.articleListContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4F7942']}
            tintColor="#4F7942"
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
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
    paddingTop: 320,
    backgroundColor: '#F8FDF8',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4F7942',
    fontWeight: '500',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontStyle: 'italic',
  },
  headerStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  headerStatsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  headerStatsSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 183, 77, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 10,
  },
  errorText: {
    color: '#FFB74D',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
    flex: 1,
  },
  errorCloseButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2E5233',
  },
  categoryContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  categoryListContent: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    height: 40,
  },
  selectedCategoryChip: {
    backgroundColor: '#4F7942',
    borderColor: '#4F7942',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#2E5233',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  articleList: {
    flex: 1,
  },
  articleListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  articleCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
    paddingBottom: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F0F8F0',
  },
  articleContent: {
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#4F7942',
    fontWeight: '500',
    marginRight: 8,
  },
  additionalText: {
    fontSize: 12,
    color: '#86A789',
    backgroundColor: '#F0F8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E5233',
    lineHeight: 22,
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 14,
    color: '#86A789',
    lineHeight: 18,
    marginBottom: 4,
  },
  articleDate: {
    fontSize: 12,
    color: '#B0BDB0',
    fontStyle: 'italic',
  },
  // Enhanced empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E5233',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#86A789',
    textAlign: 'center',
    marginBottom: 25,
  },
  emptyButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Usada;