import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getBanks, initializePakistanBanks, uploadImageToCloudinary } from '../Helper/firebaseHelper';

const Payment = ({ navigation }) => {
    const route = useRoute();
    const { shippingInfo, orderTotal, paymentMethod: initialPaymentMethod, selectedBank: initialSelectedBank, receiptUrl: initialReceiptUrl } = route.params || {};
    
    const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || 'cod'); // 'cod' or 'bank'
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(initialSelectedBank || null);
    const [showBankModal, setShowBankModal] = useState(false);
    const [screenshotUri, setScreenshotUri] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState(initialReceiptUrl || null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            setLoading(true);
            // First try to get banks
            let fetchedBanks = await getBanks();
            
            // If no banks exist, initialize them
            if (fetchedBanks.length === 0) {
                console.log('No banks found, initializing Pakistan banks...');
                await initializePakistanBanks();
                fetchedBanks = await getBanks();
            }
            
            setBanks(fetchedBanks);
        } catch (error) {
            console.error('Error fetching banks:', error);
            Alert.alert('Error', 'Failed to load banks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera roll permissions to upload screenshot.');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setScreenshotUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const takePhoto = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
                return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setScreenshotUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Upload Transaction Screenshot',
            'Choose an option',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handlePlaceOrder = async () => {
        // Validate payment method requirements
        if (paymentMethod === 'bank') {
            if (!selectedBank) {
                Alert.alert('Required', 'Please select a bank.');
                return;
            }
            if (!screenshotUri) {
                Alert.alert('Required', 'Please upload transaction screenshot.');
                return;
            }
        }

        try {
            setUploading(true);
            
            let screenshotUrl = null;
            
            // Upload screenshot if bank transfer is selected
            if (paymentMethod === 'bank' && screenshotUri) {
                try {
                    const timestamp = Date.now();
                    screenshotUrl = await uploadImageToCloudinary(
                        screenshotUri,
                        'my-app/payments/transactions',
                        `transaction_${timestamp}.jpg`
                    );
                    console.log('Screenshot uploaded:', screenshotUrl);
                } catch (error) {
                    console.error('Error uploading screenshot:', error);
                    Alert.alert('Error', 'Failed to upload screenshot. Please try again.');
                    setUploading(false);
                    return;
                }
            }

            // Navigate to Order page with payment info
            navigation.navigate("Order", {
                paymentMethod,
                selectedBank: selectedBank ? {
                    id: selectedBank.id,
                    name: selectedBank.name,
                    accountNumber: selectedBank.accountNumber,
                    accountTitle: selectedBank.accountTitle
                } : null,
                screenshotUrl: screenshotUrl || receiptUrl,
                shippingInfo,
                orderTotal
            });
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setUploading(false);
        }
    };

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
                    onPress={() => navigation.goBack()}
                    style={{ marginRight: 15 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 }}>
                    Payment Method
                </Text>
            </View>

            {loading ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8E6652" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading payment options...</Text>
                </View>
            ) : (
                <>
                    {/* Cash on Delivery Option */}
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('cod')}
                        style={{
                            margin: 15,
                            padding: 20,
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: paymentMethod === 'cod' ? '#8E6652' : '#E0E0E0',
                            elevation: paymentMethod === 'cod' ? 3 : 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <FontAwesome5 name="motorcycle" size={30} color={paymentMethod === 'cod' ? '#8E6652' : '#666'} />
                                <Text style={{ fontSize: 17, marginLeft: 15, color: paymentMethod === 'cod' ? '#8E6652' : '#333', fontWeight: paymentMethod === 'cod' ? 'bold' : 'normal' }}>
                                    Cash on Delivery
                                </Text>
                            </View>
                            {paymentMethod === 'cod' && (
                                <View style={{ height: 40, width: 40, backgroundColor: "#8E6652", borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="checkmark" size={24} color="white" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Bank Transfer Option */}
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('bank')}
                        style={{
                            margin: 15,
                            marginTop: 0,
                            padding: 20,
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: paymentMethod === 'bank' ? '#8E6652' : '#E0E0E0',
                            elevation: paymentMethod === 'bank' ? 3 : 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Ionicons name="card" size={30} color={paymentMethod === 'bank' ? '#8E6652' : '#666'} />
                                <Text style={{ fontSize: 17, marginLeft: 15, color: paymentMethod === 'bank' ? '#8E6652' : '#333', fontWeight: paymentMethod === 'bank' ? 'bold' : 'normal' }}>
                                    Bank Transfer
                                </Text>
                            </View>
                            {paymentMethod === 'bank' && (
                                <View style={{ height: 40, width: 40, backgroundColor: "#8E6652", borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="checkmark" size={24} color="white" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Bank Transfer Details */}
                    {paymentMethod === 'bank' && (
                        <View style={{ margin: 15, marginTop: 0, padding: 20, backgroundColor: '#fff', borderRadius: 12 }}>
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

                            {/* Screenshot Upload */}
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
                                    Transaction Screenshot *
                                </Text>
                                {screenshotUri ? (
                                    <View style={{ marginBottom: 10 }}>
                                        <Image
                                            source={{ uri: screenshotUri }}
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
                                                Change Screenshot
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
                                            Upload Transaction Screenshot
                                        </Text>
                                        <Text style={{ marginTop: 5, fontSize: 12, color: '#999' }}>
                                            Tap to select from gallery or camera
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Place Order Button */}
                    <View style={{ backgroundColor: 'white', padding: 30, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={handlePlaceOrder}
                            disabled={uploading}
                            style={{
                                height: 50,
                                backgroundColor: uploading ? '#ccc' : "#8E6652",
                                justifyContent: 'center',
                                width: 300,
                                alignItems: 'center',
                                borderRadius: 20,
                                flexDirection: 'row'
                            }}
                        >
                            {uploading ? (
                                <>
                                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
                                    <Text style={{ fontSize: 18, color: 'white' }}>Processing...</Text>
                                </>
                            ) : (
                                <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>
                                    Place my order
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}

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
                            {banks.map((bank) => (
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
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

export default Payment
