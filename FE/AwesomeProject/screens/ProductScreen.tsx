// src/Screens/ProductScreen.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { ProductScreen as ProductComponent } from '@/components/Product/Products';
import withProviders from '@/utils/withProviders';
import { useNavigation } from '@react-navigation/native';

const ProductScreen = () => {
  // Make sure to type your navigation properly
  const navigation = useNavigation();
  
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

export default withProviders(ProductScreen);