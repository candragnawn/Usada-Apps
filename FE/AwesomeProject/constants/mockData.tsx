// src/constants/mockData.tsx
import { Product, Category } from '../types';

export const mockCategories: Category[] = [
  { id: 1, name: 'Beverages', image:  require('../assets/images/boreh.jpeg')},
  { id: 2, name: 'Herbs', image:  require('../assets/images/boreh.jpeg')},
  { id: 3, name: 'Supplements', image:  require('../assets/images/boreh.jpeg') },
  { id: 4, name: 'Oils', image:  require('../assets/images/boreh.jpeg')},
  { id: 5, name: 'Spices', image:  'https://pharmaceutical-journal.com/wp-content/uploads/2021/01/herbal-medicines-ss-18-scaled.jpg'},
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Jamu Kunyit Asam',
    description: 'Traditional Balinese turmeric and tamarind herbal drink with many health benefits including anti-inflammatory properties and digestive support. Made fresh from organic ingredients.',
    price: 25000,
    images:  'https://pharmaceutical-journal.com/wp-content/uploads/2021/01/herbal-medicines-ss-18-scaled.jpg',
    category: { id: 1, name: 'Beverages' }
  },
  {
    id: 2,
    name: 'Loloh Cemcem',
    description: 'A refreshing traditional Balinese herbal drink made from Cemcem leaves known for its detoxifying properties. Helps cool the body and supports overall wellness.',
    price: 20000,
    images:  'https://1.bp.blogspot.com/-0Hdp3bXa1dI/X6KDyyLesnI/AAAAAAAAGQM/Ayv_k6o8kO8oHfATXCRBwB5gX228JFpOwCLcBGAsYHQ/s16000/loloh%2Bcemcem.jpg',
    category: { id: 1, name: 'Beverages' }
  },
  {
    id: 3,
    name: 'Minyak Lengis Nyuh',
    description: 'Traditional Balinese virgin coconut oil extracted using ancestral methods. Used for cooking, skin care, and traditional healing practices.',
    price: 65000,
    images:  'https://pharmaceutical-journal.com/wp-content/uploads/2021/01/herbal-medicines-ss-18-scaled.jpg',
    category: { id: 4, name: 'Oils' }
  },
  {
    id: 4, 
    name: 'Herb Mix Boreh',
    description: 'Traditional Balinese herbal body scrub blend with warming properties. Contains various spices including clove, cinnamon, and ginger to improve circulation.',
    price: 45000,
    images:  'https://1.bp.blogspot.com/-0Hdp3bXa1dI/X6KDyyLesnI/AAAAAAAAGQM/Ayv_k6o8kO8oHfATXCRBwB5gX228JFpOwCLcBGAsYHQ/s16000/loloh%2Bcemcem.jpg',
    category: { id: 2, name: 'Herbs' }
  },
  {
    id: 5,
    name: 'Jamu Beras Kencur',
    description: 'A traditional herbal tonic made from rice and aromatic ginger. Provides energy, improves appetite, and helps relieve minor aches and pains.',
    price: 22000,
    images: 'https://via.placeholder.com/600x400/4F7942/FFFFFF?text=Jamu+Beras+Kencur',
    category: { id: 1, name: 'Beverages' }
  },
  {
    id: 6,
    name: 'Canang Sari Kit',
    description: 'Complete kit for making Balinese offerings with aromatic herbs and flowers. Contains all natural materials used in traditional Balinese ceremonies.',
    price: 35000,
    images: 'https://via.placeholder.com/600x400/4F7942/FFFFFF?text=Canang+Sari+Kit',
    category: { id: 2, name: 'Herbs' }
  },
  {
    id: 7,
    name: 'Tabia Bun Spice Mix',
    description: 'Traditional Balinese spice blend used in many local dishes. Contains long pepper, chili, and other aromatic spices for an authentic flavor.',
    price: 18000,
    images: 'https://via.placeholder.com/600x400/4F7942/FFFFFF?text=Tabia+Bun+Spice+Mix',
    category: { id: 5, name: 'Spices' }
  },
  {
    id: 8,
    name: 'Ashitaba Supplement',
    description: 'Natural supplement made from Ashitaba plant, known as "tomorrow leaf" for its rapid regeneration. Rich in vitamins and supports healthy metabolism.',
    price: 75000,
    images: 'https://via.placeholder.com/600x400/4F7942/FFFFFF?text=Ashitaba+Supplement',
    category: { id: 3, name: 'Supplements' }
  },
];