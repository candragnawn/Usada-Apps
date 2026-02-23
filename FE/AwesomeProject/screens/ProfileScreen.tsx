// ProfileScreen.js - FIXED: Quick Logout & White Screen Issue
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  ImageBackground,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import withProviders from '@/utils/withProviders';

const { width } = Dimensions.get('window');

// --- Loading Component ---
const LoadingScreen = React.memo(({ message }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4F7942" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  </SafeAreaView>
));

// --- Profile Content Component ---
const ProfileScreenContent = React.memo(() => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = useCallback(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Rahajeng Semeng';
    if (hour < 17) return 'Rahajeng Siang';
    return 'Rahajeng Wengi';
  }, [currentTime]);

  const quickActions = [
    { id: 'orders', title: 'My Orders', icon: 'book', color: '#FF6B6B', screen: 'Orders', count: 3 },
    { id: 'cart', title: 'Shopping Cart', icon: 'shopping-cart', color: '#4ECDC4', screen: 'CartMain', count: 5 },
    { id: 'favorites', title: 'Wishlist', icon: 'heart', color: '#45B7D1', screen: 'Wishlist', count: 8 },
    { id: 'notifications', title: 'Notifications', icon: 'bell', color: '#F7931E', screen: 'Notifications', count: 2 },
  ];

  const recentActivities = [
    { id: '1', title: 'Order Delivered', description: 'Your order #12345 has been delivered successfully', time: '2 hours ago', icon: 'check-circle', type: 'order' },
    { id: '2', title: 'Review Submitted', description: 'Thank you for reviewing "Organic Green Tea"', time: '1 day ago', icon: 'star', type: 'review' },
    { id: '3', title: 'Points Earned', description: 'You earned 50 points from your recent purchase', time: '2 days ago', icon: 'gift', type: 'reward' },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleQuickActionPress = useCallback((action) => {
    console.log('🔗 Quick Action Pressed:', action.title);
    
    if (action.screen) {
      try {
        navigation.navigate(action.screen);
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert('Navigation Error', `Cannot navigate to ${action.title}`);
      }
    } else if (action.action) {
      action.action();
    }
  }, [navigation]);

  const handleQuickLogout = useCallback(async () => {
    console.log('🚪 QUICK LOGOUT: Starting logout process');
    
    try {
      await logout();
      console.log(' QUICK LOGOUT: Logout completed successfully');
      
    } catch (error) {
      console.error(' QUICK LOGOUT ERROR:', error);
      Alert.alert('Quick Logout Failed', 'Failed to logout. Please try again.');
    }
  }, [logout]);

  const handleSettings = useCallback(() => {
    try {
      navigation.navigate('Settings');
    } catch (error) {
      console.error('Settings navigation error:', error);
    }
  }, [navigation]);

  const renderQuickAction = useCallback((item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.quickActionItem}
      onPress={() => handleQuickActionPress(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
        <Feather name={item.icon} size={24} color="white" />
        {item.count && item.count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.count}</Text>
          </View>
        )}
      </View>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
    </TouchableOpacity>
  ), [handleQuickActionPress]);

  const renderActivityItem = useCallback((item) => (
    <View key={item.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: getActivityColor(item.type) }]}>
        <Feather name={item.icon} size={16} color="white" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  ), []);

  const getActivityColor = useCallback((type) => {
    switch (type) {
      case 'order': return '#4F7942';
      case 'review': return '#F7931E';
      case 'reward': return '#E91E63';
      case 'notification': return '#2196F3';
      default: return '#86A789';
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />
      
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSettings}
            >
              <Feather name="settings" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                try {
                  navigation.navigate('Notifications');
                } catch (error) {
                  console.error('Notifications navigation error:', error);
                }
              }}
            >
              <Feather name="bell" size={20} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
            style={styles.statsCard}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1,250</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Gold</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <Text style={styles.placeholderText}>
                    {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                  </Text>
                </View>
              )}
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{user?.name || 'User Name'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@email.com'}</Text>
              <View style={styles.membershipBadge}>
                <Feather name="award" size={12} color="#4F7942" />
                <Text style={styles.membershipText}>Premium Member</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity onPress={() => {
              try {
                navigation.navigate('ActivityHistory');
              } catch (error) {
                console.error('ActivityHistory navigation error:', error);
              }
            }}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesContainer}>
            {recentActivities.map(renderActivityItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                try {
                  navigation.navigate('Addresses');
                } catch (error) {
                  console.error('Addresses navigation error:', error);
                }
              }}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="location-outline" size={20} color="#4F7942" />
              </View>
              <Text style={styles.menuText}>Shipping Addresses</Text>
              <Feather name="chevron-right" size={16} color="#86A789" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                try {
                  navigation.navigate('PaymentMethods');
                } catch (error) {
                  console.error('PaymentMethods navigation error:', error);
                }
              }}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="card-outline" size={20} color="#4F7942" />
              </View>
              <Text style={styles.menuText}>Payment Methods</Text>
              <Feather name="chevron-right" size={16} color="#86A789" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                try {
                  navigation.navigate('HelpCenter');
                } catch (error) {
                  console.error('HelpCenter navigation error:', error);
                }
              }}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle-outline" size={20} color="#4F7942" />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
              <Feather name="chevron-right" size={16} color="#86A789" />
            </TouchableOpacity>

            {/* 🔥 SIMPLIFIED: Quick Logout Button */}
            <TouchableOpacity 
              style={[
                styles.menuItem, 
                styles.quickLogoutItem,
                { borderBottomWidth: 0 }
              ]}
              onPress={handleQuickLogout}
            >
              <View style={[styles.menuIcon, styles.quickLogoutIcon]}>
                <Ionicons name="exit-outline" size={20} color="#FF8C00" />
              </View>
              <Text style={[styles.menuText, styles.quickLogoutText]}>
                Quick Logout
              </Text>
              <Feather name="chevron-right" size={16} color="#FF8C00" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

// --- Main ProfileScreen Component ---
const ProfileScreen = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // 🔥 ENHANCED: Better auth state monitoring
  useFocusEffect(
    React.useCallback(() => {
      console.log('ProfileScreen Focus:', {
        isAuthenticated,
        hasUser: !!user,
        isLoading,
        userEmail: user?.email || 'none'
      });
    }, [isAuthenticated, user, isLoading])
  );

  // 🔥 CRITICAL: Show loading state while checking auth
  if (isLoading) {
    console.log('ProfileScreen: Showing loading state');
    return <LoadingScreen message="Loading profile..." />;
  }

  // 🔥 CRITICAL: Return null immediately if not authenticated
  // ProfileStackNavigator will handle the routing
  if (!isAuthenticated || !user) {
    console.log('ProfileScreen: Not authenticated, returning null - Stack will handle routing');
    return null;
  }

  console.log('ProfileScreen: User authenticated, rendering content');
  return <ProfileScreenContent />;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4F7942',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  statsContainer: {
    marginTop: 10,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  placeholderAvatar: {
    backgroundColor: '#4F7942',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileDetails: {
    paddingTop:8,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#86A789',
    marginBottom: 6,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 121, 66, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4F7942',
    marginLeft: 4,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F7942',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickActionItem: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  activitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#86A789',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: '#B0B0B0',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 121, 66, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  quickLogoutItem: {
    borderBottomWidth: 0, // Last item
  },
  quickLogoutIcon: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
  },
  quickLogoutText: {
    color: '#FF8C00',
    fontWeight: '600',
  },
  disabledMenuItem: {
    opacity: 0.6,
  },
});

export default withProviders(ProfileScreen);