import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getOrdersByCustomer } from '../Helper/firebaseHelper';

const CPending = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.home.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const customerOrders = await getOrdersByCustomer(user.uid);
      setOrders(customerOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  const getTabCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const handleReviewProduct = (order) => {
    if (order.status === 'delivered') {
      navigation.navigate('CReview', {
        productId: order.productId,
        productName: order.productName,
        productImage: order.productImage
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'approved': return '#28A745';
      case 'rejected': return '#DC3545';
      case 'delivered': return '#28A745';
      case 'cancelled': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'PENDING';
      case 'approved': return 'APPROVED';
      case 'rejected': return 'REJECTED';
      case 'delivered': return 'DELIVERED';
      case 'cancelled': return 'CANCELLED';
      default: return status.toUpperCase();
    }
  };

  const renderOrderCard = (order) => (
    <View key={order.id} style={{
      borderRadius: 10,
      padding: 15,
      marginTop: 20,
      width: "90%",
      backgroundColor: '#F3D5C6',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2
    }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
        Order #{order.id?.substring(0, 8) || 'N/A'}
      </Text>
      <Text style={{ marginBottom: 4 }}>Product: {order.productName || 'Unknown Product'}</Text>
      <Text style={{ marginBottom: 4 }}>Quantity: {order.quantity || 1}</Text>
      <Text style={{ marginBottom: 4 }}>Size: {order.size || 'N/A'}</Text>
      <Text style={{ marginBottom: 8 }}>Total: ${order.totalAmount || '0.00'}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{
          color: getStatusColor(order.status),
          fontWeight: 'bold',
          marginRight: 10
        }}>
          {getStatusText(order.status)}
        </Text>
        <Text style={{ fontSize: 12, color: '#666' }}>
          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
        </Text>
      </View>

      <TouchableOpacity style={{
        backgroundColor: "#f5f5f5",
        padding: 8,
        borderRadius: 6,
        marginBottom: 8
      }}>
        <Text style={{ textAlign: 'center', color: '#666' }}>View Details</Text>
      </TouchableOpacity>

      {order.status === 'delivered' && (
        <TouchableOpacity
          style={{
            backgroundColor: "#8E6652",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 15,
            alignSelf: 'flex-start'
          }}
          onPress={() => handleReviewProduct(order)}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Review Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 10, color: '#8E6652' }}>Loading orders...</Text>
      </View>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      {/* Professional Header */}
      <View style={{
        backgroundColor: '#8E6652',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 20
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
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          marginTop: 10
        }}>
          My Orders
        </Text>
      </View>

      <View style={{ marginBottom: 15, alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>

        {/* Order Status Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 20,
            gap: 15,
            marginBottom: 25
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            style={{
              backgroundColor: activeTab === 'all' ? "rgba(164, 123, 104, 1)" : '#f7f1eeff',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              minWidth: 80,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: "500",
              color: activeTab === 'all' ? "white" : "black"
            }}>
              All ({getTabCount('all')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('pending')}
            style={{
              backgroundColor: activeTab === 'pending' ? "rgba(164, 123, 104, 1)" : '#f7f1eeff',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              minWidth: 90,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: "500",
              color: activeTab === 'pending' ? "white" : "black"
            }}>
              Pending ({getTabCount('pending')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('approved')}
            style={{
              backgroundColor: activeTab === 'approved' ? "rgba(164, 123, 104, 1)" : '#f7f1eeff',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              minWidth: 95,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: "500",
              color: activeTab === 'approved' ? "white" : "black"
            }}>
              Approved ({getTabCount('approved')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Delivered')}
            style={{
              backgroundColor: getTabCount('delivered') > 0 ? "rgba(164, 123, 104, 1)" : '#f7f1eeff',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              minWidth: 95,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: "500",
              color: getTabCount('delivered') > 0 ? "white" : "black"
            }}>
              Delivered ({getTabCount('delivered')})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Cancel')}
            style={{
              backgroundColor: (getTabCount('cancelled') + getTabCount('rejected')) > 0 ? "rgba(164, 123, 104, 1)" : '#f7f1eeff',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              minWidth: 100,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: "500",
              color: (getTabCount('cancelled') + getTabCount('rejected')) > 0 ? "white" : "black"
            }}>
              Cancelled ({getTabCount('cancelled') + getTabCount('rejected')})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Orders List */}
        {orders.length === 0 ? (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            marginTop: 30
          }}>
            <Ionicons name="receipt-outline" size={64} color="#8E6652" />
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#8E6652',
              marginTop: 20,
              textAlign: 'center'
            }}>
              No Orders Yet
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
              marginTop: 10
            }}>
              Start shopping to see your orders here!
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 10 }}>
            {/* Filtered Orders */}
            {filteredOrders.length === 0 ? (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
                marginTop: 20
              }}>
                <Text style={{
                  fontSize: 16,
                  color: '#666',
                  textAlign: 'center'
                }}>
                  No orders with current status
                </Text>
              </View>
            ) : (
              filteredOrders.map(renderOrderCard)
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CPending;
