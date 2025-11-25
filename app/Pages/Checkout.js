import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { getBanks, initializePakistanBanks, uploadImageToCloudinary } from '../Helper/firebaseHelper';

const { width } = Dimensions.get('window');

export default function Checkout({ navigation }) {
    const cartItems = useSelector((state) => state.home.cart || []);
    const [fullName, setFullName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [stateProvince, setStateProvince] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedShipping, setSelectedShipping] = useState('home');
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'bank'
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [showBankModal, setShowBankModal] = useState(false);
    const [receiptUri, setReceiptUri] = useState(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            setLoadingBanks(true);
            let fetchedBanks = await getBanks();
            
            if (fetchedBanks.length === 0) {
                console.log('No banks found, initializing Pakistan banks...');
                await initializePakistanBanks();
                fetchedBanks = await getBanks();
            }
            
            setBanks(fetchedBanks);
        } catch (error) {
            console.error('Error fetching banks:', error);
        } finally {
            setLoadingBanks(false);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera roll permissions to upload receipt.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setReceiptUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setReceiptUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Upload Transaction Receipt',
            'Choose an option',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

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

    const handleContinueToPayment = async () => {
        // Validate shipping info
        if (!fullName.trim() || !streetAddress.trim() || !city.trim() || !stateProvince.trim() || !phoneNumber.trim()) {
            Alert.alert('Required', 'Please fill in all shipping fields');
            return;
        }

        // Validate payment method
        if (paymentMethod === 'bank') {
            if (!selectedBank) {
                Alert.alert('Required', 'Please select a bank for bank transfer.');
                return;
            }
            if (!receiptUri) {
                Alert.alert('Required', 'Please upload transaction receipt for bank transfer.');
                return;
            }
        }

        try {
            setProcessing(true);
            let receiptUrl = null;

            // Upload receipt if bank transfer
            if (paymentMethod === 'bank' && receiptUri) {
                try {
                    setUploadingReceipt(true);
                    const timestamp = Date.now();
                    receiptUrl = await uploadImageToCloudinary(
                        receiptUri,
                        'my-app/payments/transactions',
                        `receipt_${timestamp}.jpg`
                    );
                    console.log('Receipt uploaded:', receiptUrl);
                } catch (error) {
                    console.error('Error uploading receipt:', error);
                    Alert.alert('Error', 'Failed to upload receipt. Please try again.');
                    setProcessing(false);
                    setUploadingReceipt(false);
                    return;
                } finally {
                    setUploadingReceipt(false);
                }
            }

            // Navigate to Payment page (or directly to Order if you want to skip Payment page)
            navigation.navigate('Payment', {
                shippingInfo: {
                    fullName,
                    streetAddress,
                    city,
                    stateProvince,
                    phoneNumber,
                    shippingMethod: selectedShipping
                },
                paymentMethod,
                selectedBank: selectedBank ? {
                    id: selectedBank.id,
                    name: selectedBank.name,
                    accountNumber: selectedBank.accountNumber,
                    accountTitle: selectedBank.accountTitle
                } : null,
                receiptUrl,
                orderTotal: calculateTotal()
            });
        } catch (error) {
            console.error('Error processing checkout:', error);
            Alert.alert('Error', 'Failed to process checkout. Please try again.');
        } finally {
            setProcessing(false);
        }
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

                {/* Payment Method Section */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Ionicons name="card-outline" size={20} color="#8E6652" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 8 }}>
                            Payment Method
                        </Text>
                    </View>

                    {/* Cash on Delivery Option */}
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('cod')}
                        style={{
                            backgroundColor: '#FFF',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 12,
                            borderWidth: 2,
                            borderColor: paymentMethod === 'cod' ? '#8E6652' : '#E0E0E0',
                            elevation: paymentMethod === 'cod' ? 3 : 1
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Ionicons name="cash-outline" size={24} color={paymentMethod === 'cod' ? '#8E6652' : '#666'} />
                                <Text style={{ fontSize: 16, fontWeight: '600', color: paymentMethod === 'cod' ? '#8E6652' : '#333', marginLeft: 10 }}>
                                    Cash on Delivery
                                </Text>
                            </View>
                            {paymentMethod === 'cod' && (
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#8E6652',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#8E6652'
                                }}>
                                    <Ionicons name="checkmark" size={16} color="#FFF" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Bank Transfer Option */}
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('bank')}
                        style={{
                            backgroundColor: '#FFF',
                            borderRadius: 12,
                            padding: 15,
                            borderWidth: 2,
                            borderColor: paymentMethod === 'bank' ? '#8E6652' : '#E0E0E0',
                            elevation: paymentMethod === 'bank' ? 3 : 1
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Ionicons name="card" size={24} color={paymentMethod === 'bank' ? '#8E6652' : '#666'} />
                                <Text style={{ fontSize: 16, fontWeight: '600', color: paymentMethod === 'bank' ? '#8E6652' : '#333', marginLeft: 10 }}>
                                    Bank Transfer
                                </Text>
                            </View>
                            {paymentMethod === 'bank' && (
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#8E6652',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#8E6652'
                                }}>
                                    <Ionicons name="checkmark" size={16} color="#FFF" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Bank Transfer Details */}
                    {paymentMethod === 'bank' && (
                        <View style={{ marginTop: 15, padding: 15, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
                                Bank Transfer Details
                            </Text>

                            {/* Bank Selection */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
                                    Select Bank *
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowBankModal(true)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: selectedBank ? '#8E6652' : '#DDD',
                                        borderRadius: 10,
                                        padding: 15,
                                        backgroundColor: '#F9F9F9',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: selectedBank ? '#333' : '#999' }}>
                                        {selectedBank ? selectedBank.name : 'Select a bank'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#8E6652" />
                                </TouchableOpacity>
                                
                                {selectedBank && (
                                    <View style={{ marginTop: 10, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                                        <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                                            Account Number: <Text style={{ fontWeight: 'bold' }}>{selectedBank.accountNumber}</Text>
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#666' }}>
                                            Account Title: <Text style={{ fontWeight: 'bold' }}>{selectedBank.accountTitle}</Text>
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Receipt Upload */}
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
                                    Transaction Receipt * <Text style={{ color: '#dc3545' }}>(Required)</Text>
                                </Text>
                                {receiptUri ? (
                                    <View style={{ marginBottom: 10 }}>
                                        <Image
                                            source={{ uri: receiptUri }}
                                            style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 10 }}
                                            resizeMode="contain"
                                        />
                                        <TouchableOpacity
                                            onPress={showImageOptions}
                                            style={{
                                                backgroundColor: '#8E6652',
                                                padding: 12,
                                                borderRadius: 8,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                                                Change Receipt
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={showImageOptions}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#8E6652',
                                            borderStyle: 'dashed',
                                            borderRadius: 10,
                                            padding: 30,
                                            alignItems: 'center',
                                            backgroundColor: '#F9F9F9'
                                        }}
                                    >
                                        <Ionicons name="camera-outline" size={40} color="#8E6652" />
                                        <Text style={{ marginTop: 10, fontSize: 14, color: '#8E6652', fontWeight: '600' }}>
                                            Upload Transaction Receipt
                                        </Text>
                                        <Text style={{ marginTop: 5, fontSize: 12, color: '#999' }}>
                                            Tap to select from gallery or camera
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
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

            {/* Bank Selection Modal */}
            <Modal
                visible={showBankModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowBankModal(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Select Bank</Text>
                            <TouchableOpacity onPress={() => setShowBankModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ maxHeight: 400 }}>
                            {loadingBanks ? (
                                <View style={{ padding: 40, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#8E6652" />
                                </View>
                            ) : (
                                banks.map((bank) => (
                                    <TouchableOpacity
                                        key={bank.id}
                                        onPress={() => {
                                            setSelectedBank(bank);
                                            setShowBankModal(false);
                                        }}
                                        style={{
                                            padding: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#F0F0F0',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                                {bank.name}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                                Account: {bank.accountNumber}
                                            </Text>
                                        </View>
                                        {selectedBank?.id === bank.id && (
                                            <Ionicons name="checkmark-circle" size={24} color="#8E6652" />
                                        )}
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
                    disabled={processing || uploadingReceipt}
                    style={{
                        backgroundColor: (processing || uploadingReceipt) ? '#ccc' : '#8E6652',
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
                    {(processing || uploadingReceipt) ? (
                        <>
                            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
                            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>
                                {uploadingReceipt ? 'Uploading Receipt...' : 'Processing...'}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', marginRight: 8 }}>
                                Continue to Payment
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
