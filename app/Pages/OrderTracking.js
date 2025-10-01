import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import {
  getSellerOrdersWithTracking,
  updateOrderTracking,
  createSampleOrdersWithTracking
} from '../Helper/firebaseHelper';
import Header from '../Components/Header';

const { width } = Dimensions.get('window');

export default function OrderTracking({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statusOptions = [
    'Order Placed',
    'Order Confirmed',
    'Preparing',
    'Ready for Pickup/Delivery',
    'Out for Delivery',
    'Delivered'
  ];

  const statusColors = {
    'Order Placed': '#3498db',
    'Order Confirmed': '#f39c12',
    'Preparing': '#e67e22',
    'Ready for Pickup/Delivery': '#9b59b6',
    'Out for Delivery': '#2980b9',
    'Delivered': '#27ae60'
  };

  useEffect(() => {
    loadOrders();
  }, [sellerId]);

  const loadOrders = async () => {
    try {
      if (!sellerId) return;
      setLoading(true);
      const ordersData = await getSellerOrdersWithTracking(sellerId);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleUpdateTracking = async () => {
    try {
      if (!selectedOrder || !selectedStatus) return;

      await updateOrderTracking(
        selectedOrder.orderId,
        selectedStatus,
        customLocation,
        customDescription
      );

      setUpdateModalVisible(false);
      setSelectedOrder(null);
      setSelectedStatus('');
      setCustomLocation('');
      setCustomDescription('');
      
      Alert.alert('Success', 'Order tracking updated successfully!');
      await loadOrders();
    } catch (error) {
      console.error('Error updating tracking:', error);
      Alert.alert('Error', 'Failed to update tracking. Please try again.');
    }
  };

  const createSampleData = async () => {
    try {
      Alert.alert(
        'Create Sample Data',
        'This will create sample orders with tracking for testing. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Create',
            onPress: async () => {
              setLoading(true);
              await createSampleOrdersWithTracking(sellerId);
              await loadOrders();
              Alert.alert('Success', 'Sample orders created successfully!');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating sample data:', error);
      Alert.alert('Error', 'Failed to create sample data.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Pending';
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status, isCompleted) => {
    const iconProps = {
      size: 20,
      color: isCompleted ? '#27ae60' : '#bdc3c7'
    };

    switch (status) {
      case 'Order Placed':
        return <Ionicons name="receipt-outline" {...iconProps} />;
      case 'Order Confirmed':
        return <Ionicons name="checkmark-circle-outline" {...iconProps} />;
      case 'Preparing':
        return <Ionicons name="construct-outline" {...iconProps} />;
      case 'Ready for Pickup/Delivery':
        return <Ionicons name="cube-outline" {...iconProps} />;
      case 'Out for Delivery':
        return <Ionicons name="car-outline" {...iconProps} />;
      case 'Delivered':
        return <Ionicons name="home-outline" {...iconProps} />;
      default:
        return <Ionicons name="ellipse-outline" {...iconProps} />;
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === 'All') return orders;
    
    // Map the tab names to actual order statuses
    const statusMap = {
      'Pending': ['Order Placed', 'Order Confirmed'],
      'Scheduled': ['Preparing'],
      'In Progress': ['Ready for Pickup/Delivery', 'Out for Delivery'],
      'Completed': ['Delivered'],
      'Failed': ['Cancelled', 'Failed']
    };
    
    if (statusMap[filterStatus]) {
      return orders.filter(order => statusMap[filterStatus].includes(order.status));
    }
    
    return orders.filter(order => order.status === filterStatus);
  };

  const filteredOrders = getFilteredOrders();

  const renderOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{order.orderId || `Order #${order.id}`}</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] || '#95a5a6' }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
        <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
      </View>

      {order.items && order.items.length > 0 && (
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {order.items.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              • {item.productName} (Size: {item.size}) - ₹{item.price}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.trackingInfo}>
        <Text style={styles.trackingTitle}>Tracking: {order.trackingNumber || 'N/A'}</Text>
        {order.tracking && (
          <Text style={styles.estimatedDelivery}>
            Est. Delivery: {formatDate(order.tracking.estimatedDelivery)}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.trackingButton}
          onPress={() => setSelectedOrder(order)}
        >
          <Ionicons name="location-outline" size={16} color="#fff" />
          <Text style={styles.buttonText}>View Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            setSelectedOrder(order);
            setUpdateModalVisible(true);
          }}
        >
          <MaterialIcons name="update" size={16} color="#fff" />
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTrackingTimeline = (tracking) => {
    if (!tracking || !tracking.timeline) return null;

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Order Timeline</Text>
        {tracking.timeline.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              {getStatusIcon(item.status, item.isCompleted)}
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineStatus, { color: item.isCompleted ? '#27ae60' : '#7f8c8d' }]}>
                {item.status}
              </Text>
              <Text style={styles.timelineDescription}>{item.description}</Text>
              <Text style={styles.timelineLocation}>📍 {item.location}</Text>
              <Text style={styles.timelineDate}>{formatDate(item.timestamp)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Order Tracking" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Order Tracking" onBackPress={() => navigation.goBack()} />
      
      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
          {['All', 'Pending', 'Scheduled', 'In Progress', 'Completed', 'Failed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.tab, filterStatus === status && styles.activeTab]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.tabText, filterStatus === status && styles.activeTabText]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              {filterStatus === 'All' 
                ? "You don't have any orders yet" 
                : `No orders with status "${filterStatus}"`}
            </Text>
            {filterStatus === 'All' && (
              <TouchableOpacity style={styles.sampleButton} onPress={createSampleData}>
                <Text style={styles.sampleButtonText}>Create Sample Orders</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredOrders.map(renderOrderCard)
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={!!selectedOrder && !updateModalVisible}
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <TouchableOpacity onPress={() => setSelectedOrder(null)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedOrder && (
              <>
                <View style={styles.orderDetailsCard}>
                  <Text style={styles.detailTitle}>Order Information</Text>
                  <Text style={styles.detailText}>Order ID: {selectedOrder.orderId}</Text>
                  <Text style={styles.detailText}>Customer: {selectedOrder.customerName}</Text>
                  <Text style={styles.detailText}>Email: {selectedOrder.customerEmail}</Text>
                  <Text style={styles.detailText}>Phone: {selectedOrder.customerPhone}</Text>
                  <Text style={styles.detailText}>Total: ₹{selectedOrder.totalAmount}</Text>
                  <Text style={styles.detailText}>Payment: {selectedOrder.paymentMethod}</Text>
                  <Text style={styles.detailText}>Status: {selectedOrder.paymentStatus}</Text>
                </View>

                <View style={styles.orderDetailsCard}>
                  <Text style={styles.detailTitle}>Delivery Address</Text>
                  <Text style={styles.detailText}>{selectedOrder.deliveryAddress}</Text>
                </View>

                {selectedOrder.tracking && renderTrackingTimeline(selectedOrder.tracking)}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        visible={updateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.updateModalOverlay}>
          <View style={styles.updateModalContent}>
            <Text style={styles.updateModalTitle}>Update Order Status</Text>
            
            <Text style={styles.inputLabel}>Select Status:</Text>
            <ScrollView style={styles.statusSelector}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusOption, selectedStatus === status && styles.selectedStatusOption]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text style={[styles.statusOptionText, selectedStatus === status && styles.selectedStatusOptionText]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Location (Optional):</Text>
            <TextInput
              style={styles.textInput}
              value={customLocation}
              onChangeText={setCustomLocation}
              placeholder="Enter location"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Description (Optional):</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={customDescription}
              onChangeText={setCustomDescription}
              placeholder="Enter description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />

            <View style={styles.updateModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setUpdateModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, !selectedStatus && styles.disabledButton]}
                onPress={handleUpdateTracking}
                disabled={!selectedStatus}
              >
                <Text style={styles.confirmButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  tabsContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabsScrollView: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 4,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#8E6652',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E6652',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  trackingInfo: {
    marginBottom: 16,
  },
  trackingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  estimatedDelivery: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  trackingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  updateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8E6652',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
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
  sampleButton: {
    backgroundColor: '#8E6652',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  sampleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  orderDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timelineContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  timelineIcon: {
    width: 40,
    alignItems: 'center',
    paddingTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timelineLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
  },
  updateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    maxHeight: '80%',
  },
  updateModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  statusSelector: {
    maxHeight: 150,
    marginBottom: 12,
  },
  statusOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    marginBottom: 8,
  },
  selectedStatusOption: {
    backgroundColor: '#8E6652',
    borderColor: '#8E6652',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedStatusOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  updateModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#8E6652',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
};
