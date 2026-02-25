import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { 
  View, 
  StyleSheet, 
  Platform, 
  StatusBar, 
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';

// Import context
import { useAuth } from '../context/AuthContext';


import HomeScreen from '../screens/HomeScreen';
import UsadaScreen from '../screens/UsadaScreen';
import ProductScreen from '../screens/ProductScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import HerbalScanScreen from '../screens/HerbalScanScreen';
import ScanHistoryScreen from '../screens/ScanHistoryScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import withProviders from '../utils/withProviders';

// Import separated ProfileStackNavigator
import ProfileStackNavigator from './src/navigation/stacks/ProfileStackNavigator';

// Create navigation instances
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const UsadaStack = createStackNavigator();
const ProductStack = createStackNavigator();
const CartStack = createStackNavigator();

// Define colors for consistency
const COLORS = {
  primary: '#4F7942',
  lightPrimary: 'rgba(79, 121, 66, 0.15)',
  background: '#FFFFFF',
  border: '#E8F3E8',
  inactive: '#86A789',
};

// Get status bar height for different devices
const STATUSBAR_HEIGHT = StatusBar.currentHeight || (Platform.OS === 'ios' ? 47 : 0);
const IS_IPHONE_WITH_DYNAMIC_ISLAND = Platform.OS === 'ios' && 
  (Platform.constants?.interfaceIdiom === 'phone') && 
  (STATUSBAR_HEIGHT > 40 || (Platform.constants?.osVersion && parseInt(Platform.constants.osVersion) >= 16));

// Custom tab bar icon with enhanced animation effects
const TabBarIcon = ({ focused, color, iconName }: { focused: boolean; color: string; iconName: React.ComponentProps<typeof Ionicons>['name'] }) => {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeBackground} />}
      <Ionicons 
        name={iconName} 
        size={24}
        color={color} 
        style={styles.icon}
      />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
};  

// Optimized screen options with better transitions
const commonStackScreenOptions = {
  headerShown: false,
  // cardStyle: { backgroundColor: '#F8FDF8' }, // Remove, not supported in TS
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  // Remove transitionSpec, use default transitions
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

// Usada Stack Navigator
const UsadaStackNavigator = () => {
  return (
    <UsadaStack.Navigator
      initialRouteName="UsadaMain"
      screenOptions={commonStackScreenOptions}
    >
      <UsadaStack.Screen 
        name="UsadaMain" 
        component={UsadaScreen}
      />
      <UsadaStack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
      />
    </UsadaStack.Navigator>
  );
};

// Product Stack Navigator
const ProductStackNavigator = () => {
  return (
    <ProductStack.Navigator
      initialRouteName="ProductScreen"
      screenOptions={commonStackScreenOptions}
    >
      <ProductStack.Screen name="ProductScreen" component={ProductScreen} />
      <ProductStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </ProductStack.Navigator>
  );
};

// Cart Stack Navigator with auth check for checkout
const CartStackNavigator = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <CartStack.Navigator
      initialRouteName="CartMain"
      screenOptions={commonStackScreenOptions}
    >
      <CartStack.Screen name="CartMain" component={CartScreen} />
      {isAuthenticated && (
        <CartStack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
        />
      )}
    </CartStack.Navigator>
  );
};

// Main Tab Navigator with optimized performance
const MainTabNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator
      key={isAuthenticated ? 'authed' : 'unauthed'}
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: false,
        lazy: true, // Enable lazy loading for better performance
        tabBarHideOnKeyboard: true,
        // unmountOnBlur: false, // REMOVE, not supported
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIcon focused={focused} color={color} iconName="home" />
          ),
        }}
      />
      
      <Tab.Screen
        name="UsadaScreen"
        component={UsadaStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIcon focused={focused} color={color} iconName="book" />
          ),
        }}
        listeners={{
          tabPress: (e: any) => {
            e.preventDefault();
            const navigation = e.target?.navigation ?? e.navigation;
            if (navigation) {
              navigation.navigate('UsadaScreen', {
                screen: 'UsadaMain',
                params: {
                  resetFilter: true,
                  fromTabNavigation: true,
                  timestamp: Date.now()
                }
              });
            }
          }
        }}
      />
      
      <Tab.Screen
        name="ProductScreen"
        component={ProductStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIcon focused={focused} color={color} iconName="leaf" />
          ),
        }}
      />
      
      <Tab.Screen
        name="CartStack"
        component={CartStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIcon focused={focused} color={color} iconName="cart" />
          ),
        }}
      />
      
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIcon focused={focused} color={color} iconName="person" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Tambahkan route scan herbal di root stack navigator
const RootStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen name="HerbalScanScreen" component={HerbalScanScreen} />
    <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
    <Stack.Screen name="ConsultationScreen" component={ConsultationScreen} />
    {/* Tambahkan route lain jika perlu */}
  </Stack.Navigator>
);

// Main App Navigator Component with optimizations
const AppNavigatorContent = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const prevAuthState = useRef(isAuthenticated);

  // Track auth state changes for cleanup
  useEffect(() => {
    if (prevAuthState.current !== isAuthenticated) {
      prevAuthState.current = isAuthenticated;
      
      // Clear any cached screens or data when auth state changes
      if (!isAuthenticated) {
        // User logged out - you can add cleanup logic here
        console.log('User logged out - clearing cache...');
      } else {
        // User logged in
        console.log('User logged in - initializing user data...');
      }
    }
  }, [isAuthenticated]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      {/* Ganti MainTabNavigator dengan RootStackNavigator */}
      <RootStackNavigator />
    </SafeAreaView>
  );
};

// Root App Navigator
const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <AppNavigatorContent />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
  },
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 10,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Platform.OS === 'ios' ? (
      IS_IPHONE_WITH_DYNAMIC_ISLAND ? 95 : 85
    ) : 75,
    paddingBottom: Platform.OS === 'ios' ? 
      (IS_IPHONE_WITH_DYNAMIC_ISLAND ? 35 : 25) : 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  icon: {},
  activeBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightPrimary,
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
  }
});

// CATATAN PENTING:
// Aplikasi ini menggunakan Expo Router UNTUK ENTRY POINT (/) tetapi
// menggunakan React Navigation Stack/Tab untuk navigasi internal.
// - Akses aplikasi via root URL: http://localhost:8081/
// - JANGAN akses via /MainTabs karena route itu didefinisikan secara internal.
//
// Untuk navigasi antar screen di dalam kode:
// - Produk: navigation.navigate('ProductScreen')
// - Usada: navigation.navigate('UsadaScreen')
// - Cart: navigation.navigate('CartStack')
// - Profile: navigation.navigate('ProfileScreen')
// Untuk navigasi ke detail gunakan nama yang sudah ada di stack:
// - navigation.navigate('ProductDetail', { ... })
// - navigation.navigate('ArticleDetail', { ... })
// Jangan gunakan 'ProductMain', 'UsadaMain', 'CartMain', 'ProfileMain' di navigation.navigate dari luar stack-nya.

export default withProviders(AppNavigator);