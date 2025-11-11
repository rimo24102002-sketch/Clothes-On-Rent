import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItem, clearCart } from '../_redux/Slices/HomeDataSlice';
import { saveCartToFirebase, clearCartFromFirebase } from '../Helper/firebaseHelper';

const Cart = ({ navigation }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.home.cart || []);
    const user = useSelector((state) => state.home.user);

    useEffect(() => {
        console.log('🛒 Cart page loaded - Items count:', cartItems.length);
        console.log('🛒 Cart items:', cartItems);
    }, [cartItems]);

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(itemId));
        } else {
            dispatch(updateCartItem({ id: itemId, updates: { quantity: newQuantity } }));
        }

        // Save to Firebase after state update
        if (user?.uid) {
            try {
                // Get updated cart from Redux after dispatch
                setTimeout(async () => {
                    const currentCart = cartItems.filter(item => item.id !== itemId || newQuantity > 0);
                    if (newQuantity > 0) {
                        const updatedItem = currentCart.find(item => item.id === itemId);
                        if (updatedItem) updatedItem.quantity = newQuantity;
                    }
                    await saveCartToFirebase(user.uid, currentCart);
                }, 100);
            } catch (error) {
                console.error('Error saving cart to Firebase:', error);
            }
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
                    onPress: async () => {
                        dispatch(removeFromCart(itemId));

                        // Save to Firebase after removal
                        if (user?.uid) {
                            try {
                                setTimeout(async () => {
                                    const updatedCart = cartItems.filter(item => item.id !== itemId);
                                    await saveCartToFirebase(user.uid, updatedCart);
                                }, 100);
                            } catch (error) {
                                console.error('Error saving cart to Firebase:', error);
                            }
                        }
                    }
                }
            ]
        );
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateSecurityFees = () => {
        return cartItems.reduce((total, item) => total + (item.securityFee * item.quantity), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateSecurityFees();
    };

    const renderCartItem = (item) => (
        <View key={item.id} style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F3D5C6",
            padding: 10,
            marginBottom: 10,
            borderRadius: 10
        }}>
            <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 70, height: 90, borderRadius: 8, marginRight: 12 }}
                defaultSource={require('./Bold.png')}
            />
            <View style={{ backgroundColor: "#F3D5C6", flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: "gray", marginVertical: 5 }}>
                    Rs: {item.price}
                </Text>
                <Text style={{ fontSize: 12, color: "#8E6652", marginBottom: 5 }}>
                    Security Fee: Rs {item.securityFee}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                    <TouchableOpacity
                        style={{
                            width: 28,
                            height: 28,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 14,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 15, fontSize: 16 }}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={{
                            width: 28,
                            height: 28,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 14,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ fontSize: 14, marginHorizontal: 8 }}>{item.size}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#ff4444" />
            </TouchableOpacity>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "#F3D5C6"
            }}>
                <Ionicons name="cart-outline" size={80} color="#8E6652" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#8E6652' }}>
                    Your Cart is Empty
                </Text>
                <Text style={{ fontSize: 16, color: 'gray', marginTop: 10, textAlign: 'center' }}>
                    Add some beautiful outfits to your cart!
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#8E6652',
                        padding: 15,
                        borderRadius: 10,
                        marginTop: 20
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                        Continue Shopping
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: "#F3D5C6", flex: 1 }}>
            <View style={{ padding: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
                    Your Cart ({cartItems.length} items)
                </Text>

                {/* Cart Items */}
                {cartItems.map(renderCartItem)}

                {/* Order Summary */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 20,
                    marginTop: 20
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10
                    }}>
                        <Text style={{ fontSize: 16 }}>Subtotal:</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            Rs {calculateSubtotal().toLocaleString()}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10
                    }}>
                        <Text style={{ fontSize: 16 }}>Security Fees:</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            Rs {calculateSecurityFees().toLocaleString()}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        paddingTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#ddd'
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total:</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8E6652' }}>
                            Rs {calculateTotal().toLocaleString()}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Checkout")}
                        style={{
                            height: 50,
                            backgroundColor: "#8E6652",
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20
                        }}
                    >
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>
                            Proceed to Checkout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default Cart;
