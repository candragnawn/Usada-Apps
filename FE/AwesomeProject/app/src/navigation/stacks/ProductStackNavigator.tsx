import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import ProductScreen from '@/screens/ProductScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';

import { ProductStackParamList } from '@/types/navigation';

const ProductStack = createStackNavigator<ProductStackParamList>();

// Common screen options
const commonStackScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#F8FDF8' },
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 250,
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 200,
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }: { current: any; layouts: any }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

// Product Stack Navigator
const ProductStackNavigator = () => {
  return (
    <ProductStack.Navigator
      initialRouteName="ProductMain"
      screenOptions={commonStackScreenOptions}
    >
      <ProductStack.Screen name="ProductMain" component={ProductScreen} />
      <ProductStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </ProductStack.Navigator>
  );
};

export default ProductStackNavigator;