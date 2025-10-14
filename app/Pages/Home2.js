import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from "react-native-reanimated-carousel";
import { useNavigation } from '@react-navigation/native';
import { getCategories } from '../Helper/firebaseHelper';

const { width } = Dimensions.get("window");

const Home2 = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const images = [
        require("./Slide.png"),
        require("./Slider3.png"),
        require("./Slide4.png"),
    ];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category) => {
        // Navigate to category page using React Navigation
        navigation.navigate('Category', { category: category.title.toLowerCase() });
    };

    const getCategoryImage = (category) => {
        console.log('Category title:', category.title);// Debug log

        const categoryImages = {
            'Mehndi': require('./pic.png'),      // Mehndi uses pic.png
            'Barat': require('./pic2.png'),
            'Walima': require('./pic3.png'),
            'Festival': require('./pic4.png'),   // Festival uses pic4.png
        };

        const selectedImage = categoryImages[category.title];
        console.log('Selected image for', category.title, ':', selectedImage ? 'Found' : 'Not found');

        return selectedImage || require('./pic.png'); // Default fallback to pic.png
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text>Loading categories...</Text>
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
                    onPress={() => navigation.goBack()}
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
                    marginRight: 39 // To center the title by compensating for back button width
                }}>
                    Home
                </Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Carousel loop width={width} height={200} autoPlay={true} data={images} scrollAnimationDuration={1000} renderItem={({ item }) => (
                        <Image source={item} style={{ width: "90%", height: "100%", borderRadius: 12, marginBottom: 40, marginHorizontal: 20, }} resizeMode="cover" />)} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, marginLeft: 20 }}>Categories</Text>

                {/* Dynamic Categories */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 15, paddingHorizontal: 10 }}>
                    {categories.map((category) => (
                        <View key={category.cid} style={{ alignItems: "center", marginBottom: 15, width: '25%' }}>
                            <TouchableOpacity onPress={() => handleCategoryPress(category)}>
                                <Image
                                    source={getCategoryImage(category)}
                                    style={{ width: 60, height: 60, borderRadius: 30 }}
                                />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 14, marginTop: 5, textAlign: 'center' }}>{category.title}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    )
}

export default Home2;
