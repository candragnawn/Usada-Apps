// OrdersScreen.js - Complete orders history screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  RefreshControl,
  Alert,
  ImageBackground,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useOrder } from '@/context/OrderContext'; // Make sure this path is correct
import { useFocusEffect } from '@react-navigation/native';
import withProviders from '@/utils/withProviders';

const OrdersScreen = ({ navigation }) => {
  const { 
    orders, 
    loading, 
    error, 
    fetchOrders, 
    clearError,
    refreshOrders 
  } = useOrder();

  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
    } catch (err) {
      console.error('Error refreshing orders:', err);
    } finally {
      setRefreshing(false);
    }
  }, [refreshOrders]);

  // Show error alert when error occurs
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  // Format price with IDR currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          color: '#FF9800',
          backgroundColor: '#FFF3E0',
          icon: 'clock',
          text: 'Pending'
        };
      case 'processing':
        return {
          color: '#2196F3',
          backgroundColor: '#E3F2FD',
          icon: 'package',
          text: 'Processing'
        };
      case 'shipped':
        return {
          color: '#9C27B0',
          backgroundColor: '#F3E5F5',
          icon: 'truck',
          text: 'Shipped'
        };
      case 'delivered':
        return {
          color: '#4CAF50',
          backgroundColor: '#E8F5E8',
          icon: 'check-circle',
          text: 'Delivered'
        };
      case 'cancelled':
        return {
          color: '#F44336',
          backgroundColor: '#FFEBEE',
          icon: 'x-circle',
          text: 'Cancelled'
        };
      default:
        return {
          color: '#757575',
          backgroundColor: '#F5F5F5',
          icon: 'help-circle',
          text: status || 'Unknown'
        };
    }
  };

  // Render individual order item
  const renderOrderItem = ({ item: order }) => {
    const statusInfo = getStatusInfo(order.status);
    const itemCount = order.order_items?.length || 0;
    const totalItems = order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => handleOrderPress(order)}
        activeOpacity={0.7}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order</Text>
            <Text style={styles.orderIdValue}>#{order.id}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
            <Feather name={statusInfo.icon} size={12} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <View style={styles.orderDetailRow}>
            <Feather name="calendar" size={16} color="#86A789" />
            <Text style={styles.orderDetailText}>
              {formatDate(order.created_at)}
            </Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Feather name="shopping-bag" size={16} color="#86A789" />
            <Text style={styles.orderDetailText}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} • {itemCount} {itemCount === 1 ? 'product' : 'products'}
            </Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Feather name="credit-card" size={16} color="#86A789" />
            <Text style={styles.orderDetailText}>
              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
            </Text>
          </View>

          <View style={styles.orderDetailRow}>
            <Feather name="map-pin" size={16} color="#86A789" />
            <Text style={styles.orderDetailText} numberOfLines={1}>
              {order.shipping_address}
            </Text>
          </View>
        </View>

        {/* Order Footer */}
        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total_amount)}</Text>
          </View>
          
          <View style={styles.orderActions}>
            <Feather name="chevron-right" size={20} color="#4F7942" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Handle order press (navigate to order details)
  const handleOrderPress = (order) => {
    // You can navigate to order details screen here
    // navigation.navigate('OrderDetailsScreen', { orderId: order.id });
    
    // For now, show order details in an alert
    const itemsList = order.order_items?.map(item => 
      `• ${item.product_name} (${item.quantity}x) - ${formatPrice(item.total)}`
    ).join('\n') || '';

    Alert.alert(
      `Order #${order.id}`,
      `Status: ${order.status}\nTotal: ${formatPrice(order.total_amount)}\nPayment: ${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}\nDate: ${formatDate(order.created_at)}\n\nItems:\n${itemsList}`,
      [
        { text: 'OK' }
      ]
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Feather name="shopping-bag" size={60} color="#C8E6C9" />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start shopping to see your orders here
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.shopNowButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading state
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Feather name="loader" size={24} color="#4F7942" />
      <Text style={styles.loadingText}>Loading orders...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4F7942"
      />

      {/* Header with Batik Background */}
      <ImageBackground 
        source={require('@/assets/images/batik.png')} 
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>
            {orders.length > 0 
              ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`
              : 'Order history'
            }
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={loading}
        >
          <Feather name="refresh-cw" size={20} color="white" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        renderLoadingState()
      ) : orders.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#4F7942']}
              tintColor="#4F7942"
            />
          }
        >
          {renderEmptyState()}
        </ScrollView>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#4F7942']}
              tintColor="#4F7942"
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#86A789',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5233',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#86A789',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  shopNowButton: {
    backgroundColor: '#4F7942',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4F7942',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 14,
    color: '#86A789',
    marginRight: 5,
  },
  orderIdValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5233',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDetailText: {
    fontSize: 14,
    color: '#86A789',
    marginLeft: 8,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F8F0',
    paddingTop: 12,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#86A789',
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7942',
  },
  orderActions: {
    paddingLeft: 10,
  },
});

export default withProviders(OrdersScreen);