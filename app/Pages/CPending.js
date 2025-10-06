import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getCustomerOrders } from "../Helper/firebaseHelper";
import StandardHeader from '../Components/StandardHeader';

const CustomerOrders = ({ navigation }) => {
    const user = useSelector((state) => state.home.user);
    
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const filters = ['All', 'Pending Approval', 'Approved', 'Rejected', 'Delivered'];

    useEffect(() => {
        loadCustomerOrders();
    }, []);

    const loadCustomerOrders = async () => {
        try {
            if (!user?.uid) return;
            
            const customerOrders = await getCustomerOrders(user.uid);
            setOrders(customerOrders);
        } catch (error) {
            console.error("Error loading customer orders:", error);
            Alert.alert("Error", "Failed to load your orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_approval': return '#F39C12';
            case 'approved': return '#27AE60';
            case 'rejected': return '#E74C3C';
            case 'delivered': return '#2ECC71';
            case 'preparing': return '#9B59B6';
            case 'shipped': return '#3498DB';
            default: return '#95A5A6';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending_approval': return 'Pending Approval';
            case 'approved': return 'Approved';
            case 'rejected': return 'Rejected';
            case 'delivered': return 'Delivered';
            case 'preparing': return 'Preparing';
            case 'shipped': return 'Shipped';
            default: return status;
        }
    };

    const filteredOrders = activeFilter === 'All' 
        ? orders 
        : orders.filter(order => order.status === activeFilter);

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
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{order.id}</Text>
                <View style={{ 
                    backgroundColor: order.statusColor, 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 12 
                }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{order.status.toUpperCase()}</Text>
                </View>
            </View>

            {/* Order Date */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons name="calendar-outline" size={16} color="#8E6652" />
                <Text style={{ marginLeft: 6, fontSize: 14, color: '#666' }}>Order Date: {order.date}</Text>
            </View>

            {/* Order Items */}
            {order.items.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Image source={item.image} style={{ width: 50, height: 60, borderRadius: 8, marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Size: {item.size} • Qty: {item.quantity}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#8E6652', marginTop: 2 }}>Rs. {item.price.toLocaleString()}</Text>
                    </View>
                </View>
            ))}

            {/* Order Total */}
            <View style={{ borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12, marginTop: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Total Amount</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#8E6652' }}>Rs. {order.total.toLocaleString()}</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity 
                    style={{ 
                        flex: 1, 
                        backgroundColor: '#8E6652', 
                        paddingVertical: 10, 
                        borderRadius: 8, 
                        alignItems: 'center' 
                    }}
                    onPress={() => navigation.navigate("OrderDetail", { orderId: order.id })}
                >
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>View Details</Text>
                </TouchableOpacity>
                
                {order.status === 'Pending' && (
                    <TouchableOpacity 
                        style={{ 
                            flex: 1, 
                            backgroundColor: '#E74C3C', 
                            paddingVertical: 10, 
                            borderRadius: 8, 
                            alignItems: 'center' 
                        }}
                        onPress={() => navigation.navigate("Cancel", { orderId: order.id })}
                    >
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Cancel Order</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
                <StandardHeader 
                    title="My Orders" 
                    navigation={navigation}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8E6652" />
                    <Text style={{ marginTop: 16, color: '#666' }}>Loading your orders...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
            <StandardHeader 
                title="My Orders" 
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
                                ? "You haven't placed any orders yet." 
                                : `You don't have any ${activeFilter.toLowerCase()} orders.`}
                        </Text>
                        <TouchableOpacity 
                            style={{ 
                                backgroundColor: '#8E6652', 
                                paddingHorizontal: 24, 
                                paddingVertical: 12, 
                                borderRadius: 8, 
                                marginTop: 20 
                            }}
                            onPress={() => navigation.navigate("Home2")}
                        >
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default CustomerOrders;
