import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StandardHeader from '../Components/StandardHeader';
import { addToCart } from '../Helper/firebaseHelper';
import { useSelector } from 'react-redux';

const Detail = ({ navigation, route }) => {
    const user = useSelector(state => state.home.user);
    const { product } = route.params || {};
    
    // State management
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Default product data if none provided
    const defaultProduct = {
        id: 'default-1',
        name: 'Flared Lehenga',
        price: 45000,
        images: [require("./local.png")],
        description: 'Beautiful flared lehenga perfect for special occasions',
        fabric: 'Pishwas/ Dupatta: Organza, Lehenga: Silk',
        colors: ['#4CAF50', '#9E9E9E', '#9C27B0'],
        sizes: ['S', 'M', 'L', 'XL'],
        rentalDuration: '7 Days',
        sellerId: 'default-seller',
        sellerName: 'Fashion Store'
    };

    const productData = product || defaultProduct;
    const availableSizes = productData.sizes || ['S', 'M', 'L', 'XL'];
    const availableColors = productData.colors || ['#4CAF50', '#9E9E9E', '#9C27B0'];

    useEffect(() => {
        // Set default selected size to first available size
        if (availableSizes.length > 0) {
            setSelectedSize(availableSizes[0]);
        }
    }, []);

    const handleAddToCart = async () => {
        if (!user?.uid) {
            Alert.alert("Login Required", "Please login to add items to cart.");
            return;
        }

        if (!selectedSize) {
            Alert.alert("Select Size", "Please select a size before adding to cart.");
            return;
        }

        try {
            setAddingToCart(true);
            
            await addToCart(user.uid, productData, selectedSize, 1);
            
            Alert.alert(
                "Added to Cart!",
                `${productData.name} (Size: ${selectedSize}) has been added to your cart.`,
                [
                    { text: "Continue Shopping", style: "default" },
                    { text: "View Cart", onPress: () => navigation.navigate("Cart") }
                ]
            );
            
        } catch (error) {
            console.error("Error adding to cart:", error);
            Alert.alert("Error", "Failed to add item to cart. Please try again.");
        } finally {
            setAddingToCart(false);
        }
    };

    const renderSizeOption = (size, index) => (
        <TouchableOpacity
            key={index}
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: selectedSize === size ? "#8E6652" : "#e8e5e5ff",
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10
            }}
            onPress={() => setSelectedSize(size)}
        >
            <Text style={{
                color: selectedSize === size ? 'white' : 'black',
                fontWeight: selectedSize === size ? 'bold' : 'normal'
            }}>
                {size}
            </Text>
        </TouchableOpacity>
    );

    const renderColorOption = (color, index) => (
        <TouchableOpacity
            key={index}
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: color,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
                borderWidth: selectedColor === index ? 3 : 0,
                borderColor: '#8E6652'
            }}
            onPress={() => setSelectedColor(index)}
        >
            {selectedColor === index && (
                <Icon name="check" size={20} color="white" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F1DCD1" }}>
            <StandardHeader 
                title="Product Details" 
                navigation={navigation}
                showBackButton={true}
            />
            
            <ScrollView style={{ flex: 1, backgroundColor: "#fefcfcff" }}>
                {/* Product Image */}
                <View style={{ width: "100%", height: 300, backgroundColor: "white", alignItems: 'center', justifyContent: 'center' }}>
                    <Image 
                        source={
                            productData.images && productData.images.length > 0 
                                ? (typeof productData.images[currentImageIndex] === 'string' 
                                    ? { uri: productData.images[currentImageIndex] } 
                                    : productData.images[currentImageIndex])
                                : require("./local.png")
                        }
                        style={{ width: '80%', height: '90%', borderRadius: 12 }} 
                        resizeMode="cover"
                    />
                    
                    {/* Try On Button */}
                    <TouchableOpacity 
                        style={{ 
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            backgroundColor: "#8E6652", 
                            paddingHorizontal: 15,
                            paddingVertical: 8,
                            borderRadius: 20
                        }}
                        onPress={() => navigation.navigate("VTO")}
                    >
                        <Text style={{ fontSize: 14, color: 'white', fontWeight: '600' }}>Try On</Text>
                    </TouchableOpacity>
                </View>

                {/* Product Info */}
                <View style={{ backgroundColor: 'white', padding: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                        {productData.name}
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8E6652', marginBottom: 4 }}>
                        Rs. {productData.price?.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
                        Rental Duration: {productData.rentalDuration || '7 Days'}
                    </Text>
                </View>

                {/* Description */}
                <View style={{ backgroundColor: 'white', padding: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>Description:</Text>
                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 12 }}>
                        {productData.description || 'Beautiful outfit perfect for special occasions'}
                    </Text>
                    
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>Fabric:</Text>
                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 12 }}>
                        {productData.fabric || 'Premium quality fabric with intricate details'}
                    </Text>
                    
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>Note:</Text>
                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
                        Dry Clean only. Colors can slightly vary from pictures depending upon your device settings.
                    </Text>
                </View>

                {/* Color and Size Selection */}
                <View style={{ backgroundColor: 'white', padding: 20, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Color</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Size</Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Colors */}
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            {availableColors.map((color, index) => renderColorOption(color, index))}
                        </View>
                        
                        {/* Sizes */}
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                            {availableSizes.map((size, index) => renderSizeOption(size, index))}
                        </View>
                    </View>
                </View>

                {/* Add to Cart Button */}
                <View style={{ backgroundColor: 'white', padding: 20, marginTop: 10, marginBottom: 20 }}>
                    <TouchableOpacity 
                        style={{ 
                            height: 50, 
                            backgroundColor: "#8E6652", 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 12,
                            opacity: addingToCart ? 0.7 : 1
                        }}
                        onPress={handleAddToCart}
                        disabled={addingToCart}
                    >
                        {addingToCart ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                                Add to Cart
                            </Text>
                        )}
                    </TouchableOpacity>
                    
                    {selectedSize && (
                        <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 8 }}>
                            Selected: Size {selectedSize}
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Detail
