
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; // Added Feather icons
import { useFilter } from '@/context/FilterContext';
import { useProductsContext } from '@/context/ProductsContext';
import { ProductCard } from '@/components/Product/ProductCard';
import { useNavigation } from '@react-navigation/native'; // Added navigation hook

// Get screen dimensions for consistent card sizing
const { width } = Dimensions.get('window');
const PADDING = 15; 
const GAP = 15; 
const CARD_WIDTH = (width - (PADDING * 2) - GAP) / 2; 

interface ProductScreenProps {
  onProductPress: (productId: number) => void;
}

export const ProductScreen: React.FC<ProductScreenProps> = ({ onProductPress }) => {
  const navigation = useNavigation(); // Added navigation hook
  const { loading } = useProductsContext();
  const {
    paginatedProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    currentPage,
    setCurrentPage,
    totalPages,
    clearFilters,
    filteredAndSortedProducts,
    viewMode,
    setViewMode,
  } = useFilter();

  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' },
  ];

  // Handle navigation back
  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleProductPress = (productId: number) => {
    onProductPress(productId);
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPriceRange({ ...priceRange, [field]: numericValue });
  };

  const formatNumber = (num: string) => {
    if (!num) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(num));
  };

  const CustomDropdown = ({ 
    options, 
    selectedValue, 
    onSelect, 
    placeholder, 
    isVisible, 
    onClose 
  }: {
    options: Array<{ label: string; value: string }>;
    selectedValue: string;
    onSelect: (value: string) => void;
    placeholder: string;
    isVisible: boolean;
    onClose: () => void;
  }) => (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  selectedValue === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderFilterSection = () => (
    <View style={styles.filterContainer}>
      {/* Search Bar with Herbal Icon */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🌿</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search herbal products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#86A789"
          />
        </View>
        <TouchableOpacity
          style={styles.filterToggleButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>
            {showFilters ? '▲' : '▼'}
          </Text>
          <Text style={styles.filterToggleLabel}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <Text style={styles.viewModeLabel}>View:</Text>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'grid' && styles.activeViewMode]}
          onPress={() => setViewMode('grid')}
        >
          <Text style={[styles.viewModeText, viewMode === 'grid' && styles.activeViewModeText]}>
            ⊞ Grid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.viewModeText, viewMode === 'list' && styles.activeViewModeText]}>
            ☰ List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Advanced Filters */}
      {showFilters && (
        <View style={styles.advancedFilters}>
          {/* Category Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>🏷️ Category</Text>
            <TouchableOpacity
              style={styles.customDropdownButton}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {selectedCategory || 'Select Category'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Sort Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>🔄 Sort by</Text>
            <TouchableOpacity
              style={styles.customDropdownButton}
              onPress={() => setShowSortModal(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {sortOptions.find(opt => opt.value === sortBy)?.label || 'Select Sort'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>💰 Price Range (Rp)</Text>
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min price"
                  value={formatNumber(priceRange.min)}
                  onChangeText={(value) => handlePriceRangeChange('min', value.replace(/[.,]/g, ''))}
                  keyboardType="numeric"
                  placeholderTextColor="#86A789"
                />
              </View>
              <View style={styles.priceRangeSeparator}>
                <Text style={styles.separatorText}>to</Text>
              </View>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max price"
                  value={formatNumber(priceRange.max)}
                  onChangeText={(value) => handlePriceRangeChange('max', value.replace(/[.,]/g, ''))}
                  keyboardType="numeric"
                  placeholderTextColor="#86A789"
                />
              </View>
            </View>
          </View>

          {/* Clear Filters Button */}
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersIcon}>🧹</Text>
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Dropdowns */}
      <CustomDropdown
        options={categories.map(cat => ({ label: cat, value: cat }))}
        selectedValue={selectedCategory}
        onSelect={setSelectedCategory}
        placeholder="Select Category"
        isVisible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />

      <CustomDropdown
        options={sortOptions}
        selectedValue={sortBy}
        onSelect={setSortBy}
        placeholder="Sort by"
        isVisible={showSortModal}
        onClose={() => setShowSortModal(false)}
      />
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <TouchableOpacity
          key="prev"
          style={styles.paginationButton}
          onPress={() => setCurrentPage(currentPage - 1)}
        >
          <Text style={styles.paginationButtonText}>‹ Prev</Text>
        </TouchableOpacity>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.paginationButton,
            styles.paginationNumberButton,
            currentPage === i && styles.activePaginationButton,
          ]}
          onPress={() => setCurrentPage(i)}
        >
          <Text
            style={[
              styles.paginationButtonText,
              currentPage === i && styles.activePaginationButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <TouchableOpacity
          key="next"
          style={styles.paginationButton}
          onPress={() => setCurrentPage(currentPage + 1)}
        >
          <Text style={styles.paginationButtonText}>Next ›</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.pagination}>{pages}</View>
        <Text style={styles.resultsText}>
          🌱 Showing {(currentPage - 1) * 6 + 1}-{Math.min(currentPage * 6, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} herbal products
        </Text>
      </View>
    );
  };

  // Using custom renderItem to apply proper item layout
  const renderProduct = ({ item, index }: { item: any, index: number }) => {
    // For grid view, handle the left/right positioning
    if (viewMode === 'grid') {
      return (
        <View style={[
          styles.gridItemContainer,
          // If odd index (right side), add marginLeft
          index % 2 === 1 ? { marginLeft: GAP } : null
        ]}>
          <ProductCard
            product={item}
            viewMode="grid"
            onPress={handleProductPress}
          />
        </View>
      );
    }
    
    // For list view, use full width
    return (
      <ProductCard
        product={item}
        viewMode="list"
        onPress={handleProductPress}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F7942" />
        <Text style={styles.loadingText}>🌿 Loading herbal products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />
      
      {/* Header with Bali Herbal Theme and Background Image - Updated with back button */}
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Added back button similar to ProfileScreen and Usada */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleNavigateBack}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <View>
            <Text style={styles.headerTitle}>🌿 Usada Herbal</Text>
            <Text style={styles.headerSubtitle}>
              Bali Fresh Natural Products
            </Text>
          </View>
        </View>
        <View style={styles.headerStats}>
          <Text style={styles.headerStatsText}>
          {paginatedProducts.length} products
          </Text>
        </View>
      </ImageBackground>

      {/* Filters */}
      {renderFilterSection()}

      {/* Products List */}
      <FlatList
        data={paginatedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // This forces FlatList to re-render when viewMode changes
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍃</Text>
            <Text style={styles.emptyText}>No herbal products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
              <Text style={styles.emptyButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Pagination */}
      {renderPagination()}
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
  // Updated header styling with back button like in Usada and ProfileScreen
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
    overflow: 'hidden', // Important to keep the borderRadius working with the image
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Added back button styling similar to ProfileScreen
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
  filterContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4F7942',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2E5233',
  },
  filterToggleButton: {
    backgroundColor: '#4F7942',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filterToggleText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  filterToggleLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
  viewModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#F0F8F0',
    padding: 8,
    borderRadius: 12,
  },
  viewModeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5233',
    marginRight: 15,
  },
  viewModeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  activeViewMode: {
    backgroundColor: '#4F7942',
    borderColor: '#4F7942',
  },
  viewModeText: {
    fontSize: 14,
    color: '#2E5233',
    fontWeight: '500',
  },
  activeViewModeText: {
    color: 'white',
  },
  advancedFilters: {
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    paddingTop: 20,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5233',
    marginBottom: 10,
  },
  customDropdownButton: {
    backgroundColor: '#F0F8F0',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2E5233',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#4F7942',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '85%',
    maxHeight: '60%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  closeButton: {
    fontSize: 20,
    color: '#4F7942',
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F8F0',
  },
  selectedOption: {
    backgroundColor: '#F0F8F0',
  },
  optionText: {
    fontSize: 16,
    color: '#2E5233',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#4F7942',
  },
  checkMark: {
    fontSize: 18,
    color: '#4F7942',
    fontWeight: 'bold',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInputContainer: {
    flex: 1,
  },
  priceInput: {
    backgroundColor: '#F0F8F0',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    color: '#2E5233',
  },
  priceRangeSeparator: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  separatorText: {
    fontSize: 16,
    color: '#86A789',
    fontWeight: '500',
  },
  clearFiltersButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  clearFiltersIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  productsList: {
    padding: PADDING,
  },
  // Grid layout styles
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    width: '100%',
  },
  gridItemContainer: {
    width: CARD_WIDTH,
    marginBottom: 15,
  },
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
  paginationContainer: {
    backgroundColor: 'white',
    margin: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: '#F0F8F0',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  paginationNumberButton: {
    minWidth: 44,
    alignItems: 'center',
  },
  activePaginationButton: {
    backgroundColor: '#4F7942',
    borderColor: '#4F7942',
  },
  paginationButtonText: {
    fontSize: 14,
    color: '#2E5233',
    fontWeight: '500',
  },
  activePaginationButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#86A789',
    fontStyle: 'italic',
  },
});