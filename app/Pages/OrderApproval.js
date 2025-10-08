import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    TextInput,
    Modal
} from 'react-native';
import { useSelector } from 'react-redux';
import {
    getOrdersBySeller,
    updateOrderStatus,
    getUserProfile
} from '../Helper/firebaseHelper';

const OrderApproval = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [sellerNotes, setSellerNotes] = useState('');

    const user = useSelector((state) => state.home.user);
    const sellerId = user?.sellerId;

    useEffect(() => {
        if (sellerId) {
            fetchOrders();
        }
    }, [sellerId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Get all orders for this seller (including pending ones)
            const allOrders = await getOrdersBySeller(sellerId);
            // Filter to show only pending orders for approval
            const pendingOrders = allOrders.filter(order => order.status === 'pending');
            setOrders(pendingOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderAction = async (orderId, action) => {
        try {
            await updateOrderStatus(orderId, action, sellerNotes);
            Alert.alert(
                'Success',
                `Order ${action === 'approved' ? 'approved' : 'rejected'} successfully!`
            );
            setModalVisible(false);
            setSellerNotes('');
            fetchOrders(); // Refresh the list
        } catch (error) {
            Alert.alert('Error', 'Failed to update order status');
            console.error('Error updating order:', error);
        }
    };

    const openApprovalModal = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const renderOrder = ({ item }) => (
        <View style={{
            backgroundColor: 'white',
            margin: 10,
            borderRadius: 10,
            padding: 15,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8E6652' }}>
                    Order #{item.id.slice(-8)}
                </Text>
                <View style={{
                    backgroundColor: '#ffc107',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                }}>
                    <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>
                        PENDING
                    </Text>
                </View>
            </View>

            <Text style={{ fontSize: 14, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Customer:</Text> {item.customerName}
            </Text>

            <Text style={{ fontSize: 14, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Items:</Text> {item.items?.length || 0} products
            </Text>

            <Text style={{ fontSize: 14, marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Total:</Text> Rs {(item.totalAmount || 0).toLocaleString()}
            </Text>

            <Text style={{ fontSize: 12, color: '#666', marginBottom: 15 }}>
                Ordered on: {new Date(item.createdAt).toLocaleDateString()}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#dc3545',
                        padding: 10,
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 5
                    }}
                    onPress={() => {
                        Alert.alert(
                            'Reject Order',
                            'Are you sure you want to reject this order?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Reject',
                                    onPress: () => handleOrderAction(item.id, 'rejected')
                                }
                            ]
                        );
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                        Reject
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#28a745',
                        padding: 10,
                        borderRadius: 5,
                        flex: 1,
                        marginLeft: 5
                    }}
                    onPress={() => openApprovalModal(item)}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                        Approve
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text>Loading orders...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#8E6652',
                padding: 15,
                paddingTop: 50,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginRight: 15 }}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>←</Text>
                </TouchableOpacity>
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>
                    Order Approvals
                </Text>
            </View>

            {/* Orders List */}
            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <Text style={{ fontSize: 18, color: '#666', textAlign: 'center' }}>
                        No pending orders
                    </Text>
                    <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 10 }}>
                        All orders have been processed
                    </Text>
                </View>
            )}

            {/* Approval Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 20,
                        padding: 20,
                        margin: 20,
                        width: '90%'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 15,
                            textAlign: 'center'
                        }}>
                            Approve Order
                        </Text>

                        <Text style={{ fontSize: 14, marginBottom: 10 }}>
                            Order #{selectedOrder?.id?.slice(-8)}
                        </Text>

                        <Text style={{ fontSize: 14, marginBottom: 15 }}>
                            Customer: {selectedOrder?.customerName}
                        </Text>

                        <Text style={{ fontSize: 14, marginBottom: 15 }}>
                            Add notes (optional):
                        </Text>

                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 20,
                                minHeight: 80,
                                textAlignVertical: 'top'
                            }}
                            placeholder="Enter any notes for the customer..."
                            value={sellerNotes}
                            onChangeText={setSellerNotes}
                            multiline
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#6c757d',
                                    padding: 12,
                                    borderRadius: 10,
                                    flex: 1,
                                    marginRight: 10
                                }}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#28a745',
                                    padding: 12,
                                    borderRadius: 10,
                                    flex: 1,
                                    marginLeft: 10
                                }}
                                onPress={() => handleOrderAction(selectedOrder?.id, 'approved')}
                            >
                                <Text style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    Approve Order
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default OrderApproval;
