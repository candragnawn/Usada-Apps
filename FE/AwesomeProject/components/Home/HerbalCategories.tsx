import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HERBAL_CATEGORIES } from '../../constants/data'; // Import data from constants
import { useFilter } from '@/context/FilterContext'; // Import FilterContext
import styles from './styles'; // Import styles

const HerbalCategories = () => {
  const navigation = useNavigation();
  const { setSelectedCategory, clearFilters } = useFilter();

  const handleCategoryPress = (categoryName) => {
    // Clear existing filters first
    clearFilters();
    
    // Set the selected category
    setSelectedCategory(categoryName);
    
    // Navigate to ProductMain screen
    navigation.navigate('ProductMain');
  };

  const renderHerbalCategory = (category) => (
    <TouchableOpacity 
      key={category.id} 
      style={styles.herbalCategoryCard}
      onPress={() => handleCategoryPress(category.name)}
      activeOpacity={0.7}
    >
      {/* Display the image/icon */}
      <Image
        source={category.icon || category.image} // Use icon first, fallback to image
        style={styles.herbalCategoryImage} // Style the image
        resizeMode="contain"
      />
      <Text style={styles.herbalCategoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer2}>
      <Text style={styles.sectionTitle2}>Kategori Herbal</Text>
      <View style={styles.herbalCategoriesContainer}>
        {HERBAL_CATEGORIES.map(renderHerbalCategory)}
      </View>
    </View>
  );
};

export default HerbalCategories;