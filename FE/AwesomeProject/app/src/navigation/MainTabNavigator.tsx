import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { CommonActions } from '@react-navigation/native';

// Import context
import { useAuth } from '@/context/AuthContext';

// Import screens
import HomeScreen from '@/screens/HomeScreen';

// Import stack navigators
import UsadaStackNavigator from './stacks/UsadaStackNavigator';
import ProductStackNavigator from './stacks/ProductStackNavigator';
import CartStackNavigator from './stacks/CartStackNavigator';
import ProfileStackNavigator from './stacks/ProfileStackNavigator'; // 🔥 Use ProfileStackNavigator instead

const Tab = createBottomTabNavigator();

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
const TabBarIcon = ({ focused, color, iconName }) => {
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

// 🔥 ALTERNATIVE: Main Tab Navigator using ProfileStackNavigator
const MainTabNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const tabNavigatorRef = useRef(null);
  const prevAuthState = useRef(isAuthenticated);

  // Handle auth state changes and navigation reset
  useEffect(() => {
    if (tabNavigatorRef.current && prevAuthState.current !== isAuthenticated) {
      prevAuthState.current = isAuthenticated;
      
      // Reset navigation when user logs out (authenticated -> not authenticated)
      if (!isAuthenticated) {
        console.log('🔄 User logged out - resetting to ProfileStackNavigator');
        
        tabNavigatorRef.current.dispatch(
          CommonActions.reset({
            index: 4, // Navigate to Profile tab (index 4)
            routes: [
              { name: 'HomeScreen' },
              { name: 'UsadaScreen' },
              { name: 'ProductScreen' },
              { name: 'CartStack' },
              { 
                name: 'ProfileStack',
                state: {
                  index: 0,
                  routes: [{ name: 'ProtectedProfile' }]
                }
              }
            ],
          })
        );
      } else {
        console.log('✅ User logged in - ProfileStackNavigator will handle routing');
      }
    }
  }, [isAuthenticated]);

  return (
    <Tab.Navigator
      ref={tabNavigatorRef}
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: false,
        lazy: true,
        tabBarHideOnKeyboard: true,
        unmountOnBlur: false,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} iconName="home" />
          ),
        }}
      />
      
      <Tab.Screen
        name="UsadaScreen"
        component={UsadaStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} iconName="book" />
          ),
          tabBarOnPress: ({ navigation }) => {
            navigation.navigate('UsadaScreen', {
              screen: 'UsadaMain',
              params: {
                resetFilter: true,
                fromTabNavigation: true,
                timestamp: Date.now()
              }
            });
          },
        }}
      />
      
      <Tab.Screen
        name="ProductScreen"
        component={ProductStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} iconName="leaf" />
          ),
        }}
      />
      
      <Tab.Screen
        name="CartStack"
        component={CartStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} iconName="cart" />
          ),
        }}
      />
      
      {/* 🔥 ALTERNATIVE: Use ProfileStackNavigator for better auth flow */}
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} iconName="person" />
          ),
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            console.log('👆 Profile tab pressed - Using ProfileStackNavigator');
            defaultHandler();
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
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

export default MainTabNavigator;