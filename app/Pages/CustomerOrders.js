import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { getCustomerOrdersWithTracking, getOrderTracking } from '../Helper/firebaseHelper';
import Header from '../Components/Header';

const CustomerOrders = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const statusFilters = ['All', 'Order Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        const customerOrders = await getCustomerOrdersWithTracking(user.uid);
        setOrders(customerOrders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return '#3498DB';
      case 'Confirmed': return '#27AE60';
      case 'Preparing': return '#F39C12';
      case 'Ready': return '#9B59B6';
      case 'Out for Delivery': return '#E67E22';
      case 'Delivered': return '#2ECC71';
      default: return '#95A5A6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': return 'receipt-outline';
      case 'Confirmed': return 'checkmark-circle-outline';
      case 'Preparing': return 'restaurant-outline';
      case 'Ready': return 'bag-check-outline';
      case 'Out for Delivery': return 'car-outline';
      case 'Delivered': return 'checkmark-done-circle';
      default: return 'time-outline';
    }
  };

  const filteredOrders = selectedFilter === 'All' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewOrderTracking = async (order) => {
    try {
      setTrackingLoading(true);
      setSelectedOrder(order);
      setShowTrackingModal(true);
      
      const tracking = await getOrderTracking(order.id);
      setTrackingData(tracking);
    } catch (error) {
      console.error('Error loading tracking:', error);
      Alert.alert('Error', 'Failed to load tracking information');
    } finally {
      setTrackingLoading(false);
    }
  };

  const renderOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.trackingNumber || order.id.slice(-6)}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Ionicons name={getStatusIcon(order.status)} size={14} color="#fff" />
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Items ({order.items?.length || 0}):</Text>
          {order.items?.slice(0, 2).map((item, index) => (
            <View key={index} style={styles.itemRow}>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemInfo}>Size: {item.size} • Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>Rs. {item.price}</Text>
              </View>
            </View>
          ))}
          {order.items?.length > 2 && (
            <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>Rs. {order.totalAmount}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={() => viewOrderTracking(order)}
          >
            <Ionicons name="location-outline" size={16} color="#8E6652" />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTrackingTimeline = () => {
    if (!trackingData?.timeline) return null;

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Order Timeline</Text>
        {trackingData.timeline.map((event, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <View style={[styles.timelineIcon, { backgroundColor: getStatusColor(event.status) }]}>
                <Ionicons name={getStatusIcon(event.status)} size={16} color="#fff" />
              </View>
              {index < trackingData.timeline.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>{event.status}</Text>
              <Text style={styles.timelineDescription}>{event.description}</Text>
              <Text style={styles.timelineDate}>{formatDate(event.timestamp)}</Text>
              {event.location && (
                <Text style={styles.timelineLocation}>📍 {event.location}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="My Orders" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Orders" onBackPress={() => navigation.goBack()} />
      
      {/* Orders List with Filter Tabs */}
      <ScrollView 
        style={styles.ordersContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8E6652']} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContent}
          style={styles.filterScrollView}
        >
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'All' 
                ? "You haven't placed any orders yet"
                : `No orders with status "${selectedFilter}"`
              }
            </Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {filteredOrders.map(renderOrderCard)}
          </View>
        )}
      </ScrollView>

      {/* Order Tracking Modal */}
      <Modal
        visible={showTrackingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTrackingModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Track Order #{selectedOrder?.trackingNumber || selectedOrder?.id?.slice(-6)}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowTrackingModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {trackingLoading ? (
              <View style={styles.trackingLoadingContainer}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text style={styles.loadingText}>Loading tracking information...</Text>
              </View>
            ) : (
              <>
                {selectedOrder && (
                  <View style={styles.orderSummary}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Status:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                        <Ionicons name={getStatusIcon(selectedOrder.status)} size={12} color="#fff" />
                        <Text style={styles.statusText}>{selectedOrder.status}</Text>
                      </View>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Total Amount:</Text>
                      <Text style={styles.summaryValue}>Rs. {selectedOrder.totalAmount}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Order Date:</Text>
                      <Text style={styles.summaryValue}>{formatDate(selectedOrder.createdAt)}</Text>
                    </View>
                  </View>
                )}
                {renderTrackingTimeline()}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F1DCD1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  filterScrollView: {
    paddingVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  activeFilterTab: {
    backgroundColor: '#8E6652',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  ordersContainer: {
    flex: 1,
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderDetails: {
    padding: 16,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E6652',
    marginTop: 2,
  },
  moreItems: {
    fontSize: 12,
    color: '#8E6652',
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8E6652',
  },
  trackButtonText: {
    color: '#8E6652',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  shopButton: {
    backgroundColor: '#8E6652',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 24,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F1DCD1',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#8E6652',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  trackingLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  timelineContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e1e8ed',
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  timelineLocation: {
    fontSize: 12,
    color: '#8E6652',
    marginTop: 2,
  },
};

export default CustomerOrders;
