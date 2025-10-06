import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getOrdersForSeller, updateOrderStatus } from "../Helper/firebaseHelper";
import StandardHeader from '../Components/StandardHeader';

export default function OrderApproval({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filters = ['All', 'Pending Approval', 'Approved', 'Rejected'];

  useEffect(() => {
    loadSellerOrders();
  }, []);

  const loadSellerOrders = async () => {
    try {
      if (!sellerId) return;
      
      const sellerOrders = await getOrdersForSeller(sellerId);
      setOrders(sellerOrders);
    } catch (error) {
      console.error("Error loading seller orders:", error);
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    Alert.alert(
      "Approve Order",
      "Are you sure you want to approve this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              await updateOrderStatus(orderId, "confirmed", "Order approved by seller");
              Alert.alert("Success", "Order approved successfully!");
              loadSellerOrders();
            } catch (error) {
              Alert.alert("Error", "Failed to approve order");
            }
          }
        }
      ]
    );
  };

  const handleRejectOrder = (order) => {
    setSelectedOrder(order);
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }

    try {
      await updateOrderStatus(selectedOrder.id, "rejected", rejectionReason.trim());
      Alert.alert("Success", "Order rejected successfully!");
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedOrder(null);
      loadSellerOrders();
    } catch (error) {
      Alert.alert("Error", "Failed to reject order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return '#F39C12';
      case 'confirmed': return '#27AE60';
      case 'rejected': return '#E74C3C';
      case 'preparing': return '#3498DB';
      case 'ready': return '#9B59B6';
      case 'delivered': return '#2ECC71';
      default: return '#95A5A6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_approval': return 'Pending Approval';
      case 'confirmed': return 'Confirmed';
      case 'rejected': return 'Rejected';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'delivered': return 'Delivered';
      default: return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
    }
  };

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(order => {
        if (activeFilter === 'Pending Approval') return order.status === 'pending_approval';
        if (activeFilter === 'Approved') return order.status === 'confirmed';
        if (activeFilter === 'Rejected') return order.status === 'rejected';
        return true;
      });

  const OrderCard = ({ order }) => (
    <View style={{ 
      backgroundColor: '#fff', 
      borderRadius: 12, 
      padding: 16, 
      marginBottom: 16, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#f0f0f0'
    }}>
      {/* Order Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Order #{order.id?.slice(-6) || 'N/A'}</Text>
        <View style={{ 
          backgroundColor: getStatusColor(order.status), 
          paddingHorizontal: 8, 
          paddingVertical: 4, 
          borderRadius: 12 
        }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
            {getStatusText(order.status).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="person-outline" size={16} color="#8E6652" />
          <Text style={{ marginLeft: 6, fontSize: 14, color: '#333', fontWeight: '500' }}>
            {order.customerName || 'Customer'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="calendar-outline" size={16} color="#8E6652" />
          <Text style={{ marginLeft: 6, fontSize: 14, color: '#666' }}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {order.customerPhone && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="call-outline" size={16} color="#8E6652" />
            <Text style={{ marginLeft: 6, fontSize: 14, color: '#666' }}>
              {order.customerPhone}
            </Text>
          </View>
        )}
      </View>

      {/* Order Items */}
      {order.items && order.items.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Size: {item.size} • Qty: {item.quantity}
            </Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#8E6652' }}>
            Rs. {item.price?.toLocaleString()}
          </Text>
        </View>
      ))}

      {/* Total Amount */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12, marginTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Total Amount</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#8E6652' }}>
            Rs. {order.total?.toLocaleString() || '0'}
          </Text>
        </View>
      </View>

      {/* Rejection Reason */}
      {order.status === 'rejected' && order.rejectionReason && (
        <View style={{ backgroundColor: '#ffebee', borderRadius: 8, padding: 12, marginTop: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#E74C3C', marginBottom: 4 }}>
            Rejection Reason:
          </Text>
          <Text style={{ fontSize: 13, color: '#333' }}>{order.rejectionReason}</Text>
        </View>
      )}

      {/* Action Buttons */}
      {order.status === 'pending_approval' && (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              backgroundColor: '#27AE60', 
              paddingVertical: 10, 
              borderRadius: 8, 
              alignItems: 'center' 
            }}
            onPress={() => handleApproveOrder(order.id)}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              backgroundColor: '#E74C3C', 
              paddingVertical: 10, 
              borderRadius: 8, 
              alignItems: 'center' 
            }}
            onPress={() => handleRejectOrder(order)}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
        <StandardHeader 
          title="Order Approvals" 
          navigation={navigation}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{ marginTop: 16, color: '#666' }}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      <StandardHeader 
        title="Order Approvals" 
        navigation={navigation}
      />

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={{ maxHeight: 60, backgroundColor: '#fff' }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: activeFilter === filter ? '#8E6652' : '#f5f5f5',
              marginRight: 10,
              borderWidth: 1,
              borderColor: activeFilter === filter ? '#8E6652' : '#E0E0E0'
            }}
          >
            <Text style={{
              color: activeFilter === filter ? '#fff' : '#666',
              fontSize: 14,
              fontWeight: activeFilter === filter ? '600' : '400'
            }}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            paddingVertical: 60 
          }}>
            <Ionicons name="receipt-outline" size={80} color="#ccc" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 }}>
              No {activeFilter === 'All' ? '' : activeFilter.toLowerCase()} orders found
            </Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
              {activeFilter === 'All' 
                ? "No customer orders yet." 
                : `No ${activeFilter.toLowerCase()} orders at the moment.`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Reject Order Modal */}
      <Modal visible={showRejectModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>Reject Order</Text>
              <TouchableOpacity onPress={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedOrder(null);
              }}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
              Please provide a reason for rejecting this order:
            </Text>

            <TextInput
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="Enter rejection reason..."
              multiline
              numberOfLines={4}
              style={{
                borderWidth: 1,
                borderColor: '#E0E0E0',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                textAlignVertical: 'top',
                marginBottom: 20,
                minHeight: 100
              }}
            />

            <TouchableOpacity
              onPress={submitRejection}
              style={{
                backgroundColor: '#E74C3C',
                paddingVertical: 15,
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Reject Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
