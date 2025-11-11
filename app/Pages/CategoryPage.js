import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../_redux/Slices/HomeDataSlice';
import { saveCartToFirebase } from '../Helper/firebaseHelper';
import { getProductsByCategoryName, getCategories } from '../Helper/firebaseHelper';

const { width } = Dimensions.get('window');

const CategoryPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { category } = route.params || {};
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState(null);

    // Get cart items from Redux
    const cartItems = useSelector((state) => state.home.cart || []);

    useEffect(() => {
        fetchCategoryData();
    }, [category]);

    const fetchCategoryData = async () => {
        try {
            setLoading(true);

            // First, find the category info by name
            const categories = await getCategories();
            const foundCategory = categories.find(cat =>
                cat.title.toLowerCase() === category.toLowerCase()
            );

            if (foundCategory) {
                setCategoryInfo(foundCategory);

                // Fetch products for this category
                const categoryProducts = await getProductsByCategoryName(foundCategory.title);
                setProducts(categoryProducts);
            }
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        // Add product to cart in Redux
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            securityFee: product.securityFee,
            imageUrl: product.imageUrl,
            categoryName: product.categoryName,
            sellerId: product.sellerId,
            size: 'M', // Default size, can be modified later
            quantity: 1
        }));

        // Save to Firebase
        const user = useSelector((state) => state.home.user);
        if (user?.uid) {
            const updatedCart = useSelector((state) => state.home.cart);
            try {
                await saveCartToFirebase(user.uid, updatedCart);
            } catch (error) {
                console.error('Error saving cart to Firebase:', error);
            }
        }
    };

    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    const renderProduct = ({ item }) => (
        <View
            style={{
                width: (width - 40) / 2,
                margin: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}
        >
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{
                        width: '100%',
                        height: 150,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>
                    {item.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#666', marginBottom: 3 }}>
                    {item.categoryName}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8E6652' }}>
                    Rs: {item.price}
                </Text>
                <Text style={{ fontSize: 12, color: '#999', marginTop: 3 }}>
                    Security Fee: Rs {item.securityFee}
                </Text>

                {/* Add to Cart Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: isInCart(item.id) ? '#28a745' : '#8E6652',
                        padding: 8,
                        borderRadius: 5,
                        marginTop: 8,
                        alignItems: 'center'
                    }}
                     onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                        {isInCart(item.id) ? 'Added to Cart' : 'Add to Cart'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text>Loading products...</Text>
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
                alignItems: 'center',
                justifyContent: 'space-between'
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
                    {categoryInfo?.title || category}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Cart')}
                    style={{ position: 'relative' }}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>🛒</Text>
                    {cartItems.length > 0 && (
                        <View style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: '#ff4444',
                            borderRadius: 10,
                            width: 18,
                            height: 18,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                                {cartItems.length}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Products List */}
            {products.length > 0 ? (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{
                        padding: 10,
                    }}
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
                        No products found in this category
                    </Text>
                    <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 10 }}>
                        Products will appear here once sellers add them to this category
                    </Text>
                </View>
            )}
        </View>
    );
};

export default CategoryPage;
