import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useUsada } from '@/context/UsadaContext';
import { DISEASE_CATEGORIES } from '@/constants/data';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import withProviders from '@/utils/withProviders';

const DiseaseCategories = () => {
  const navigation = useNavigation();
  const {
    articles,
    categoryHasArticles
  } = useUsada();

  // Extract unique categories from articles
  const getArticleCategories = () => {
    if (!articles || articles.length === 0) return [];
    
    const uniqueCategories = [];
    const seenCategories = new Set();

    articles.forEach(article => {
      if (article.category && !seenCategories.has(article.category)) {
        seenCategories.add(article.category);
        uniqueCategories.push({
          id: `category-${article.category}`,
          name: article.category,
          category: article.category,
          articleCount: articles.filter(a => a.category === article.category).length
        });
      }
    });

    return uniqueCategories;
  };

  // Merge article categories with static icons
  const mergeWithStaticIcons = (articleCategories) => {
    return articleCategories.map((category, index) => {
      const staticIcon = DISEASE_CATEGORIES.find(icon => 
        icon.id === category.id || 
        icon.name === category.category ||
        icon.category === category.category
      ) || DISEASE_CATEGORIES[index % DISEASE_CATEGORIES.length];
      
      return {
        ...category,
        icon: staticIcon ? staticIcon.image : null,
        color: staticIcon ? staticIcon.color : '#E8F5E8'
      };
    });
  };

  const articleCategories = getArticleCategories();
  const diseaseCategories = mergeWithStaticIcons(articleCategories);

  // Simplified and more reliable navigation function
  const handleCategoryPress = async (category) => {
    try {
      const categoryName = category.category || category.name;
      
      if (!categoryName) {
        console.error('❌ Category name missing:', category);
        Alert.alert('Error', 'Kategori tidak valid');
        return;
      }

      // Check if category has articles
      if (categoryHasArticles && !categoryHasArticles(categoryName)) {
        Alert.alert('Info', `Tidak ada artikel untuk kategori ${categoryName}`);
        return;
      }

      console.log('🚀 Navigating to category:', categoryName);

      // Create clear navigation parameters
      const navigationParams = {
        selectedCategory: categoryName,
        searchText: '',
        fromCategorySelection: true,
        timestamp: Date.now()
      };

      console.log('📦 Navigation params:', navigationParams);

      // Get navigation state to determine the best route
      const state = navigation.getState();
      const parentState = navigation.getParent()?.getState();
      
      // Simplified navigation strategy - try most common patterns first
      let navigationSuccess = false;

      // Strategy 1: Try nested navigation (most common in tab/stack structure)
      try {
        console.log('🎯 Trying nested navigation...');
        navigation.navigate('UsadaScreen', {
          screen: 'UsadaMain',
          params: navigationParams
        });
        navigationSuccess = true;
        console.log('✅ Nested navigation successful');
      } catch (error) {
        console.log('❌ Nested navigation failed:', error.message);
        
        // Strategy 2: Try direct navigation
        try {
          console.log('🎯 Trying direct navigation...');
          const possibleRoutes = ['UsadaMain', 'Usada', 'UsadaScreen'];
          
          for (const routeName of possibleRoutes) {
            if (state.routeNames?.includes(routeName)) {
              navigation.navigate(routeName, navigationParams);
              navigationSuccess = true;
              console.log(`✅ Direct navigation to ${routeName} successful`);
              break;
            }
          }
        } catch (directError) {
          console.log('❌ Direct navigation failed:', directError.message);
        }
      }

      // Strategy 3: Try parent navigator if available
      if (!navigationSuccess && navigation.getParent()) {
        try {
          console.log('🎯 Trying parent navigator...');
          const parent = navigation.getParent();
          parent.navigate('UsadaStack', {
            screen: 'UsadaMain',
            params: navigationParams
          });
          navigationSuccess = true;
          console.log('✅ Parent navigation successful');
        } catch (parentError) {
          console.log('❌ Parent navigation failed:', parentError.message);
        }
      }

      if (!navigationSuccess) {
        console.error('🔥 All navigation attempts failed');
        Alert.alert(
          'Navigation Error', 
          'Tidak dapat membuka halaman kategori. Silakan coba lagi.',
          [
            { text: 'OK', style: 'default' },
            { 
              text: 'Debug', 
              style: 'default',
              onPress: () => {
                console.log('Debug Info:', {
                  currentRoute: state.routes?.[state.index]?.name,
                  availableRoutes: state.routeNames,
                  parentRoutes: parentState?.routeNames,
                  categoryName,
                  navigationParams
                });
              }
            }
          ]
        );
      }

    } catch (error) {
      console.error('❌ Critical navigation error:', error);
      Alert.alert('Error', `Navigation failed: ${error.message}`);
    }
  };

  const renderDiseaseCategory = (category) => {
    const hasArticles = categoryHasArticles ? categoryHasArticles(category.category) : true;
    
    return (
      <TouchableOpacity
        key={`category-${category.id}`}
        style={[
          styles.categoryCard, 
          { backgroundColor: category.color || '#E8F5E8' },
          !hasArticles && styles.disabledCategoryCard
        ]}
        onPress={() => handleCategoryPress(category)}
        activeOpacity={hasArticles ? 0.7 : 0.3}
        disabled={!hasArticles}
      >
        {category.icon && (
          <Image
            source={category.icon}
            style={[
              styles.categoryImage,
              !hasArticles && styles.disabledCategoryImage
            ]}
            resizeMode="contain"
          />
        )}
        <Text style={[
          styles.categoryName,
          !hasArticles && styles.disabledCategoryName
        ]}>
          {category.category || category.name || 'Unknown Category'}
        </Text>
      </TouchableOpacity>
    );
  };

  // Handle loading and empty states
  if (!articles || articles.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Kategori Penyakit</Text>
        <Text style={styles.noDataText}>Memuat kategori...</Text>
      </View>
    );
  }

  if (!diseaseCategories || diseaseCategories.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Kategori Penyakit</Text>
        <Text style={styles.noDataText}>Tidak ada kategori tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Kategori Penyakit</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScrollView}
        contentContainerStyle={styles.categoriesContent}
      >
        {diseaseCategories.map(renderDiseaseCategory)}
      </ScrollView>
    </View>
  );
};

export default withProviders(DiseaseCategories);