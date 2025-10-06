import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from "react-native-reanimated-carousel";
import StandardHeader from '../Components/StandardHeader';
import { getCategories, getAllProducts, getProductsByCategory, addToCart, getSliderImages } from '../Helper/firebaseHelper';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get("window");

const Home2 = ({ navigation }) => {
    const user = useSelector(state => state.home.user);
    
    // State management
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);
    const [sliderImages, setSliderImages] = useState([]);

    // Default fallback images
    const defaultImages = [
        require("./Slide.png"),
        require("./Slider3.png"),
        require("./Slide4.png"),
    ];

    useEffect(() => {
        loadData();
    }, []);

    // Default categories with local images
    const defaultCategories = [
        {
            id: 'mehndi',
            name: 'Mehndi',
            icon: 'flower-outline',
            image: require("./pic.png")
        },
        {
            id: 'barat',
            name: 'Barat',
            icon: 'diamond-outline',
            image: require("./pic2.png")
        },
        {
            id: 'walima',
            name: 'Walima',
            icon: 'heart-outline',
            image: require("./pic3.png")
        },
        {
            id: 'festive',
            name: 'Festive',
            icon: 'star-outline',
            image: require("./pic4.png")
        }
    ];

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load categories, products, and slider images in parallel
            const [categoriesData, productsData, slidersData] = await Promise.all([
                getCategories(),
                getAllProducts(),
                getSliderImages()
            ]);
            
            // Use Firebase categories if available, otherwise use default categories
            const categoriesToShow = categoriesData.length > 0 
                ? categoriesData.slice(0, 4) 
                : defaultCategories;
            
            setCategories(categoriesToShow);
            setProducts(productsData);
            setFilteredProducts(productsData);
            
            // Use Firebase slider images if available, otherwise use default images
            setSliderImages(slidersData.length > 0 ? slidersData : []);
            
        } catch (error) {
            console.error("Error loading data:", error);
            // Use default categories on error
            setCategories(defaultCategories);
            setSliderImages([]);
            Alert.alert("Error", "Failed to load data. Using default categories.");
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleCategoryPress = async (category) => {
        try {
            setSelectedCategory(category);
            setLoading(true);
            
            const categoryProducts = await getProductsByCategory(category.id);
            setFilteredProducts(categoryProducts);
            
        } catch (error) {
            console.error("Error filtering products:", error);
            Alert.alert("Error", "Failed to load category products.");
        } finally {
            setLoading(false);
        }
    };

    const handleShowAllProducts = async () => {
        try {
            setSelectedCategory(null);
            setLoading(true);
            
            const allProducts = await getAllProducts();
            setFilteredProducts(allProducts);
            
        } catch (error) {
            console.error("Error loading all products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        if (!user?.uid) {
            Alert.alert("Login Required", "Please login to add items to cart.");
            return;
        }

        try {
            setAddingToCart(product.id);
            
            // For now, we'll use the first available size or 'M' as default
            const defaultSize = product.sizes?.[0] || 'M';
            
            await addToCart(user.uid, product, defaultSize, 1);
            
            Alert.alert(
                "Success", 
                `${product.name} added to cart!`,
                [
                    { text: "Continue Shopping", style: "default" },
                    { text: "View Cart", onPress: () => navigation.navigate("Cart") }
                ]
            );
            
        } catch (error) {
            console.error("Error adding to cart:", error);
            Alert.alert("Error", "Failed to add item to cart. Please try again.");
        } finally {
            setAddingToCart(null);
        }
    };

    const renderProductCard = (product, index) => (
        <View key={product.id} style={{ width: "48%", marginBottom: 20, backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Detail", { product })}>
                <Image 
                    source={{ uri: product.images?.[0] || 'https://via.placeholder.com/200' }} 
                    style={{ width: "100%", height: 170, borderRadius: 8 }} 
                    resizeMode="cover"
                />
            </TouchableOpacity>
            
            <View style={{ paddingTop: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' }} numberOfLines={1}>
                    {product.name}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8E6652', textAlign: 'center', marginTop: 4 }}>
                    Rs. {product.price?.toLocaleString()}
                </Text>
                
                <TouchableOpacity 
                    style={{ 
                        backgroundColor: '#8E6652', 
                        paddingVertical: 8, 
                        borderRadius: 6, 
                        marginTop: 8,
                        opacity: addingToCart === product.id ? 0.7 : 1
                    }}
                    onPress={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                >
                    {addingToCart === product.id ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: '600' }}>
                            Add to Cart
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F1DCD1" }}>
                <StandardHeader 
                    title="Clothing Rental" 
                    navigation={navigation}
                    showBackButton={false}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8E6652" />
                    <Text style={{ marginTop: 16, color: '#8E6652', fontSize: 16 }}>Loading products...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F1DCD1" }}>
            <StandardHeader 
                title="Clothing Rental" 
                navigation={navigation}
                showBackButton={false}
            />
            <ScrollView 
                style={{ flex: 1, backgroundColor: "#fdfdfdff" }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8E6652']} />
                }
            >
                {/* Image Carousel */}
                <View style={{ flex: 1, justifyContent: "center" }}>
                    {sliderImages.length > 0 ? (
                        <Carousel 
                            loop 
                            width={width} 
                            height={200} 
                            autoPlay={true} 
                            data={sliderImages} 
                            scrollAnimationDuration={1000} 
                            renderItem={({ item }) => (
                                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                                    <Image 
                                        source={{ uri: item.imageUrl }} 
                                        style={{ width: "100%", height: "100%", borderRadius: 12 }} 
                                        resizeMode="cover" 
                                    />
                                    {item.title && (
                                        <View style={{ 
                                            position: 'absolute', 
                                            bottom: 20, 
                                            left: 30, 
                                            right: 30, 
                                            backgroundColor: 'rgba(0,0,0,0.6)', 
                                            borderRadius: 8, 
                                            padding: 10 
                                        }}>
                                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
                                                {item.title}
                                            </Text>
                                            {item.description && (
                                                <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
                                                    {item.description}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )} 
                        />
                    ) : (
                        <Carousel 
                            loop 
                            width={width} 
                            height={200} 
                            autoPlay={true} 
                            data={defaultImages} 
                            scrollAnimationDuration={1000} 
                            renderItem={({ item }) => (
                                <Image 
                                    source={item} 
                                    style={{ width: "90%", height: "100%", borderRadius: 12, marginBottom: 40, marginHorizontal: 20 }} 
                                    resizeMode="cover" 
                                />
                            )} 
                        />
                    )}
                </View>

                {/* Categories Section */}
                <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#333' }}>Categories</Text>
                        {selectedCategory && (
                            <TouchableOpacity onPress={handleShowAllProducts}>
                                <Text style={{ fontSize: 14, color: '#8E6652', fontWeight: '600' }}>Show All</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                            {categories.map((category, index) => (
                                <View key={category.id} style={{ alignItems: "center", marginRight: 20 }}>
                                    <TouchableOpacity 
                                        onPress={() => handleCategoryPress(category)}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 35,
                                            backgroundColor: selectedCategory?.id === category.id ? '#8E6652' : '#fff',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            elevation: 3,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                        }}
                                    >
                                        {category.image && typeof category.image === 'string' ? (
                                            // Firebase image (URL string)
                                            <Image 
                                                source={{ uri: category.image }} 
                                                style={{ width: 60, height: 60, borderRadius: 30 }} 
                                                resizeMode="cover"
                                            />
                                        ) : category.image ? (
                                            // Local image (require object)
                                            <Image 
                                                source={category.image} 
                                                style={{ width: 60, height: 60, borderRadius: 30 }} 
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            // Fallback icon
                                            <Icon 
                                                name={category.icon || "shirt-outline"} 
                                                size={30} 
                                                color={selectedCategory?.id === category.id ? '#fff' : '#8E6652'} 
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <Text style={{ 
                                        fontSize: 12, 
                                        marginTop: 8, 
                                        textAlign: 'center',
                                        color: selectedCategory?.id === category.id ? '#8E6652' : '#333',
                                        fontWeight: selectedCategory?.id === category.id ? '600' : '400'
                                    }}>
                                        {category.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Products Section */}
                <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: '#333', marginBottom: 15 }}>
                        {selectedCategory ? `${selectedCategory.name} Collection` : 'Featured Products'}
                    </Text>
                    
                    {filteredProducts.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                            <Icon name="shirt-outline" size={60} color="#ccc" />
                            <Text style={{ fontSize: 16, color: '#666', marginTop: 16 }}>
                                {selectedCategory ? 'No products found in this category' : 'No products available'}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {filteredProducts.map((product, index) => renderProductCard(product, index))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home2;
