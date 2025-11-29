import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { getOrdersByCustomer } from '../Helper/firebaseHelper';

const MyOrders = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user?.uid) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const customerOrders = await getOrdersByCustomer(user.uid);
      
      // Sort by date (newest first)
      customerOrders.sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));
      
      setOrders(customerOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status?.toLowerCase() === activeTab.toLowerCase());
  };

  const getTabCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status?.toLowerCase() === status.toLowerCase()).length;
  };

  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || 'unknown';
    
    const configs = {
      pending: {
        color: '#FFA500',
        bgColor: '#FFF4E5',
        icon: 'time-outline',
        text: 'PENDING',
        description: 'Waiting for seller approval'
      },
      approved: {
        color: '#2196F3',
        bgColor: '#E3F2FD',
        icon: 'checkmark-circle-outline',
        text: 'APPROVED',
        description: 'Order confirmed by seller'
      },
      shipped: {
        color: '#9C27B0',
        bgColor: '#F3E5F5',
        icon: 'airplane-outline',
        text: 'SHIPPED',
        description: 'On the way'
      },
      delivered: {
        color: '#4CAF50',
        bgColor: '#E8F5E9',
        icon: 'checkmark-done-circle-outline',
        text: 'DELIVERED',
        description: 'Order completed'
      },
      cancelled: {
        color: '#F44336',
        bgColor: '#FFEBEE',
        icon: 'close-circle-outline',
        text: 'CANCELLED',
        description: 'Order cancelled'
      },
      rejected: {
        color: '#F44336',
        bgColor: '#FFEBEE',
        icon: 'close-circle-outline',
        text: 'REJECTED',
        description: 'Not approved by seller'
      }
    };

    return configs[statusLower] || configs.pending;
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const handleReviewPress = (order) => {
    if (order.status?.toLowerCase() === 'delivered') {
      navigation.navigate('CReview', {
        productId: order.productId,
        productName: order.productName,
        productImage: order.productImage,
        orderId: order.id
      });
    }
  };

  const renderTabButton = (tabKey, label) => {
    const isActive = activeTab === tabKey;
    const count = getTabCount(tabKey);

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tabKey)}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 25,
          backgroundColor: isActive ? '#8E6652' : '#F0F0F0',
          marginRight: 12,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text 
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: isActive ? '#FFF' : '#666',
            textAlign: 'center'
          }}
          numberOfLines={1}
        >
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOrderCard = (order) => {
    const statusConfig = getStatusConfig(order.status);

    return (
      <TouchableOpacity
        key={order.id}
        onPress={() => handleOrderPress(order)}
        activeOpacity={0.7}
        style={{
          backgroundColor: '#FFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {/* Order Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
              Order #{order.id.substring(0, 8).toUpperCase()}
            </Text>
            <Text style={{ fontSize: 11, color: '#BBB' }}>
              {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Text>
          </View>
          <View style={{
            backgroundColor: statusConfig.bgColor,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: statusConfig.color,
              marginLeft: 4
            }}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {order.productImage && (
            <Image
              source={{ uri: order.productImage }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 8,
                marginRight: 12,
                backgroundColor: '#F0F0F0'
              }}
            />
          )}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 }} numberOfLines={2}>
              {order.productName || 'Product'}
            </Text>
            {order.size && (
              <Text style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
                Size: {order.size}
              </Text>
            )}
            <Text style={{ fontSize: 12, color: '#666' }}>
              Qty: {order.quantity || 1}
            </Text>
          </View>
        </View>

        {/* Price and Actions */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingTop: 12
        }}>
          <View>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>Total Amount</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8E6652' }}>
              Rs {(order.totalAmount || 0).toLocaleString()}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            {order.status?.toLowerCase() === 'delivered' && (
              <TouchableOpacity
                onPress={() => handleReviewPress(order)}
                style={{
                  backgroundColor: '#8E6652',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <MaterialIcons name="rate-review" size={16} color="#FFF" />
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                  Review
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleOrderPress(order)}
              style={{
                backgroundColor: '#F0F0F0',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Ionicons name="eye-outline" size={16} color="#666" />
              <Text style={{ color: '#666', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 10, color: '#666', fontSize: 14 }}>Loading your orders...</Text>
      </View>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#8E6652',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
      }}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('BottomTab');
            }
          }}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#FFF',
          marginTop: 10
        }}>
          My Orders
        </Text>
      </View>

      {/* Tabs */}
      <View style={{ backgroundColor: '#FFF', paddingVertical: 12, elevation: 2 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            alignItems: 'center'
          }}
        >
          {renderTabButton('all', 'All')}
          {renderTabButton('pending', 'Pending')}
          {renderTabButton('approved', 'Approved')}
          {renderTabButton('delivered', 'Delivered')}
          {renderTabButton('cancelled', 'Cancelled')}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#8E6652']} />
        }
      >
        {filteredOrders.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="cart-outline" size={80} color="#CCC" />
            <Text style={{ fontSize: 18, color: '#999', marginTop: 16, fontWeight: '600' }}>
              No Orders Found
            </Text>
            <Text style={{ fontSize: 14, color: '#BBB', marginTop: 8, textAlign: 'center' }}>
              {activeTab === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${activeTab} orders`}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home2')}
              style={{
                backgroundColor: '#8E6652',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 10,
                marginTop: 20
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
              Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
            </Text>
            {filteredOrders.map(renderOrderCard)}
            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MyOrders;
