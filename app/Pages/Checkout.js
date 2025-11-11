import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

export default function Checkout({ navigation }) {
    const cartItems = useSelector((state) => state.home.cart || []);
    const [fullName, setFullName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [stateProvince, setStateProvince] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedShipping, setSelectedShipping] = useState('home');

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateSecurityFees = () => {
        return cartItems.reduce((total, item) => total + ((item.securityFee || 0) * item.quantity), 0);
    };

    const shippingCost = selectedShipping === 'home' ? 500 : 0;

    const calculateTotal = () => {
        return calculateSubtotal() + calculateSecurityFees() + shippingCost;
    };

    const handleContinueToPayment = () => {
        if (!fullName.trim() || !streetAddress.trim() || !city.trim() || !stateProvince.trim() || !phoneNumber.trim()) {
            alert('Please fill in all fields');
            return;
        }
        navigation.navigate('Payment', {
            shippingInfo: {
                fullName,
                streetAddress,
                city,
                stateProvince,
                phoneNumber,
                shippingMethod: selectedShipping
            },
            orderTotal: calculateTotal()
        });
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: '#F5F5F5' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={{
                backgroundColor: '#8E6652',
                paddingVertical: 20,
                paddingHorizontal: 20,
                paddingTop: 50,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ marginRight: 15 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
                            Checkout
                        </Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 }}>
                            Complete your order
                        </Text>
                    </View>
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        paddingVertical: 6
                    }}>
                        <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>
                            {cartItems.length} items
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                style={{ flex: 1 }} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {/* Shipping Information Section */}
                <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Ionicons name="location" size={20} color="#8E6652" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 8 }}>
                            Shipping Information
                        </Text>
                    </View>

                    <View style={{ backgroundColor: '#FFF', borderRadius: 15, padding: 15, elevation: 2 }}>
                        {/* Full Name */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                                Full Name *
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: fullName ? '#8E6652' : '#DDD',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                backgroundColor: '#F9F9F9'
                            }}>
                                <Ionicons name="person-outline" size={20} color="#8E6652" />
                                <TextInput
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    style={{
                                        flex: 1,
                                        height: 50,
                                        fontSize: 15,
                                        marginLeft: 10,
                                        color: '#333'
                                    }}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* Street Address */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                                Street Address *
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: streetAddress ? '#8E6652' : '#DDD',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                backgroundColor: '#F9F9F9'
                            }}>
                                <Ionicons name="home-outline" size={20} color="#8E6652" />
                                <TextInput
                                    placeholder="Street address, apartment, suite, etc."
                                    value={streetAddress}
                                    onChangeText={setStreetAddress}
                                    style={{
                                        flex: 1,
                                        height: 50,
                                        fontSize: 15,
                                        marginLeft: 10,
                                        color: '#333'
                                    }}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* City and State */}
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                                    City *
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: city ? '#8E6652' : '#DDD',
                                    borderRadius: 10,
                                    paddingHorizontal: 12,
                                    backgroundColor: '#F9F9F9'
                                }}>
                                    <Ionicons name="business-outline" size={18} color="#8E6652" />
                                    <TextInput
                                        placeholder="City"
                                        value={city}
                                        onChangeText={setCity}
                                        style={{
                                            flex: 1,
                                            height: 50,
                                            fontSize: 15,
                                            marginLeft: 8,
                                            color: '#333'
                                        }}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                                    State/Province *
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: stateProvince ? '#8E6652' : '#DDD',
                                    borderRadius: 10,
                                    paddingHorizontal: 12,
                                    backgroundColor: '#F9F9F9'
                                }}>
                                    <Ionicons name="map-outline" size={18} color="#8E6652" />
                                    <TextInput
                                        placeholder="State"
                                        value={stateProvince}
                                        onChangeText={setStateProvince}
                                        style={{
                                            flex: 1,
                                            height: 50,
                                            fontSize: 15,
                                            marginLeft: 8,
                                            color: '#333'
                                        }}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Phone Number */}
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                                Phone Number *
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: phoneNumber ? '#8E6652' : '#DDD',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                backgroundColor: '#F9F9F9'
                            }}>
                                <Ionicons name="call-outline" size={20} color="#8E6652" />
                                <TextInput
                                    placeholder="03XX XXXXXXX"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    style={{
                                        flex: 1,
                                        height: 50,
                                        fontSize: 15,
                                        marginLeft: 10,
                                        color: '#333'
                                    }}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Shipping Method Section */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <MaterialIcons name="local-shipping" size={20} color="#8E6652" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 8 }}>
                            Shipping Method
                        </Text>
                    </View>

                    {/* Home Delivery Option */}
                    <TouchableOpacity
                        onPress={() => setSelectedShipping('home')}
                        style={{
                            backgroundColor: '#FFF',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 12,
                            borderWidth: 2,
                            borderColor: selectedShipping === 'home' ? '#8E6652' : '#E0E0E0',
                            elevation: selectedShipping === 'home' ? 3 : 1
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: selectedShipping === 'home' ? '#8E6652' : '#CCC',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                                {selectedShipping === 'home' && (
                                    <View style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: '#8E6652'
                                    }} />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Ionicons name="home" size={18} color="#8E6652" />
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 6 }}>
                                        Home Delivery
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 13, color: '#666' }}>
                                    Delivery within 3 to 7 business days
                                </Text>
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8E6652' }}>
                                Rs 500
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Pickup Option */}
                    <TouchableOpacity
                        onPress={() => setSelectedShipping('pickup')}
                        style={{
                            backgroundColor: '#FFF',
                            borderRadius: 12,
                            padding: 15,
                            borderWidth: 2,
                            borderColor: selectedShipping === 'pickup' ? '#8E6652' : '#E0E0E0',
                            elevation: selectedShipping === 'pickup' ? 3 : 1
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: selectedShipping === 'pickup' ? '#8E6652' : '#CCC',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                                {selectedShipping === 'pickup' && (
                                    <View style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: '#8E6652'
                                    }} />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Ionicons name="storefront" size={18} color="#8E6652" />
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 6 }}>
                                        Store Pickup
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 13, color: '#666' }}>
                                    Pick up from our store location
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: '#E8F5E9',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 8
                            }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#4CAF50' }}>
                                    FREE
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Order Summary */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <MaterialIcons name="receipt" size={20} color="#8E6652" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 8 }}>
                            Order Summary
                        </Text>
                    </View>

                    <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 15, elevation: 2 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 14, color: '#666' }}>Subtotal</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
                                Rs {calculateSubtotal().toLocaleString()}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 14, color: '#666' }}>Security Fees</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
                                Rs {calculateSecurityFees().toLocaleString()}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                            <Text style={{ fontSize: 14, color: '#666' }}>Shipping</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: selectedShipping === 'pickup' ? '#4CAF50' : '#333' }}>
                                {selectedShipping === 'pickup' ? 'FREE' : `Rs ${shippingCost}`}
                            </Text>
                        </View>
                        <View style={{
                            borderTopWidth: 1,
                            borderTopColor: '#E0E0E0',
                            paddingTop: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Total</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8E6652' }}>
                                Rs {calculateTotal().toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Continue Button */}
            <View style={{
                backgroundColor: '#FFF',
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0',
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4
            }}>
                <TouchableOpacity
                    onPress={handleContinueToPayment}
                    style={{
                        backgroundColor: '#8E6652',
                        paddingVertical: 16,
                        borderRadius: 12,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5
                    }}
                >
                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', marginRight: 8 }}>
                        Continue to Payment
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
