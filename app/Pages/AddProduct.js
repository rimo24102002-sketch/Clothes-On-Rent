import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { addProduct, uploadImageToCloudinary, getProductCategories, getCategoryById } from '../Helper/firebaseHelper';
import Header from '../Components/Header';

export default function AddProduct({ navigation }) {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || '';
  const [form, setForm] = useState({
    name: '',
    price: '',
    categoryId: '',
    categoryName: '',
    securityFee: '',
    sizesText: 'S, M, L',
    description: ''
  });
  
  const [sizeStock, setSizeStock] = useState({
    'S': 5,
    'M': 5, 
    'L': 5
  });
  
  const [imageUri, setImageUri] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  
  const categories = getProductCategories();

  const pickImage = async () => {
    try {
      setImageLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(uri);
        setImageUrl(cloudinaryUrl);
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setImageLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(uri);
        setImageUrl(cloudinaryUrl);
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleAddProduct = async () => {
    console.log('=== ADD PRODUCT DEBUG ===');
    console.log('Seller ID:', sellerId);
    console.log('Form data:', form);
    console.log('Image URL:', imageUrl);
    
    // Validation
    if (!sellerId) {
      Alert.alert('Error', 'Seller ID not found. Please login again.');
      return;
    }
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter product name');
      return;
    }
    if (!form.price.trim()) {
      Alert.alert('Error', 'Please enter product price');
      return;
    }
    if (!form.categoryId) {
      Alert.alert('Error', 'Please select a product category');
      return;
    }
    if (!imageUrl) {
      Alert.alert('Error', 'Please add a product image');
      return;
    }

    try {
      setLoading(true);
      
      const sizes = form.sizesText.split(',').map(s => s.trim()).filter(Boolean);
      
      const productData = {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        categoryId: form.categoryId,
        categoryName: form.categoryName,
        category: form.categoryName, // Keep for backward compatibility
        securityFee: Number(form.securityFee) || 0,
        sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L'],
        description: form.description.trim(),
        imageUrl: imageUrl,
        createdAt: Date.now(),
        // Size availability and stock data
        sizeStock: sizeStock,
        sizeAvailability: Object.keys(sizeStock).reduce((acc, size) => {
          acc[size] = sizeStock[size] > 0; // Available if stock > 0
          return acc;
        }, {}),
        totalStock: Object.values(sizeStock).reduce((total, stock) => total + stock, 0)
      };

      console.log('Product data to save:', productData);
      const productId = await addProduct(sellerId, productData);
      console.log('Product added with ID:', productId);
      
      Alert.alert(
        'Success', 
        'Product added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
      
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header 
        title="Add New Product"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Image Upload Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 }}>Product Image *</Text>
          
          <View style={{ 
            width: '100%', 
            height: 200, 
            backgroundColor: '#F0F0F0', 
            borderRadius: 12, 
            justifyContent: 'center', 
            alignItems: 'center',
            borderWidth: 2,
            borderColor: imageUri ? '#8E6652' : '#E0E0E0',
            borderStyle: 'dashed'
          }}>
            {imageLoading ? (
              <ActivityIndicator size="large" color="#8E6652" />
            ) : imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Feather name="camera" size={40} color="#8E6652" />
              </View>
            )}
          </View>

          {/* Image Action Buttons */}
          <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
            <TouchableOpacity 
              onPress={pickImage}
              disabled={imageLoading}
              style={{ 
                flex: 1, 
                backgroundColor: '#8E6652', 
                paddingVertical: 12, 
                borderRadius: 8, 
                alignItems: 'center' 
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="image" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 6 }}>Gallery</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={takePhoto}
              disabled={imageLoading}
              style={{ 
                flex: 1, 
                backgroundColor: '#28A745', 
                paddingVertical: 12, 
                borderRadius: 8, 
                alignItems: 'center' 
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="camera" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 6 }}>Camera</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Details Form */}
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16 }}>Product Details</Text>
          
          {/* Product Name */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 }}>Product Name *</Text>
            <TextInput
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Enter product name"
              style={{
                borderWidth: 1,
                borderColor: '#E0E0E0',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                backgroundColor: '#F8F9FA'
              }}
            />
          </View>

          {/* Category Selector */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 }}>Category *</Text>
            <TouchableOpacity
              onPress={() => setCategoryModalVisible(true)}
              style={{
                borderWidth: 1,
                borderColor: form.categoryId ? '#8E6652' : '#E0E0E0',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                backgroundColor: '#F8F9FA',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {form.categoryId ? (
                  <>
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: getCategoryById(form.categoryId)?.color || '#8E6652',
                      marginRight: 8
                    }} />
                    <View>
                      <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>
                        {form.categoryName}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        ID: {form.categoryId}
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={{ fontSize: 14, color: '#999' }}>Select a category</Text>
                )}
              </View>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Price and Security Fee */}
          <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 }}>Price ($) *</Text>
              <TextInput
                value={form.price}
                onChangeText={(text) => setForm({ ...form, price: text })}
                placeholder="0.00"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  backgroundColor: '#F8F9FA'
                }}
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 }}>Security Fee ($)</Text>
              <TextInput
                value={form.securityFee}
                onChangeText={(text) => setForm({ ...form, securityFee: text })}
                placeholder="0.00"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  backgroundColor: '#F8F9FA'
                }}
              />
            </View>
          </View>

          {/* Available Sizes with Stock */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 }}>Available Sizes & Stock</Text>
            <TextInput
              value={form.sizesText}
              onChangeText={(text) => {
                setForm({ ...form, sizesText: text });
                // Update stock state when sizes change
                const newSizes = text.split(',').map(s => s.trim()).filter(Boolean);
                const newSizeStock = {};
                newSizes.forEach(size => {
                  newSizeStock[size] = sizeStock[size] || 5; // Default stock of 5
                });
                setSizeStock(newSizeStock);
              }}
              placeholder="S, M, L, XL"
              style={{
                borderWidth: 1,
                borderColor: '#E0E0E0',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                backgroundColor: '#F8F9FA'
              }}
            />
            <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              Separate sizes with commas (e.g., S, M, L, XL)
            </Text>
            
            {/* Size Stock Management */}
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8 }}>Stock Quantity for Each Size:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {form.sizesText.split(',').map(size => size.trim()).filter(Boolean).map((size, idx) => (
                  <View key={idx} style={{ 
                    backgroundColor: '#F8F9FA', 
                    borderRadius: 8, 
                    padding: 8, 
                    borderWidth: 1, 
                    borderColor: '#E0E0E0',
                    minWidth: 80,
                    alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 4 }}>{size}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity 
                        style={{ 
                          backgroundColor: '#8E6652', 
                          borderRadius: 12, 
                          width: 24, 
                          height: 24, 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}
                        onPress={() => {
                          const newStock = Math.max(0, (sizeStock[size] || 0) - 1);
                          setSizeStock(prev => ({ ...prev, [size]: newStock }));
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>-</Text>
                      </TouchableOpacity>
                      
                      <Text style={{ 
                        marginHorizontal: 12, 
                        fontSize: 14, 
                        fontWeight: '600', 
                        color: '#333',
                        minWidth: 20,
                        textAlign: 'center'
                      }}>
                        {sizeStock[size] || 0}
                      </Text>
                      
                      <TouchableOpacity 
                        style={{ 
                          backgroundColor: '#8E6652', 
                          borderRadius: 12, 
                          width: 24, 
                          height: 24, 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}
                        onPress={() => {
                          const newStock = (sizeStock[size] || 0) + 1;
                          setSizeStock(prev => ({ ...prev, [size]: newStock }));
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>+</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Stock Status Indicator */}
                    <View style={{ 
                      marginTop: 4, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2, 
                      borderRadius: 8,
                      backgroundColor: (sizeStock[size] || 0) === 0 ? '#FFE5E5' : 
                                     (sizeStock[size] || 0) <= 3 ? '#FFF3CD' : '#D4EDDA'
                    }}>
                      <Text style={{ 
                        fontSize: 8, 
                        fontWeight: '600',
                        color: (sizeStock[size] || 0) === 0 ? '#721C24' : 
                               (sizeStock[size] || 0) <= 3 ? '#856404' : '#155724'
                      }}>
                        {(sizeStock[size] || 0) === 0 ? 'Out of Stock' : 
                         (sizeStock[size] || 0) <= 3 ? 'Low Stock' : 'In Stock'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 }}>Description</Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              placeholder="Describe your product..."
              multiline
              numberOfLines={4}
              style={{
                borderWidth: 1,
                borderColor: '#E0E0E0',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                backgroundColor: '#F8F9FA',
                textAlignVertical: 'top'
              }}
            />
          </View>
        </View>

        {/* Add Product Button */}
        <TouchableOpacity 
          onPress={handleAddProduct}
          disabled={loading}
          style={{ 
            backgroundColor: loading ? '#ccc' : '#8E6652', 
            paddingVertical: 16, 
            borderRadius: 12, 
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>Adding Product...</Text>
            </View>
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Add Product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'flex-end' 
        }}>
          <View style={{ 
            backgroundColor: '#fff', 
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20, 
            padding: 20,
            maxHeight: '70%'
          }}>
            {/* Modal Header */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#F0F0F0'
            }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>
                Select Category
              </Text>
              <TouchableOpacity 
                onPress={() => setCategoryModalVisible(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F8F9FA',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Ionicons name="close" size={18} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Categories List */}
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setForm({
                      ...form,
                      categoryId: item.id,
                      categoryName: item.name
                    });
                    setCategoryModalVisible(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    marginBottom: 8,
                    borderRadius: 12,
                    backgroundColor: form.categoryId === item.id ? '#F0F7FF' : '#F8F9FA',
                    borderWidth: 1,
                    borderColor: form.categoryId === item.id ? '#8E6652' : '#E0E0E0'
                  }}
                >
                  {/* Category Color Indicator */}
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: item.color,
                    marginRight: 12
                  }} />
                  
                  {/* Category Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '600', 
                      color: '#333',
                      marginBottom: 2
                    }}>
                      {item.name}
                    </Text>
                    <Text style={{ 
                      fontSize: 12, 
                      color: '#666',
                      marginBottom: 2
                    }}>
                      ID: {item.id}
                    </Text>
                    <Text style={{ 
                      fontSize: 13, 
                      color: '#888'
                    }}>
                      {item.description}
                    </Text>
                  </View>

                  {/* Selection Indicator */}
                  {form.categoryId === item.id && (
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#8E6652',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
