import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { addProduct, uploadImageToCloudinary, getProductCategories } from '../Helper/firebaseHelper';

export default function AddProduct() {
  const router = useRouter();
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || '';
  
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [sizeStockModalVisible, setSizeStockModalVisible] = useState(false);
  
  const categories = getProductCategories();
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    securityFee: '',
    description: '',
    categoryId: '',
    categoryName: '',
    imageUrl: '',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: '', M: '', L: '', XL: '' }
  });

  const [tempStock, setTempStock] = useState({ S: '', M: '', L: '', XL: '' });

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setLoading(true);
        const imageUrl = await uploadImageToCloudinary(result.assets[0].uri);
        setForm({ ...form, imageUrl });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleCategorySelect = (category) => {
    setForm({ ...form, categoryId: category.id, categoryName: category.name });
    setCategoryModalVisible(false);
  };

  const handleSaveSizeStock = () => {
    setForm({ ...form, stock: { ...tempStock } });
    setSizeStockModalVisible(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name.trim()) {
      return Alert.alert('Error', 'Please enter product name');
    }
    if (!form.price || Number(form.price) <= 0) {
      return Alert.alert('Error', 'Please enter a valid price');
    }
    if (!form.categoryId) {
      return Alert.alert('Error', 'Please select a category');
    }
    if (!form.imageUrl) {
      return Alert.alert('Error', 'Please upload a product image');
    }

    // Check if at least one size has stock
    const hasStock = Object.values(form.stock).some(val => Number(val) > 0);
    if (!hasStock) {
      return Alert.alert('Error', 'Please add stock for at least one size');
    }

    try {
      setLoading(true);
      
      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        securityFee: Number(form.securityFee) || 0,
        description: form.description.trim(),
        categoryId: form.categoryId,
        categoryName: form.categoryName,
        imageUrl: form.imageUrl,
        sizes: form.sizes,
        stock: form.stock,
      };

      await addProduct(sellerId, productData);
      
      Alert.alert(
        'Product Submitted!',
        'Your product has been submitted and is pending admin approval. You will be notified once it is approved.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {/* Custom Header */}
      <View style={{ backgroundColor: '#8E6652', paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Add New Product</Text>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Image Upload */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Product Image *
          </Text>
          <TouchableOpacity
            onPress={handleImagePick}
            style={{
              width: '100%',
              height: 200,
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 2,
              borderColor: form.imageUrl ? '#8E6652' : '#ddd',
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            {form.imageUrl ? (
              <Image source={{ uri: form.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Feather name="image" size={40} color="#8E6652" />
                <Text style={{ marginTop: 8, color: '#8E6652', fontWeight: '600' }}>
                  Tap to upload image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Product Name */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Product Name *
          </Text>
          <TextInput
            placeholder="e.g., Bridal Lehenga"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              padding: 12,
              fontSize: 14
            }}
          />
        </View>

        {/* Category */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Category *
          </Text>
          <TouchableOpacity
            onPress={() => setCategoryModalVisible(true)}
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 14, color: form.categoryName ? '#333' : '#999' }}>
              {form.categoryName || 'Select category'}
            </Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          {form.categoryId && (
            <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                backgroundColor: categories.find(c => c.id === form.categoryId)?.color || '#8E6652',
                width: 12,
                height: 12,
                borderRadius: 6,
                marginRight: 6
              }} />
              <Text style={{ fontSize: 12, color: '#666' }}>
                {form.categoryId} - {form.categoryName}
              </Text>
            </View>
          )}
        </View>

        {/* Price */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Rental Price (per day) *
          </Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="0"
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })}
              keyboardType="numeric"
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                padding: 12,
                paddingLeft: 32,
                fontSize: 14
              }}
            />
            <Text style={{ position: 'absolute', left: 12, top: 12, fontSize: 14, color: '#666' }}>
              $
            </Text>
          </View>
        </View>

        {/* Security Fee */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Security Deposit
          </Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="0"
              value={form.securityFee}
              onChangeText={(text) => setForm({ ...form, securityFee: text })}
              keyboardType="numeric"
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                padding: 12,
                paddingLeft: 32,
                fontSize: 14
              }}
            />
            <Text style={{ position: 'absolute', left: 12, top: 12, fontSize: 14, color: '#666' }}>
              $
            </Text>
          </View>
        </View>

        {/* Sizes & Stock */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Available Sizes & Stock *
          </Text>
          <TouchableOpacity
            onPress={() => {
              setTempStock({ ...form.stock });
              setSizeStockModalVisible(true);
            }}
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 14, color: '#333' }}>
              Configure sizes and stock
            </Text>
            <Feather name="edit-2" size={18} color="#8E6652" />
          </TouchableOpacity>
          
          {/* Display current stock */}
          <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
            {form.sizes.map(size => {
              const stockQty = form.stock[size] || '0';
              return (
                <View 
                  key={size}
                  style={{
                    backgroundColor: Number(stockQty) > 0 ? '#E8F5E9' : '#FFEBEE',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#333', marginRight: 4 }}>
                    {size}:
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {stockQty} pcs
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Description
          </Text>
          <TextInput
            placeholder="Describe your product..."
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              textAlignVertical: 'top',
              height: 100
            }}
          />
        </View>

        {/* Info Banner */}
        <View style={{
          backgroundColor: '#FFF3CD',
          borderLeftWidth: 4,
          borderLeftColor: '#FFA500',
          padding: 12,
          borderRadius: 8,
          marginBottom: 20
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <MaterialIcons name="info-outline" size={18} color="#856404" />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#856404', marginLeft: 6 }}>
              Admin Approval Required
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#856404', lineHeight: 18 }}>
            Your product will be reviewed by admin before appearing in the marketplace. 
            This usually takes 24-48 hours.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#8E6652',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 40
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
              Submit Product for Approval
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '70%'
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategorySelect(category)}
                  style={{
                    backgroundColor: form.categoryId === category.id ? '#F1DCD1' : '#f9f9f9',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                    borderWidth: 2,
                    borderColor: form.categoryId === category.id ? '#8E6652' : 'transparent'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: category.color,
                      marginRight: 10
                    }} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>
                      {category.name}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#666',
                      marginLeft: 8,
                      backgroundColor: '#fff',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4
                    }}>
                      {category.id}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#666', marginLeft: 26 }}>
                    {category.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Size & Stock Modal */}
      <Modal
        visible={sizeStockModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSizeStockModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>
                Set Stock for Each Size
              </Text>
              <TouchableOpacity onPress={() => setSizeStockModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {form.sizes.map((size) => (
                <View key={size} style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                    Size {size}
                  </Text>
                  <TextInput
                    placeholder="Enter quantity"
                    value={tempStock[size]}
                    onChangeText={(text) => setTempStock({ ...tempStock, [size]: text })}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: '#f9f9f9',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 14
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={handleSaveSizeStock}
              style={{
                backgroundColor: '#8E6652',
                padding: 14,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 10
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Save Stock
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
