import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ProductScreen } from '@/components/Product/Products';

const WrappedProductScreen = () => {
  const handleProductPress = (productId: number) => {
    // Handle product press - navigate to product detail page
    Alert.alert('Product Selected', `Product ID: ${productId}`, [
      { text: 'OK', onPress: () => console.log(`Selected product: ${productId}`) }
    ]);
  };

  return (
    <View style={styles.container}>
      <ProductScreen onProductPress={handleProductPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

export default WrappedProductScreen;