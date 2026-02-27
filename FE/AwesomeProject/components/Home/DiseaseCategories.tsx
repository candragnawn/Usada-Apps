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
    categories: contextCategories,
    loading,
    categoryHasArticles
  } = useUsada();


  const getProcessedCategories = () => {
  
    const rawCategories: string[] = contextCategories ? 
      contextCategories.filter((cat: any) => cat !== 'Semua' && cat !== 'All') : 
      [];

    return rawCategories.map((catName: string, index: number) => {
      const staticIcon = DISEASE_CATEGORIES.find((icon: any) => 
        (icon as any).name === catName ||
        (icon as any).category === catName
      ) || DISEASE_CATEGORIES[index % DISEASE_CATEGORIES.length];
      
      return {
        id: `category-${catName}`,
        name: catName,
        category: catName,
        icon: staticIcon ? staticIcon.image : null,
        color: (staticIcon as any).color || '#E8F5E8',
        articleCount: articles.filter((a: any) => a.category === catName).length
      };
    });
  };

  const diseaseCategories = getProcessedCategories();

  // Simplified and more reliable navigation function
  const handleCategoryPress = async (category: any) => {
    try {
      const categoryName = category.category || category.name;
      
      if (!categoryName) {
        console.error('❌ Category name missing:', category);

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

      // Navigation logic...
      (navigation as any).navigate('UsadaScreen', {
        screen: 'UsadaMain',
        params: navigationParams
      });

    } catch (error: any) {
      console.error('❌ Critical navigation error:', error);
      Alert.alert('Error', `Navigation failed: ${error.message}`);
    }
  };

  const renderDiseaseCategory = (category: any) => {
    const hasArticles = categoryHasArticles ? categoryHasArticles(category.category) : true;
    
    return (
      <TouchableOpacity
        key={`category-${category.id}`}
        style={[
          styles.categoryCard, 
          { backgroundColor: category.color || '#E8F5E8' },
          !hasArticles && (styles as any).disabledCategoryCard
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
              !hasArticles && (styles as any).disabledCategoryImage
            ]}
            resizeMode="contain"
          />
        )}
        <Text style={[
          styles.categoryName,
          !hasArticles && (styles as any).disabledCategoryName
        ]}>
          {category.category || category.name || 'Unknown Category'}
        </Text>
      </TouchableOpacity>
    );
  };

  // Handle loading and empty states
  if (loading && (!diseaseCategories || diseaseCategories.length === 0)) {
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

export default DiseaseCategories;