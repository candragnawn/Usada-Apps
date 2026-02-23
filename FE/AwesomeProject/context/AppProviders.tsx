import React from 'react';
import { ProductsProvider } from '../context/ProductsContext';
import { FilterProvider } from './FilterContext';

interface Props {
  children: React.ReactNode;
}

const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <FilterProvider>
     <ProductsProvider>
      {children}
     </ProductsProvider>
    </FilterProvider>
  );
};

export default AppProviders;