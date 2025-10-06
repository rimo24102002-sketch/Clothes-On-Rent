import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import StandardHeader from '../Components/StandardHeader';
import { getCartItems, updateCartItem, removeFromCart, placeOrder } from '../Helper/firebaseHelper';
import { useSelector } from 'react-redux';

const Cart = ({navigation}) => {
    const user = useSelector(state => state.home.user);
    
    // State management
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            loadCartItems();
        }
    }, [user]);

    const loadCartItems = async () => {
        try {
            setLoading(true);
            const items = await getCartItems(user.uid);
            setCartItems(items);
        } catch (error) {
            console.error("Error loading cart items:", error);
            Alert.alert("Error", "Failed to load cart items.");
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCartItems();
        setRefreshing(false);
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            setUpdatingItem(itemId);
            await updateCartItem(itemId, { quantity: newQuantity });
            
            // Update local state
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
            Alert.alert("Error", "Failed to update quantity.");
        } finally {
            setUpdatingItem(null);
        }
    };

    const removeItem = async (itemId) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from cart?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Remove", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeFromCart(itemId);
                            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
                            Alert.alert("Success", "Item removed from cart.");
                        } catch (error) {
                            console.error("Error removing item:", error);
                            Alert.alert("Error", "Failed to remove item.");
                        }
                    }
                }
            ]
        );
    };

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 200 : 0; // Rs. 200 shipping fee
        const total = subtotal + shipping;
        
        return { subtotal, shipping, total };
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            Alert.alert("Empty Cart", "Please add items to cart before placing order.");
            return;
        }

        try {
            setPlacingOrder(true);
            
            const { subtotal, shipping, total } = calculateTotals();
            
            const orderData = {
                customerId: user.uid,
                customerName: user.displayName || user.name || 'Customer',
                customerEmail: user.email || '',
                items: cartItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    productImage: item.productImage,
                    price: item.price,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                    sellerId: item.sellerId,
                    sellerName: item.sellerName
                })),
                subtotal,
                shipping,
                total,
                status: 'pending_approval', // Requires seller approval
                paymentMethod: 'COD',
                orderDate: new Date().toISOString(),
                deliveryAddress: user.address || 'Address not provided'
            };

            const orderId = await placeOrder(orderData);
            
            // Clear cart after successful order
            setCartItems([]);
            
            Alert.alert(
                "Order Placed Successfully!",
                `Your order #${orderId} has been placed and is waiting for seller approval. You will be notified once the seller approves your order.`,
                [
                    { text: "View Orders", onPress: () => navigation.navigate("CPending") },
                    { text: "Continue Shopping", onPress: () => navigation.navigate("Home2") }
                ]
            );
            
        } catch (error) {
            console.error("Error placing order:", error);
            Alert.alert("Error", "Failed to place order. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    };

    const renderCartItem = (item) => (
        <View key={item.id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3D5C6", padding: 15, marginBottom: 10, borderRadius: 12, marginHorizontal: 15 }}>
            <Image 
                source={{ uri: item.productImage || 'https://via.placeholder.com/70x90' }} 
                style={{ width: 70, height: 90, borderRadius: 8, marginRight: 12 }} 
                resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold", color: '#333' }} numberOfLines={1}>
                    {item.productName}
                </Text>
                <Text style={{ fontSize: 14, color: "#8E6652", marginVertical: 2 }}>
                    Rs. {item.price?.toLocaleString()}
                </Text>
                <Text style={{ fontSize: 12, color: "gray", marginBottom: 8 }}>
                    Size: {item.selectedSize} | Seller: {item.sellerName}
                </Text>
                
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity 
                        style={{ width: 30, height: 28, borderWidth: 1, borderColor: "#8E6652", borderRadius: 15, alignItems: "center", justifyContent: "center" }}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingItem === item.id || item.quantity <= 1}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#8E6652" }}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={{ marginHorizontal: 15, fontSize: 16, fontWeight: '600' }}>
                        {updatingItem === item.id ? '...' : item.quantity}
                    </Text>
                    
                    <TouchableOpacity 
                        style={{ width: 30, height: 28, borderWidth: 1, borderColor: "#8E6652", borderRadius: 15, alignItems: "center", justifyContent: "center" }}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItem === item.id}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#8E6652" }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <TouchableOpacity 
                style={{ padding: 8 }}
                onPress={() => removeItem(item.id)}
            >
                <Ionicons name="trash-outline" size={22} color="#E74C3C" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F1DCD1" }}>
                <StandardHeader 
                    title="Your Cart" 
                    navigation={navigation}
                    showBackButton={false}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8E6652" />
                    <Text style={{ marginTop: 16, color: '#8E6652', fontSize: 16 }}>Loading cart...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { subtotal, shipping, total } = calculateTotals();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F1DCD1" }}>
            <StandardHeader 
                title="Your Cart" 
                navigation={navigation}
                showBackButton={false}
            />
            
            {cartItems.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Ionicons name="bag-outline" size={80} color="#ccc" />
                    <Text style={{ fontSize: 18, color: '#666', marginTop: 20, textAlign: 'center' }}>
                        Your cart is empty
                    </Text>
                    <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
                        Add some items from our collection
                    </Text>
                    <TouchableOpacity 
                        style={{ backgroundColor: '#8E6652', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 30 }}
                        onPress={() => navigation.navigate("Home2")}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView 
                    style={{ flex: 1, backgroundColor: "#fdfdfdff" }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8E6652']} />
                    }
                >
                    <View style={{ paddingTop: 20 }}>
                        {cartItems.map(item => renderCartItem(item))}
                    </View>
                    
                    {/* Order Summary */}
                    <View style={{ backgroundColor: 'white', margin: 15, borderRadius: 12, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>Order Summary</Text>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 16, color: '#666' }}>Subtotal ({cartItems.length} items)</Text>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Rs. {subtotal.toLocaleString()}</Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                            <Text style={{ fontSize: 16, color: '#666' }}>Shipping Fee</Text>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Rs. {shipping.toLocaleString()}</Text>
                        </View>
                        
                        <View style={{ borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Total</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8E6652' }}>Rs. {total.toLocaleString()}</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={{ 
                                height: 50, 
                                backgroundColor: "#8E6652", 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                borderRadius: 12,
                                opacity: placingOrder ? 0.7 : 1
                            }}
                            onPress={handlePlaceOrder}
                            disabled={placingOrder}
                        >
                            {placingOrder ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={{ fontSize: 18, color: '#fff', fontWeight: '600' }}>Place Order (COD)</Text>
                            )}
                        </TouchableOpacity>
                        
                        <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 10 }}>
                            ⚠️ Order requires seller approval before processing
                        </Text>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default Cart;
