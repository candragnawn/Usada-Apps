// src/Screens/ProductScreen.tsx
import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { ProductScreen as ProductComponent } from '@/components/Product/Products';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useProductsContext } from '@/context/ProductsContext';

const ProductScreen = () => {
  // Make sure to type your navigation properly
  const navigation = useNavigation();
  const { fetchProducts } = useProductsContext();
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );
  
  const handleProductPress = (productId: number) => {
    console.log(`Navigating to product detail with ID: ${productId}`);
    // Make sure this exact name matches what's defined in your stack navigator
    navigation.navigate('ProductDetail', { productId });
  };
  
  return (
    <ProductComponent onProductPress={handleProductPress} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default ProductScreen;