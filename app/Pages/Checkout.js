import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from "react-redux";
import { createCustomerOrder } from "../Helper/firebaseHelper";
import StandardHeader from '../Components/StandardHeader';

export default function Checkout({navigation}) {
    const user = useSelector((state) => state.home.user);
    
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Sample cart items (in real app, this would come from cart state)
    const cartItems = [
        { 
            id: 1, 
            name: 'Eastern Gharara', 
            size: 'M', 
            quantity: 1, 
            price: 35999,
            sellerId: 'seller_123' // This would come from the actual product
        }
    ];

    const deliveryFee = 500;
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;

    const handlePlaceOrder = async () => {
        // Validation
        if (!fullName.trim() || !streetAddress.trim() || !city.trim() || !phoneNumber.trim()) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                customerId: user?.uid,
                customerName: fullName.trim(),
                customerPhone: phoneNumber.trim(),
                customerEmail: user?.email || '',
                shippingAddress: {
                    fullName: fullName.trim(),
                    streetAddress: streetAddress.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    phoneNumber: phoneNumber.trim()
                },
                items: cartItems,
                subtotal: subtotal,
                deliveryFee: deliveryFee,
                total: total,
                paymentMethod: 'COD', // Cash on Delivery
                sellerId: cartItems[0]?.sellerId || 'default_seller', // In real app, handle multiple sellers
                orderNotes: ''
            };

            const orderId = await createCustomerOrder(orderData);
            
            Alert.alert(
                "Order Placed Successfully!", 
                "Your order has been submitted and is waiting for seller approval. You will be notified once the seller responds.",
                [
                    { 
                        text: "View My Orders", 
                        onPress: () => navigation.navigate("CPending") 
                    },
                    { 
                        text: "Continue Shopping", 
                        onPress: () => navigation.navigate("Home2") 
                    }
                ]
            );

        } catch (error) {
            console.error("Error placing order:", error);
            Alert.alert("Error", "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
            <StandardHeader 
                title="Checkout" 
                navigation={navigation}
            />
            <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
                <View style={{ padding: 20 }}>
                    {/* Shipping Information */}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>Shipping Information</Text>
                    
                    <View style={{ gap: 15, marginBottom: 30 }}>
                        <TextInput 
                            placeholder="Full Name *"
                            value={fullName}
                            onChangeText={setFullName}
                            style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 45, padding: 12, fontSize: 16 }} 
                        />
                        <TextInput 
                            placeholder="Street Address *"
                            value={streetAddress}
                            onChangeText={setStreetAddress}
                            style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 45, padding: 12, fontSize: 16 }} 
                        />
                        <TextInput 
                            placeholder="City *"
                            value={city}
                            onChangeText={setCity}
                            style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 45, padding: 12, fontSize: 16 }} 
                        />
                        <TextInput 
                            placeholder="State/Province"
                            value={state}
                            onChangeText={setState}
                            style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 45, padding: 12, fontSize: 16 }} 
                        />
                        <TextInput 
                            placeholder="Phone Number *"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 45, padding: 12, fontSize: 16 }} 
                        />
                    </View>

                    {/* Order Summary */}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>Order Summary</Text>
                    <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 15, marginBottom: 20 }}>
                        {cartItems.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ flex: 1, fontSize: 14, color: '#333' }}>
                                    {item.name} (Size: {item.size}) x {item.quantity}
                                </Text>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#8E6652' }}>
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                </Text>
                            </View>
                        ))}
                        <View style={{ borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8, marginTop: 8 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontSize: 14, color: '#666' }}>Subtotal</Text>
                                <Text style={{ fontSize: 14, color: '#666' }}>Rs. {subtotal.toLocaleString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: '#666' }}>Delivery Fee</Text>
                                <Text style={{ fontSize: 14, color: '#666' }}>Rs. {deliveryFee.toLocaleString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Total</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8E6652' }}>Rs. {total.toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Shipping Method */}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>Shipping Method</Text>
                    <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 15, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#27AE60', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#27AE60' }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>₨ 500 - Delivery to home</Text>
                                <Text style={{ fontSize: 13, color: '#666' }}>Delivery within 3 to 7 business days</Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment Method */}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>Payment Method</Text>
                    <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 15, marginBottom: 30 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#8E6652', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#8E6652' }} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Cash on Delivery (COD)</Text>
                        </View>
                        <Text style={{ fontSize: 13, color: '#666', marginTop: 8, marginLeft: 32 }}>
                            Pay when your order is delivered to your doorstep
                        </Text>
                    </View>

                    {/* Place Order Button */}
                    <TouchableOpacity 
                        style={{ 
                            backgroundColor: "#8E6652", 
                            borderRadius: 12, 
                            height: 50, 
                            justifyContent: "center", 
                            alignItems: "center",
                            opacity: loading ? 0.7 : 1
                        }}
                        onPress={handlePlaceOrder}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: "600", fontSize: 16 }}>
                                Place Order (Requires Seller Approval)
                            </Text>
                        )}
                    </TouchableOpacity>

                    <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 12 }}>
                        * Your order will be sent to the seller for approval. You will be notified once approved.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
