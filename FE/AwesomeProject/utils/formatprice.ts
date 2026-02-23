export const formatPrice = (price: number): string => {
  return `Rp ${price.toLocaleString('id-ID')}`;
};