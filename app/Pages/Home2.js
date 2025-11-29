import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import Icon from 'react-native-vector-icons/Ionicons';
import { getAllProducts, getCategories, getSellerData, getAllData } from '../Helper/firebaseHelper';

const { width } = Dimensions.get("window");

const Home2 = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [sellersInfo, setSellersInfo] = useState({}); // Store seller info by sellerId
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [sliderImages, setSliderImages] = useState([]);
    const [slidersLoading, setSlidersLoading] = useState(true);

    // Fallback images if no sliders are found
    const fallbackImages = [
        require("./Slide.png"),
        require("./Slider3.png"),
        require("./Slide4.png"),
    ];

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchSliders();
    }, []);

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await getCategories();
            console.log("Categories:", fetchedCategories);
            
            // Filter out categories without name or title
            const validCategories = fetchedCategories.filter(cat => cat.name || cat.title);
            setCategories(validCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            const fetchedProducts = await getAllProducts();
            
            // Filter only approved products
            const approvedProducts = fetchedProducts.filter(p => p.status === 'approved');
            console.log("Products:", approvedProducts.length);
            
            setProducts(approvedProducts);

            // Fetch seller info for unique sellerIds
            const uniqueSellerIds = [...new Set(approvedProducts.map(p => p.sellerId).filter(Boolean))];
            const sellerInfoMap = {};
            
            for (const sellerId of uniqueSellerIds) {
                try {
                    const sellerInfo = await getSellerData(sellerId);
                    if (sellerInfo) {
                        sellerInfoMap[sellerId] = sellerInfo;
                    }
                } catch (error) {
                    console.error(`Error fetching seller info for ${sellerId}:`, error);
                }
            }
            
            setSellersInfo(sellerInfoMap);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchSliders = async () => {
        try {
            setSlidersLoading(true);
            const fetchedSliders = await getAllData('sliders');
            
            // Filter only active sliders and sort by order
            const activeSliders = fetchedSliders
                .filter(slider => slider.isActive === true && slider.imageUrl)
                .sort((a, b) => {
                    // Sort by order field (ascending), if order is same, sort by createdAt
                    const orderA = a.order || 0;
                    const orderB = b.order || 0;
                    if (orderA !== orderB) {
                        return orderA - orderB;
                    }
                    // If order is same, sort by createdAt (newest first)
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
            
            console.log("Active Sliders:", activeSliders.length);
            
            // Map to image URLs for carousel
            const sliderUrls = activeSliders.map(slider => ({
                uri: slider.imageUrl,
                id: slider.id
            }));
            
            setSliderImages(sliderUrls.length > 0 ? sliderUrls : fallbackImages);
        } catch (error) {
            console.error('Error fetching sliders:', error);
            // Use fallback images on error
            setSliderImages(fallbackImages);
        } finally {
            setSlidersLoading(false);
        }
    };

    const handleCategoryPress = (category) => {
        const categoryName = category.title || category.name;
        if (!category || !categoryName) {
            console.error('Category or category name is undefined');
            return;
        }
        navigation.navigate('Category', { category: categoryName.toLowerCase() });
    };

    const getCategoryImage = (category) => {
        if (!category) {
            return require('./pic.png');
        }
        
        const categoryName = category.title || category.name;
        if (!categoryName) {
            return require('./pic.png');
        }

        const categoryImages = {
            'Mehndi': require('./pic.png'),
            'Barat': require('./pic2.png'),
            'Walima': require('./pic3.png'),
            'Festival': require('./pic4.png'),
        };

        return categoryImages[categoryName] || require('./pic.png');
    };

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { productId: product.id });
    };

    const renderProduct = ({ item }) => {
        const sellerInfo = sellersInfo[item.sellerId] || {};
        return (
            <TouchableOpacity
                onPress={() => handleProductPress(item)}
                style={{
                    width: (width - 40) / 2,
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    margin: 8,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    overflow: 'hidden'
                }}
            >
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{
                        width: '100%',
                        height: 180,
                        backgroundColor: '#f0f0f0'
                    }}
                    resizeMode="cover"
                />
                <View style={{ padding: 12 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: 4
                        }}
                        numberOfLines={1}
                    >
                        {item.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#666',
                            marginBottom: 6
                        }}
                        numberOfLines={1}
                    >
                        {item.categoryName || 'Uncategorized'}
                    </Text>
                    {sellerInfo.shopName && (
                        <Text
                            style={{
                                fontSize: 11,
                                color: '#8E6652',
                                marginBottom: 4
                            }}
                            numberOfLines={1}
                        >
                            By: {sellerInfo.shopName}
                        </Text>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8E6652' }}>
                            Rs {item.price}
                        </Text>
                        {item.securityFee > 0 && (
                            <Text style={{ fontSize: 11, color: '#999' }}>
                                Security: Rs {item.securityFee}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fdfdfdff" }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fdfdfdff" }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#8E6652',
                padding: 15,
                paddingTop: 50,
                flexDirection: 'row',
                alignItems: 'center',
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
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                    flex: 1,
                    textAlign: 'center',
                    marginRight: 39
                }}>
                    Home
                </Text>
            </View>

            <ScrollView 
                style={{ flex: 1 }} 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {/* Carousel */}
                <View style={{ justifyContent: "center", marginTop: 10 }}>
                    {slidersLoading ? (
                        <View style={{ 
                            height: 200, 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginHorizontal: 20,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 12
                        }}>
                            <ActivityIndicator size="large" color="#8E6652" />
                            <Text style={{ marginTop: 10, color: '#666' }}>Loading sliders...</Text>
                        </View>
                    ) : sliderImages.length > 0 ? (
                    <Carousel 
                        loop 
                        width={width} 
                        height={200} 
                        autoPlay={true} 
                            data={sliderImages} 
                        scrollAnimationDuration={1000} 
                        renderItem={({ item }) => (
                            <Image 
                                    source={typeof item === 'object' && item.uri ? { uri: item.uri } : item} 
                                style={{ width: "90%", height: "100%", borderRadius: 12, marginBottom: 40, marginHorizontal: 20 }} 
                                resizeMode="cover" 
                            />
                        )} 
                    />
                    ) : (
                        <View style={{ 
                            height: 200, 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginHorizontal: 20,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 12
                        }}>
                            <Text style={{ color: '#666' }}>No slider images available</Text>
                        </View>
                    )}
                </View>

                {/* Categories Section */}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginBottom: 10 }}>
                    Categories
                </Text>
                <View style={{ 
                    flexDirection: 'row', 
                    flexWrap: 'wrap', 
                    justifyContent: 'flex-start', 
                    marginTop: 5, 
                    paddingHorizontal: 10,
                    marginBottom: 20
                }}>
                    {categories.map((category) => {
                        const categoryName = category.title || category.name;
                        if (!categoryName) {
                            return null;
                        }
                        return (
                            <View key={category.cid || category.id} style={{ alignItems: "center", marginBottom: 15, width: '25%' }}>
                                <TouchableOpacity onPress={() => handleCategoryPress(category)}>
                                    <Image
                                        source={getCategoryImage(category)}
                                        style={{ width: 60, height: 60, borderRadius: 30 }}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 12, marginTop: 5, textAlign: 'center' }} numberOfLines={2}>
                                    {categoryName}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Products Section */}
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                            Featured Products
                        </Text>
                        {productsLoading && (
                            <ActivityIndicator size="small" color="#8E6652" />
                        )}
                    </View>

                    {productsLoading ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#8E6652" />
                            <Text style={{ marginTop: 10, color: '#666' }}>Loading products...</Text>
                        </View>
                    ) : products.length === 0 ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Icon name="cube-outline" size={48} color="#999" />
                            <Text style={{ marginTop: 10, color: '#666', fontSize: 14 }}>
                                No products available
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={products}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            scrollEnabled={false}
                            contentContainerStyle={{
                                paddingHorizontal: 12,
                                paddingBottom: 10
                            }}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Home2;
