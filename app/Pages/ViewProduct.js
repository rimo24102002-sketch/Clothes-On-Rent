import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput, Image, RefreshControl, Dimensions } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { listProductsBySeller, deleteProduct, updateProduct, uploadImageToCloudinary, getProductCategories, getCategoryById } from '../Helper/firebaseHelper';
import Header from '../Components/Header';

const { width } = Dimensions.get('window');

export default function Products({ navigation }) {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', categoryId: '', categoryName: '', securityFee: '', sizesText: '' });
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  
  const categories = getProductCategories();

  const load = async () => {
    try {
      setLoading(true);
      console.log('=== LOAD PRODUCTS DEBUG ===');
      console.log('Seller ID:', sellerId);
      
      if (!sellerId) {
        console.log('No seller ID found');
        return setProducts([]);
      }
      
      const list = await listProductsBySeller(sellerId);
      console.log('Products loaded:', list?.length || 0);
      console.log('Products data:', list);
      setProducts(list || []);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [sellerId]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      Alert.alert('Error', 'Failed to delete');
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={{ backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, borderWidth: 1, borderColor: '#F0F0F0' }}>
      {/* Product Image */}
      <View style={{ position: 'relative' }}>
        <View style={{ width: '100%', height: 220, backgroundColor: '#F8F9FA' }}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E6652' }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <MaterialIcons name="photo-camera" size={40} color="#fff" />
              </View>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>No Image</Text>
            </View>
          )}
        </View>
        
        {/* Category Badge */}
        <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: getCategoryById(item.categoryId)?.color || 'rgba(142, 102, 82, 0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>{item.categoryName || item.category || 'General'}</Text>
          {item.categoryId && (
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 8, fontWeight: '400', marginTop: 1 }}>{item.categoryId}</Text>
          )}
        </View>

        {/* Price Badge */}
        <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 25, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="attach-money" size={18} color="#4CAF50" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 2 }}>{item.price ?? 0}</Text>
        </View>
      </View>
      
      {/* Product Details */}
      <View style={{ padding: 16 }}>
        {/* Product Name and Category */}
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 4 }}>{item.name || 'Untitled Product'}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: getCategoryById(item.categoryId)?.color || '#8E6652',
            marginRight: 6
          }} />
          <Text style={{ fontSize: 14, color: '#8E6652', fontWeight: '500' }}>
            {item.categoryName || item.category || 'Uncategorized'}
          </Text>
          {item.categoryId && (
            <Text style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
              ({item.categoryId})
            </Text>
          )}
        </View>
        
        {/* Price and Security Fee */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8 }}>
          <View>
            <Text style={{ fontSize: 12, color: '#666', fontWeight: '500' }}>Price</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#27AE60', marginTop: 2 }}>${item.price ?? 0}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#666', fontWeight: '500' }}>Security Fee</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E74C3C', marginTop: 2 }}>${item.securityFee ?? 0}</Text>
          </View>
        </View>
        
        {/* Sizes with Availability */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6 }}>Available Sizes:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(item.sizes && item.sizes.length > 0 ? item.sizes : ['S', 'M', 'L']).map((size, idx) => {
              // Check if size is available (you can modify this logic based on your data structure)
              const isAvailable = item.sizeAvailability ? item.sizeAvailability[size] !== false : true;
              const stockCount = item.sizeStock ? item.sizeStock[size] || 0 : Math.floor(Math.random() * 10) + 1; // Random for demo
              
              return (
                <View 
                  key={idx} 
                  style={{ 
                    backgroundColor: isAvailable ? '#8E6652' : '#E0E0E0', 
                    paddingHorizontal: 10, 
                    paddingVertical: 4, 
                    borderRadius: 12, 
                    marginRight: 6, 
                    marginBottom: 4,
                    opacity: isAvailable ? 1 : 0.5,
                    position: 'relative',
                    borderWidth: isAvailable ? 0 : 1,
                    borderColor: '#999'
                  }}
                >
                  <Text style={{ 
                    color: isAvailable ? '#fff' : '#999', 
                    fontSize: 11, 
                    fontWeight: '600',
                    textDecorationLine: isAvailable ? 'none' : 'line-through'
                  }}>
                    {size}
                  </Text>
                  
                  {/* Cross mark for unavailable sizes */}
                  {!isAvailable && (
                    <View style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      backgroundColor: '#FF4444',
                      borderRadius: 8,
                      width: 14,
                      height: 14,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>✕</Text>
                    </View>
                  )}
                  
                  {/* Stock count for available sizes */}
                  {isAvailable && stockCount <= 3 && (
                    <View style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      backgroundColor: '#FF9500',
                      borderRadius: 8,
                      minWidth: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 2
                    }}>
                      <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>{stockCount}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          
          {/* Size Legend */}
          <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#8E6652', borderRadius: 6, marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: '#666' }}>Available</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, marginRight: 4, opacity: 0.5 }} />
              <Text style={{ fontSize: 10, color: '#666' }}>Out of Stock</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#FF9500', borderRadius: 6, marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: '#666' }}>Low Stock</Text>
            </View>
          </View>
        </View>
        
        {/* Description */}
        {item.description && (
          <View style={{ backgroundColor: '#F0F7FF', padding: 10, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#3498DB', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: '#2C3E50', lineHeight: 18 }} numberOfLines={2}>{item.description}</Text>
          </View>
        )}
      </View>
      
      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FAFAFA' }}>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: 'transparent' }} onPress={() => { setEditing(item); setEditForm({ name: item.name || '', price: String(item.price ?? ''), categoryId: item.categoryId || '', categoryName: item.categoryName || item.category || '', securityFee: String(item.securityFee ?? ''), sizesText: (item.sizes && item.sizes.length > 0) ? item.sizes.join(', ') : 'S, M, L' }); }}
        >
          <View style={{ backgroundColor: '#8E6652', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
            <Feather name="edit-2" size={16} color="#fff" />
          </View>
          <Text style={{ color: '#8E6652', fontWeight: '700', fontSize: 16 }}>Edit</Text>
        </TouchableOpacity>
        
        <View style={{ width: 1, backgroundColor: '#E0E0E0' }} />
        
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: 'transparent' }} onPress={() => { Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) }]); }}
        >
          <View style={{ backgroundColor: '#E74C3C', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
            <Feather name="trash-2" size={16} color="#fff" />
          </View>
          <Text style={{ color: '#E74C3C', fontWeight: '700', fontSize: 16 }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Enhanced Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#8E6652', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 10, shadowColor: '#8E6652', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 0.5, marginBottom: 4 }}>My Products</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="inventory" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginLeft: 6, fontWeight: '500' }}>{products.length} {products.length === 1 ? 'Product' : 'Products'}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={{ backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 }} onPress={handleAddProduct}>
          <Feather name="plus" size={26} color="#8E6652" />
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <FlatList data={products} renderItem={renderItem} keyExtractor={(item) => item.id || Math.random().toString()} contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8E6652']} tintColor="#8E6652" />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80, paddingHorizontal: 40 }}>
            {/* Empty State */}
            <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(142, 102, 82, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 3, borderColor: 'rgba(142, 102, 82, 0.2)', borderStyle: 'dashed' }}>
              <MaterialIcons name="inventory-2" size={50} color="#8E6652" />
            </View>
            
            <Text style={{ fontSize: 22, color: '#2C3E50', marginBottom: 12, textAlign: 'center', fontWeight: '700', letterSpacing: 0.5 }}>No Products Yet</Text>
            
            <Text style={{ fontSize: 16, color: '#7F8C8D', marginBottom: 32, textAlign: 'center', lineHeight: 24, fontWeight: '400' }}>Start building your inventory by adding your first product. It's quick and easy!</Text>
            
            <TouchableOpacity style={{ backgroundColor: '#8E6652', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 25, elevation: 6, shadowColor: '#8E6652', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8, flexDirection: 'row', alignItems: 'center' }} onPress={handleAddProduct}>
              <MaterialIcons name="add-circle" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16, marginLeft: 8, letterSpacing: 0.5 }}>Add Your First Product</Text>
            </TouchableOpacity>
            
            {/* Decorative Elements */}
            <View style={{ flexDirection: 'row', marginTop: 40, alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8E6652', marginHorizontal: 4 }} />
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(142, 102, 82, 0.6)', marginHorizontal: 4 }} />
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8E6652', marginHorizontal: 4 }} />
            </View>
          </View>
        } 
      />

      {/* Enhanced Edit Product Modal */}
      <Modal visible={!!editing} transparent onRequestClose={() => setEditing(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 24, maxHeight: '80%' }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#8E6652', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Feather name="edit-3" size={20} color="#fff" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#2C3E50', flex: 1 }}>Edit Product</Text>
              <TouchableOpacity onPress={() => setEditing(null)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' }}>
                <Feather name="x" size={18} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Form Fields */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Product Name</Text>
                <TextInput placeholder="Enter product name" value={editForm.name} onChangeText={(t) => setEditForm({ ...editForm, name: t })} style={{ borderWidth: 1, borderColor: '#E0E0E0', padding: 14, borderRadius: 12, fontSize: 16, backgroundColor: '#F8F9FA' }} />
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Price ($)</Text>
                  <TextInput placeholder="0.00" value={editForm.price} onChangeText={(t) => setEditForm({ ...editForm, price: t })} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#E0E0E0', padding: 14, borderRadius: 12, fontSize: 16, backgroundColor: '#F8F9FA' }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Security Fee ($)</Text>
                  <TextInput placeholder="0.00" value={editForm.securityFee} onChangeText={(t) => setEditForm({ ...editForm, securityFee: t })} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#E0E0E0', padding: 14, borderRadius: 12, fontSize: 16, backgroundColor: '#F8F9FA' }} />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Category</Text>
                <TouchableOpacity
                  onPress={() => setCategoryModalVisible(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: editForm.categoryId ? '#8E6652' : '#E0E0E0',
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: '#F8F9FA',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {editForm.categoryId ? (
                      <>
                        <View style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: getCategoryById(editForm.categoryId)?.color || '#8E6652',
                          marginRight: 8
                        }} />
                        <View>
                          <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>
                            {editForm.categoryName}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#666' }}>
                            ID: {editForm.categoryId}
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

              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Available Sizes</Text>
                <TextInput placeholder="S, M, L, XL" value={editForm.sizesText} onChangeText={(t) => setEditForm({ ...editForm, sizesText: t })} style={{ borderWidth: 1, borderColor: '#E0E0E0', padding: 14, borderRadius: 12, fontSize: 16, backgroundColor: '#F8F9FA' }} />
              </View>

              {/* Update Image Button */}
              <TouchableOpacity style={{ backgroundColor: '#F0F7FF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#3498DB', borderStyle: 'dashed' }} 
                onPress={async () => {
                  try {
                    const res = await ImagePicker.launchImageLibraryAsync({ 
                      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                      quality: 0.8,
                      allowsEditing: true,
                      aspect: [1, 1]
                    });
                    if (!res.canceled && res.assets?.length > 0) {
                      const url = await uploadImageToCloudinary(res.assets[0].uri);
                      await updateProduct(editing.id, { imageUrl: url });
                      await load();
                      Alert.alert('Success', 'Image updated successfully!');
                    }
                  } catch (e) { 
                    Alert.alert('Error', 'Failed to update image'); 
                  }
                }}
              >
                <MaterialIcons name="photo-camera" size={24} color="#3498DB" />
                <Text style={{ color: '#3498DB', fontWeight: '700', fontSize: 16, marginTop: 8 }}>Update Product Image</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <TouchableOpacity style={{ flex: 1, padding: 16, borderWidth: 2, borderRadius: 12, borderColor: '#E0E0E0', backgroundColor: '#F8F9FA', alignItems: 'center' }} onPress={() => setEditing(null)}>
                <Text style={{ color: '#666', fontWeight: '700', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#8E6652', alignItems: 'center', elevation: 4, shadowColor: '#8E6652', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }} 
                onPress={async () => {
                  try {
                    const sizes = editForm.sizesText.split(',').map(s => s.trim()).filter(Boolean);
                    await updateProduct(editing.id, { 
                      name: editForm.name, 
                      price: Number(editForm.price) || 0, 
                      categoryId: editForm.categoryId,
                      categoryName: editForm.categoryName,
                      category: editForm.categoryName, // Keep for backward compatibility
                      securityFee: Number(editForm.securityFee) || 0, 
                      sizes 
                    });
                    setEditing(null);
                    await load();
                    Alert.alert('Success', 'Product updated successfully!');
                  } catch (e) { 
                    Alert.alert('Error', 'Failed to save changes'); 
                  }
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                    setEditForm({
                      ...editForm,
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
                    backgroundColor: editForm.categoryId === item.id ? '#F0F7FF' : '#F8F9FA',
                    borderWidth: 1,
                    borderColor: editForm.categoryId === item.id ? '#8E6652' : '#E0E0E0'
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
                  {editForm.categoryId === item.id && (
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
