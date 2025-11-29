import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from 'react-redux';
import { clearCartFromFirebase, createOrder } from '../Helper/firebaseHelper';
import { clearCart } from '../_redux/Slices/HomeDataSlice';

const Order = ({ navigation }) => {
    const route = useRoute();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.home.user);
    const cartItems = useSelector((state) => state.home.cart || []);
    
    const { 
        paymentMethod, 
        selectedBank, 
        screenshotUrl, 
        shippingInfo, 
        orderTotal 
    } = route.params || {};
    
    const [creatingOrder, setCreatingOrder] = useState(true);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        createOrderInFirestore();
    }, []);

    const createOrderInFirestore = async () => {
        try {
            setCreatingOrder(true);

            if (!user?.uid) {
                Alert.alert('Error', 'User not logged in');
                navigation.navigate('Home2');
                return;
            }

            if (!cartItems || cartItems.length === 0) {
                Alert.alert('Error', 'Cart is empty');
                navigation.navigate('Home2');
                return;
            }

            // Group cart items by seller
            const ordersBySeller = {};
            
            cartItems.forEach(item => {
                const sellerId = item.sellerId || item.uid;
                if (!ordersBySeller[sellerId]) {
                    ordersBySeller[sellerId] = [];
                }
                ordersBySeller[sellerId].push(item);
            });

            // Create order for each seller
            const orderIds = [];
            
            for (const [sellerId, items] of Object.entries(ordersBySeller)) {
                // Calculate totals for this seller's items
                const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const securityFees = items.reduce((sum, item) => sum + ((item.securityFee || 0) * item.quantity), 0);
                const shippingCost = shippingInfo?.shippingMethod === 'home' ? 500 : 0;
                const total = subtotal + securityFees + shippingCost;

                // Prepare order data
                const orderData = {
                    customerId: user.uid,
                    customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Customer',
                    customerEmail: user.email,
                    customerPhone: shippingInfo?.phoneNumber || user.phone || '',
                    sellerId: sellerId,
                    items: items.map(item => ({
                        productId: item.productId || item.id,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        price: item.price,
                        securityFee: item.securityFee || 0,
                        size: item.size,
                        quantity: item.quantity,
                        categoryName: item.categoryName
                    })),
                    shippingInfo: {
                        fullName: shippingInfo?.fullName || '',
                        streetAddress: shippingInfo?.streetAddress || '',
                        city: shippingInfo?.city || '',
                        stateProvince: shippingInfo?.stateProvince || '',
                        phoneNumber: shippingInfo?.phoneNumber || '',
                        shippingMethod: shippingInfo?.shippingMethod || 'home'
                    },
                    paymentInfo: {
                        method: paymentMethod || 'cod', // 'cod' or 'bank'
                        ...(paymentMethod === 'bank' && selectedBank && {
                            bankTransfer: {
                                bankId: selectedBank.id,
                                bankName: selectedBank.name,
                                accountNumber: selectedBank.accountNumber,
                                accountTitle: selectedBank.accountTitle,
                                transactionScreenshot: screenshotUrl || null
                            }
                        })
                    },
                    totals: {
                        subtotal: subtotal,
                        securityFees: securityFees,
                        shippingCost: shippingCost,
                        total: total
                    },
                    status: 'pending', // Will be set by createOrder but including for clarity
                };

                // Create order in Firestore
                const id = await createOrder(orderData);
                orderIds.push(id);
                console.log(`Order created for seller ${sellerId}:`, id);
            }

            setOrderId(orderIds[0]); // Store first order ID for reference

            // Clear cart from Redux
            dispatch(clearCart());
            
            // Clear cart from Firebase
            if (user?.uid) {
                await clearCartFromFirebase(user.uid);
            }

            console.log('Orders created successfully:', orderIds);
        } catch (error) {
            console.error('Error creating order:', error);
            Alert.alert(
                'Error',
                'Failed to create order. Please try again.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Cart')
                    }
                ]
            );
        } finally {
            setCreatingOrder(false);
        }
    };

    if (creatingOrder) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffefeff' }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text style={{ marginTop: 15, fontSize: 16, color: '#666' }}>
                    Creating your order...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: '#fffefeff', flex: 1 }}>
            <View style={{ 
                backgroundColor: '#8E6652', 
                paddingVertical: 20,
                paddingHorizontal: 20,
                paddingTop: 50,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('BottomTab');
                        }
                    }}
                    style={{ marginRight: 15 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 }}>
                    Order
                </Text>
            </View>
            <View style={{ height: 250, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Ionicons name="checkmark-circle" size={95} color="rgba(243, 216, 202, 1)" />
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: -23, marginTop: 10 }}>Order Successful</Text>
                    <Text style={{ fontSize: 17, marginTop: 5 }}>Thank You!</Text>
                </View>
            </View>
            
            {/* Payment Method Info */}
            {paymentMethod === 'bank' && selectedBank && (
                <View style={{ margin: 15, padding: 15, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
                        Payment Details
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Method: <Text style={{ fontWeight: '600' }}>Bank Transfer</Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Bank: <Text style={{ fontWeight: '600' }}>{selectedBank.name}</Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        Account: <Text style={{ fontWeight: '600' }}>{selectedBank.accountNumber}</Text>
                    </Text>
                    {screenshotUrl && (
                        <Text style={{ fontSize: 11, color: '#4CAF50', marginTop: 8 }}>
                            ✓ Transaction screenshot uploaded
                        </Text>
                    )}
                </View>
            )}

            <View style={{ backgroundColor: 'white', padding: 30, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity 
                    style={{ height: 30, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 150, alignItems: 'center', borderRadius: 10, marginBottom: 50 }}
                    onPress={() => navigation.navigate("CPending")}
                >
                    <Text style={{ fontSize: 18, color: '#fff' }}>View Order</Text>
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: 'white', padding: 30, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity 
                    style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20 }}
                    onPress={() => navigation.navigate("BottomTab")}
                >
                    <Text style={{ fontSize: 18, color: '#fff' }}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Order
