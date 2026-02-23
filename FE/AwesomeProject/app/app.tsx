import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import all context providers
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { UsadaProvider } from '@/context/UsadaContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { FilterProvider } from '@/context/FilterContext';
import { OrderProvider } from '@/context/OrderContext';

// Import the root navigator
import RootNavigator from './src/navigation/AppNavigator';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4F7942" />
      
      {/* Provider nesting order */}
      <AuthProvider>
        <OrderProvider>
          <ProductsProvider>
            <FilterProvider>
              <CartProvider>
                <UsadaProvider>
                  <AppNavigator />
                </UsadaProvider>
              </CartProvider>
            </FilterProvider>
          </ProductsProvider>
        </OrderProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}