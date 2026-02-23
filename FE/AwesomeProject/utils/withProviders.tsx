import React from 'react';
import { FilterProvider } from '@/context/FilterContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { UsadaProvider } from '@/context/UsadaContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { OrderProvider } from '@/context/OrderContext';

/**
 * Higher-order component that wraps components with necessary context providers
 * This allows us to easily provide all required contexts to screens
 */
const withProviders = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithProviders: React.FC<P> = (props) => (
    <AuthProvider>
    <OrderProvider>
    <ProductsProvider>
      <FilterProvider>
        <CartProvider>
          <UsadaProvider>
            <Component {...props} />
          </UsadaProvider>
        </CartProvider>
      </FilterProvider>
    </ProductsProvider>
    </OrderProvider>
    </AuthProvider>
  );
  
  // Display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithProviders.displayName = `withProviders(${displayName})`;
  
  return WithProviders;
};

export default withProviders;