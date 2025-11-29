import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getProductsByCategoryName, getCategories } from '../../../Helper/firebaseHelper';

const { width } = Dimensions.get('window');

const CategoryPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { category } = route.params || {};
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState(null);

    useEffect(() => {
        fetchCategoryData();
    }, [category]);

    const fetchCategoryData = async () => {
        try {
            setLoading(true);

            // Check if category parameter exists
            if (!category) {
                console.error('Category parameter is missing');
                setLoading(false);
                return;
            }

            // First, find the category info by name
            const categories = await getCategories();
            const foundCategory = categories.find(cat =>
                cat.title && category && cat.title.toLowerCase() === category.toLowerCase()
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

    const renderProduct = ({ item }) => (
        <TouchableOpacity
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
            onPress={() => navigation.navigate('Detail', { productId: item.id })}
        >
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
            </View>
        </TouchableOpacity>
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
                    <Text style={{ color: 'white', fontSize: 18 }}>←</Text>
                </TouchableOpacity>
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>
                    {categoryInfo?.title || category}
                </Text>
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
