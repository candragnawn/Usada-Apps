export type RootStackParamList = {
  Opening: undefined;
  MainApp: { screen?: string; params?: any } | undefined;
  MainTabs: undefined;
  Auth: undefined;
  HomeScreen: undefined;
  UsadaScreen: undefined;
  UsadaMain: undefined;
  ProductScreen: undefined;
  ProductMain: undefined;
  ProductDetail: { productId: number };
  ArticleDetail: { article: any; fromCategory?: any };
  CartMain: undefined;
  CartStack: { screen: keyof CartStackParamList; params?: any } | undefined;
  Checkout: undefined;
  PaymentInfo: {
    orderId: number;
    invoice_url: string;
    amount: number;
    orderData: any;
  };
  HerbalScanScreen: { mode?: 'upload' } | undefined;
  ScanScreen: { mode?: 'upload' } | undefined;
  ScanHistory: undefined;
  ConsultationScreen: undefined;
  ConsultationBooking: { doctor?: any } | undefined;
  ChatScreen: undefined;
  OrderSuccess: { orderId: string } | undefined;
  Login: undefined;
  Register: undefined;
  LoginSuccess: undefined;
  ProfileScreen: { screen: keyof ProfileStackParamList; params?: any } | undefined;
  ProfileMain: undefined;
};

export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
  PaymentInfo: {
    orderId: number;
    invoice_url: string;
    amount: number;
    orderData: any;
  };
  OrderSuccess: { orderId: string } | undefined;
  Orders: undefined;
  OrderHistory: undefined;
  CartLogin: undefined;
  CartRegister: undefined;
};

export type ProductStackParamList = {
  ProductMain: undefined;
  ProductScreen: undefined;
  ProductDetail: { productId: number };
};

export type UsadaStackParamList = {
  UsadaMain: {
    selectedCategory?: string;
    searchText?: string;
    fromCategorySelection?: boolean;
    resetFilter?: boolean;
    fromTabNavigation?: boolean;
    timestamp?: number;
  } | undefined;
  UsadaScreen: {
    selectedCategory?: string;
    searchText?: string;
    fromCategorySelection?: boolean;
  } | undefined;
  Usada: {
    selectedCategory?: string;
    searchText?: string;
    fromCategorySelection?: boolean;
  } | undefined;
  ArticleDetail: { article: any; fromCategory?: any };
};

export type ProfileStackParamList = {
  ProtectedProfile: undefined;
  ProfileMain: undefined;
  Login: undefined;
  Register: undefined;
  LoginSuccess: undefined;
};

export type MainTabParamList = {
  HomeScreen: undefined;
  ArticlesTab: { screen: keyof UsadaStackParamList; params?: any } | undefined;
  ProductScreen: undefined;
  CartStack: { screen: keyof CartStackParamList; params?: any } | undefined;
  ProfileScreen: { screen: keyof ProfileStackParamList; params?: any } | undefined;
};
