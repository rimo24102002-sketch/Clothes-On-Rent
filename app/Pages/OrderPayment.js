import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, SafeAreaView, RefreshControl, ActivityIndicator, TextInput, Alert, Image, Modal } from "react-native";
import { useSelector } from "react-redux";
import { listOrdersBySeller, updateOrder, getAllData } from "../Helper/firebaseHelper";
import { Feather, Ionicons } from "@expo/vector-icons";
import StandardHeader from '../Components/StandardHeader';

export default function SellerOrders({ navigation }) {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || "";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [riders, setRiders] = useState([]);
  const [riderModalVisible, setRiderModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loadingRiders, setLoadingRiders] = useState(false);

  useEffect(() => {
    loadOrders();
    loadRiders();
  }, [sellerId]);

  const loadRiders = async () => {
    try {
      setLoadingRiders(true);
      if (!sellerId) {
        setRiders([]);
        return;
      }
      const allRiders = await getAllData('riders');
      // Filter riders by sellerId and only active riders
      const filteredRiders = allRiders.filter(rider => 
        rider.sellerId === sellerId && rider.status === 'active'
      );
      setRiders(filteredRiders);
    } catch (error) {
      console.error('Error loading riders:', error);
    } finally {
      setLoadingRiders(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      if (!sellerId) {
        setOrders([]);
        setLoading(false);
        return;
      }
      console.log('Loading orders for sellerId:', sellerId);
      const list = await listOrdersBySeller(sellerId);
      console.log('Fetched orders:', list.length);
      // Sort by date descending (newest first)
      const sortedOrders = list.sort((a, b) => {
        // Get timestamp value - prioritize orderDate, then createdAt, then updatedAt
        const getTimestamp = (order) => {
          if (order.orderDate) {
            return new Date(order.orderDate).getTime();
          }
          if (order.createdAt) {
            return typeof order.createdAt === 'number' ? order.createdAt : new Date(order.createdAt).getTime();
          }
          if (order.updatedAt) {
            return typeof order.updatedAt === 'number' ? order.updatedAt : new Date(order.updatedAt).getTime();
          }
          return 0;
        };
        const dateA = getTimestamp(a);
        const dateB = getTimestamp(b);
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
    loadRiders();
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'pending': return { bg: '#FAD7A0', text: '#7e5005ff' };
      case 'processing': return { bg: '#D6EAF8', text: '#1B4F72' };
      case 'approved': return { bg: '#D5F4E6', text: '#0E6655' };
      case 'delivered': return { bg: '#ABEBC6', text: '#07863cff' };
      case 'cancelled':
      case 'canceled': return { bg: '#F5B7B1', text: '#a7190aff' };
      case 'rejected': return { bg: '#FADBD8', text: '#C0392B' };
      default: return { bg: '#D7DBDD', text: '#566573' };
    }
  };

  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter((o) => {
        const orderStatus = o.status?.toLowerCase() || '';
        const filterStatus = filter.toLowerCase();
        return orderStatus === filterStatus || 
               (filterStatus === 'pending' && orderStatus === 'processing');
      });

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { 
        status: newStatus,
        updatedAt: Date.now()
      });
      Alert.alert('Success', `Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Error', 'Failed to update order status. Please try again.');
    }
  };

  const handleAssignRider = (orderId) => {
    setSelectedOrderId(orderId);
    setRiderModalVisible(true);
  };

  const handleSelectRider = async (rider) => {
    try {
      if (!selectedOrderId) return;
      
      await updateOrder(selectedOrderId, {
        riderId: rider.id,
        riderName: rider.name,
        riderPhone: rider.phone,
        riderAssignedAt: Date.now(),
        updatedAt: Date.now()
      });
      
      Alert.alert('Success', `Rider ${rider.name} assigned to order successfully!`);
      setRiderModalVisible(false);
      setSelectedOrderId(null);
      loadOrders();
    } catch (error) {
      console.error('Error assigning rider:', error);
      Alert.alert('Error', 'Failed to assign rider. Please try again.');
    }
  };

  const renderOrder = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    
    // Format date - handle both timestamp numbers and ISO date strings
    let orderDate = 'N/A';
    if (item.orderDate) {
      orderDate = new Date(item.orderDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (item.createdAt) {
      // Handle timestamp number (milliseconds) or ISO string
      const dateValue = typeof item.createdAt === 'number' 
        ? new Date(item.createdAt) 
        : new Date(item.createdAt);
      orderDate = dateValue.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          // Only allow opening rider modal if order is not delivered/cancelled
          if (item.status?.toLowerCase() !== 'delivered' && 
              item.status?.toLowerCase() !== 'cancelled' && 
              item.status?.toLowerCase() !== 'canceled') {
            handleAssignRider(item.id);
          }
        }}
        disabled={item.status?.toLowerCase() === 'delivered' || 
                 item.status?.toLowerCase() === 'cancelled' || 
                 item.status?.toLowerCase() === 'canceled'}
        style={{ 
          backgroundColor: '#fff', 
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 12,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        }}
      >
        {/* Order Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
              Order #{item.id?.substring(0, 8).toUpperCase() || 'N/A'}
            </Text>
            <Text style={{ fontSize: 11, color: '#BBB' }}>
              {orderDate}
            </Text>
          </View>
          <View style={{
            backgroundColor: statusColors.bg,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12
          }}>
            <Text style={{ 
              fontSize: 11, 
              fontWeight: '700', 
              color: statusColors.text,
              textTransform: 'uppercase'
            }}>
              {item.status || 'Pending'}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={{ marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="person-outline" size={16} color="#8E6652" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginLeft: 8 }}>
              {item.customerName || item.customerEmail || 'Customer'}
            </Text>
          </View>
          {item.customerPhone && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name="call-outline" size={16} color="#8E6652" />
              <Text style={{ fontSize: 13, color: '#666', marginLeft: 8 }}>
                {item.customerPhone}
              </Text>
            </View>
          )}
          {item.shippingInfo && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
              <Ionicons name="location-outline" size={16} color="#8E6652" style={{ marginTop: 2 }} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={{ fontSize: 13, color: '#666', lineHeight: 18 }}>
                  {item.shippingInfo.fullName || ''}
                  {item.shippingInfo.streetAddress && `\n${item.shippingInfo.streetAddress}`}
                  {item.shippingInfo.city && `, ${item.shippingInfo.city}`}
                  {item.shippingInfo.stateProvince && `, ${item.shippingInfo.stateProvince}`}
                </Text>
                {item.shippingInfo.shippingMethod && (
                  <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    Shipping: {item.shippingInfo.shippingMethod === 'home' ? 'Home Delivery' : 'Store Pickup'}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Order Items */}
        {item.items && item.items.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              Items ({item.items.length})
            </Text>
            {item.items.map((orderItem, index) => (
              <View key={index} style={{ 
                flexDirection: 'row', 
                marginBottom: 8,
                paddingBottom: 8,
                borderBottomWidth: index < item.items.length - 1 ? 1 : 0,
                borderBottomColor: '#F0F0F0'
              }}>
                {orderItem.imageUrl && (
                  <Image 
                    source={{ uri: orderItem.imageUrl }} 
                    style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
                    resizeMode="cover"
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                    {orderItem.name || 'Product'}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
                    {orderItem.size && (
                      <Text style={{ fontSize: 12, color: '#666', marginRight: 8 }}>
                        Size: {orderItem.size}
                      </Text>
                    )}
                    {orderItem.quantity && (
                      <Text style={{ fontSize: 12, color: '#666', marginRight: 8 }}>
                        Qty: {orderItem.quantity}
                      </Text>
                    )}
                    {orderItem.categoryName && (
                      <Text style={{ fontSize: 12, color: '#8E6652' }}>
                        {orderItem.categoryName}
                      </Text>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 13, color: '#666' }}>
                      Price: Rs {orderItem.price?.toLocaleString() || '0'}
                    </Text>
                    {orderItem.securityFee > 0 && (
                      <Text style={{ fontSize: 12, color: '#999' }}>
                        Security: Rs {orderItem.securityFee?.toLocaleString() || '0'}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Payment Info */}
        {item.paymentInfo && (
          <View style={{ marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="card-outline" size={16} color="#8E6652" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginLeft: 8 }}>
                Payment: {item.paymentInfo.method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
              </Text>
            </View>
            {item.paymentInfo.method === 'bank' && item.paymentInfo.bankTransfer && (
              <View style={{ marginLeft: 24, marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  Bank: {item.paymentInfo.bankTransfer.bankName || 'N/A'}
                </Text>
                {item.paymentInfo.bankTransfer.transactionScreenshot && (
                  <Text style={{ fontSize: 11, color: '#4CAF50', marginTop: 2 }}>
                    ✓ Receipt uploaded
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Order Totals */}
        {item.totals && (
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: '#F8F9FA', borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 13, color: '#666' }}>Subtotal:</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#333' }}>
                Rs {item.totals.subtotal?.toLocaleString() || '0'}
              </Text>
            </View>
            {item.totals.securityFees > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 13, color: '#666' }}>Security Fees:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#333' }}>
                  Rs {item.totals.securityFees?.toLocaleString() || '0'}
                </Text>
              </View>
            )}
            {item.totals.shippingCost > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 13, color: '#666' }}>Shipping:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#333' }}>
                  Rs {item.totals.shippingCost?.toLocaleString() || '0'}
                </Text>
      </View>
            )}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginTop: 8,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0'
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#8E6652' }}>Total:</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#8E6652' }}>
                Rs {item.totals.total?.toLocaleString() || '0'}
              </Text>
            </View>
          </View>
        )}

        {/* Assigned Rider Info */}
        {item.riderId && (
          <View style={{ 
            marginBottom: 12, 
            padding: 12, 
            backgroundColor: '#E8F5E9', 
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: '#4CAF50'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="bicycle-outline" size={16} color="#4CAF50" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#2E7D32', marginLeft: 8 }}>
                Assigned Rider
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: '#333', marginLeft: 24 }}>
              {item.riderName || 'Rider'}
            </Text>
            {item.riderPhone && (
              <Text style={{ fontSize: 12, color: '#666', marginLeft: 24, marginTop: 2 }}>
                Phone: {item.riderPhone}
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {item.status?.toLowerCase() !== 'delivered' && item.status?.toLowerCase() !== 'cancelled' && item.status?.toLowerCase() !== 'canceled' && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {item.status?.toLowerCase() === 'pending' || item.status?.toLowerCase() === 'processing' ? (
              <>
                <TouchableOpacity 
                  style={{ 
                    flex: 1,
                    backgroundColor: '#4CAF50', 
                    paddingVertical: 10, 
                    borderRadius: 8,
                    alignItems: 'center'
                  }} 
                  onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert(
                      'Approve Order',
                      'Are you sure you want to approve this order?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Approve', 
                          onPress: () => handleUpdateStatus(item.id, 'approved')
                        }
                      ]
                    );
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ 
                    flex: 1,
                    backgroundColor: '#dc3545', 
                    paddingVertical: 10, 
                    borderRadius: 8,
                    alignItems: 'center'
                  }} 
                  onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert(
                      'Reject Order',
                      'Are you sure you want to reject this order?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Reject', 
                          style: 'destructive',
                          onPress: () => handleUpdateStatus(item.id, 'rejected')
                        }
                      ]
                    );
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Reject</Text>
                </TouchableOpacity>
              </>
            ) : item.status?.toLowerCase() === 'approved' ? (
              <TouchableOpacity 
                style={{ 
                  flex: 1,
                  backgroundColor: '#8E6652', 
                  paddingVertical: 10, 
                  borderRadius: 8,
                  alignItems: 'center'
                }} 
                onPress={(e) => {
                  e.stopPropagation();
                  Alert.alert(
                    'Mark as Delivered',
                    'Are you sure this order has been delivered?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Mark Delivered', 
                        onPress: () => handleUpdateStatus(item.id, 'delivered')
                      }
                    ]
                  );
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Mark Delivered</Text>
        </TouchableOpacity>
            ) : null}
            {/* Assign Rider Button */}
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#2196F3', 
                paddingVertical: 10, 
                paddingHorizontal: 16,
                borderRadius: 8,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 6
              }} 
              onPress={(e) => {
                e.stopPropagation();
                handleAssignRider(item.id);
              }}
            >
              <Ionicons name="bicycle-outline" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                {item.riderId ? 'Change Rider' : 'Assign Rider'}
              </Text>
            </TouchableOpacity>
            
            {item.status?.toLowerCase() !== 'cancelled' && item.status?.toLowerCase() !== 'canceled' && (
              <TouchableOpacity 
                style={{ 
                  backgroundColor: '#ccc', 
                  paddingVertical: 10, 
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  alignItems: 'center'
                }} 
                onPress={(e) => {
                  e.stopPropagation();
                  Alert.alert(
                    'Cancel Order',
                    'Are you sure you want to cancel this order?',
                    [
                      { text: 'No', style: 'cancel' },
                      { 
                        text: 'Yes, Cancel', 
                        style: 'destructive',
                        onPress: () => handleUpdateStatus(item.id, 'cancelled')
                      }
                    ]
                  );
                }}
              >
                <Text style={{ color: '#333', fontWeight: '700', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
        <StandardHeader navigation={navigation} title="My Orders" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{ marginTop: 12, color: '#666', fontSize: 14 }}>Loading orders...</Text>
    </View>
      </SafeAreaView>
  );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      <StandardHeader navigation={navigation} title="My Orders" />
      <View style={{ flex: 1, padding: 16 }}>
        {/* Filter Buttons */}
        <View style={{ height: 50, marginBottom: 16 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ 
              paddingRight: 8,
              alignItems: 'center',
              height: 50
            }}
          >
            {["All", "Pending", "Processing", "Approved", "Delivered", "Cancelled"].map((status) => (
              <TouchableOpacity 
                key={status} 
                onPress={() => setFilter(status)} 
                style={{ 
                  backgroundColor: filter === status ? "#8E6652" : "#fff", 
                  paddingVertical: 8, 
                  paddingHorizontal: 16, 
                  borderRadius: 20, 
                  marginRight: 8,
                  borderWidth: filter === status ? 0 : 1,
                  borderColor: '#E0E0E0',
                  elevation: filter === status ? 2 : 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: filter === status ? 0.2 : 0,
                  shadowRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  color: filter === status ? "#fff" : "#8E6652", 
                  fontWeight: "600", 
                  fontSize: 13 
                }}>
                  {status}
                </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
        </View>

        {/* Orders List */}
        <FlatList 
          data={filteredOrders} 
          renderItem={renderOrder} 
          keyExtractor={(item) => item.id || Math.random().toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8E6652']}
              tintColor="#8E6652"
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
              <Feather name="package" size={64} color="#CCC" />
              <Text style={{ 
                textAlign: "center", 
                marginTop: 16, 
                fontSize: 16, 
                color: '#999',
                fontWeight: '500'
              }}>
                {filter === 'All' ? 'No orders found' : `No ${filter.toLowerCase()} orders`}
              </Text>
              <Text style={{ 
                textAlign: "center", 
                marginTop: 8, 
                fontSize: 13, 
                color: '#BBB'
              }}>
                Pull down to refresh
              </Text>
            </View>
          }
          contentContainerStyle={{ 
            paddingBottom: 20,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Rider Selection Modal */}
      <Modal
        visible={riderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setRiderModalVisible(false);
          setSelectedOrderId(null);
        }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80%',
            paddingTop: 20
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#E0E0E0'
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#8E6652'
              }}>
                Select Rider
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setRiderModalVisible(false);
                  setSelectedOrderId(null);
                }}
              >
                <Ionicons name="close-circle" size={28} color="#8E6652" />
              </TouchableOpacity>
            </View>

            {loadingRiders ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text style={{ marginTop: 12, color: '#666' }}>Loading riders...</Text>
              </View>
            ) : riders.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Ionicons name="bicycle-outline" size={64} color="#CCC" />
                <Text style={{ marginTop: 16, fontSize: 16, color: '#999', textAlign: 'center' }}>
                  No riders available
                </Text>
                <Text style={{ marginTop: 8, fontSize: 14, color: '#BBB', textAlign: 'center' }}>
                  Register riders from Rider Management
                </Text>
              </View>
            ) : (
              <FlatList
                data={riders}
                keyExtractor={(item) => item.id || Math.random().toString()}
                renderItem={({ item: rider }) => (
                  <TouchableOpacity
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F0F0F0',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    onPress={() => handleSelectRider(rider)}
                  >
                    <View style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: '#8E6652',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12
                    }}>
                      <Ionicons name="person" size={24} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: 4
                      }}>
                        {rider.name}
                      </Text>
                      {rider.phone && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                          <Ionicons name="call-outline" size={14} color="#666" />
                          <Text style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>
                            {rider.phone}
                          </Text>
                        </View>
                      )}
                      {rider.vehicleType && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons name="bicycle-outline" size={14} color="#666" />
                          <Text style={{ fontSize: 12, color: '#999', marginLeft: 6 }}>
                            {rider.vehicleType}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
