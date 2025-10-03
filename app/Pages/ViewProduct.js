import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { deleteProduct, listProductsBySeller, updateProduct, uploadImageToCloudinary, getProductCategories, getCategoryById } from '../Helper/firebaseHelper';

export default function Products() {
  const router = useRouter();
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || '';
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', categoryId: '', categoryName: '', securityFee: '', sizesText: '', stockText: '' });
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const categories = getProductCategories();

  const load = async () => {
    if (!sellerId) return setProducts([]);
    const list = await listProductsBySeller(sellerId);
    setProducts(list);
  };

  useEffect(() => { load(); }, [sellerId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#27AE60';
      case 'rejected': return '#E74C3C';
      case 'pending': return '#F39C12';
      default: return '#95A5A6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending Approval';
      default: return 'Unknown';
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      Alert.alert('Error', 'Failed to delete');
    }
  };

  const renderItem = ({ item }) => {
    const category = getCategoryById(item.categoryId);
    const status = item.status || 'pending';
    const totalStock = item.stock ? Object.values(item.stock).reduce((sum, val) => sum + (Number(val) || 0), 0) : 0;
    
    return (
    <View style={{ backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5' }}>
      {/* Status Badge */}
      <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: getStatusColor(status), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons 
          name={status === 'approved' ? 'check-circle' : status === 'rejected' ? 'cancel' : 'pending'} 
          size={14} 
          color="#fff" 
        />
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#fff', marginLeft: 4 }}>{getStatusText(status)}</Text>
      </View>
      
      <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' }}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <Feather name="camera" size={40} color="#8E6652" />
        )}
      </View>
      
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>{item.name || 'Product'}</Text>
        
        {/* Category Badge */}
        {category && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: category.color, marginRight: 6 }} />
            <Text style={{ fontSize: 12, color: '#666', fontWeight: '600' }}>{category.id}</Text>
            <Text style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>- {category.name}</Text>
          </View>
        )}
        
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginTop: 6 }}>${item.price ?? 0}/day</Text>
        <Text style={{ fontSize: 14, color: '#333', marginTop: 2 }}>Security: ${item.securityFee ?? 0}</Text>
        
        {/* Sizes and Stock */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
          {(item.sizes || ['S','M','L']).map(size => {
            const stockQty = item.stock?.[size] || 0;
            return (
              <View key={size} style={{ backgroundColor: Number(stockQty) > 0 ? '#E8F5E9' : '#FFEBEE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6, marginBottom: 4 }}>
                <Text style={{ fontSize: 11, color: '#333' }}>{size}: {stockQty}</Text>
              </View>
            );
          })}
        </View>
        <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Total Stock: {totalStock} pcs</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { 
          setEditing(item); 
          const stockEntries = item.stock || {};
          const stockPairs = Object.entries(stockEntries).map(([size, qty]) => `${size}:${qty}`).join(', ');
          setEditForm({ 
            name: item.name || '', 
            price: String(item.price ?? ''), 
            categoryId: item.categoryId || '', 
            categoryName: item.categoryName || '', 
            securityFee: String(item.securityFee ?? ''), 
            sizesText: (item.sizes && item.sizes.length>0) ? item.sizes.join(', ') : 'S, M, L',
            stockText: stockPairs || 'S:0, M:0, L:0'
          }); 
        }}>
          <Feather name="edit-2" size={18} color="#8E6652" />
          <Text style={{ marginLeft: 6, color: '#8E6652', fontWeight: '600' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleDelete(item.id)}>
          <Feather name="trash-2" size={18} color="red" />
          <Text style={{ marginLeft: 6, color: 'red', fontWeight: '600' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {/* Custom Header */}
      <View style={{ backgroundColor: '#8E6652', paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>My Products</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Total Products: {products.length}</Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Approved: {products.filter(p => p.status === 'approved').length} | Pending: {products.filter(p => p.status === 'pending').length}</Text>
          </View>
          <TouchableOpacity 
            style={{ backgroundColor: '#8E6652', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }} 
            onPress={() => router.push('/Pages/AddProduct')}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6 }}>Add Product</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={products} renderItem={renderItem} keyExtractor={(i) => i.id} ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666' }}>No products yet.</Text>} />
        <Modal visible={!!editing} transparent onRequestClose={() => setEditing(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, maxHeight: '80%' }}>
              <ScrollView>
                <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 10 }}>Edit Product</Text>
                <TextInput placeholder="Name" value={editForm.name} onChangeText={(t) => setEditForm({ ...editForm, name: t })} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
                <TextInput placeholder="Price" value={editForm.price} onChangeText={(t) => setEditForm({ ...editForm, price: t })} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
                
                {/* Category Selector */}
                <TouchableOpacity
                  onPress={() => setCategoryModalVisible(true)}
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text style={{ color: editForm.categoryName ? '#333' : '#999' }}>
                    {editForm.categoryName || 'Select category'}
                  </Text>
                  <Feather name="chevron-down" size={18} color="#666" />
                </TouchableOpacity>
                
                <TextInput placeholder="Security Fee" value={editForm.securityFee} onChangeText={(t) => setEditForm({ ...editForm, securityFee: t })} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
                <TextInput placeholder="Sizes (comma separated) e.g. S, M, L" value={editForm.sizesText} onChangeText={(t) => setEditForm({ ...editForm, sizesText: t })} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
                <TextInput placeholder="Stock (format: S:5, M:10, L:8)" value={editForm.stockText} onChangeText={(t) => setEditForm({ ...editForm, stockText: t })} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc' }} onPress={() => setEditing(null)}>
                  <Text style={{ color: '#888' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, borderRadius: 10, backgroundColor: '#8E6652' }} onPress={async () => {
                  try {
                    const sizes = editForm.sizesText.split(',').map(s => s.trim()).filter(Boolean);
                    const stockObj = {};
                    editForm.stockText.split(',').forEach(pair => {
                      const [size, qty] = pair.split(':').map(s => s.trim());
                      if (size && qty) stockObj[size] = qty;
                    });
                    await updateProduct(editing.id, { 
                      name: editForm.name, 
                      price: Number(editForm.price) || 0, 
                      categoryId: editForm.categoryId,
                      categoryName: editForm.categoryName,
                      securityFee: Number(editForm.securityFee) || 0, 
                      sizes,
                      stock: stockObj
                    });
                    setEditing(null);
                    await load();
                  } catch (e) { Alert.alert('Error', 'Failed to save'); }
                }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ marginTop: 12, backgroundColor: '#eee', padding: 10, borderRadius: 10, alignItems: 'center' }} onPress={async () => {
                try {
                  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
                  if (!res.canceled && res.assets?.length > 0) {
                    const url = await uploadImageToCloudinary(res.assets[0].uri);
                    await updateProduct(editing.id, { imageUrl: url });
                    await load();
                  }
                } catch (e) { Alert.alert('Error', 'Failed to update image'); }
              }}>
                <Text style={{ color: '#333', fontWeight: '700' }}>Update Image</Text>
              </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Category Selection Modal */}
        <Modal visible={categoryModalVisible} transparent animationType="slide" onRequestClose={() => setCategoryModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>Select Category</Text>
                <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                  <Feather name="x" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                      setEditForm({ ...editForm, categoryId: category.id, categoryName: category.name });
                      setCategoryModalVisible(false);
                    }}
                    style={{ backgroundColor: '#f9f9f9', padding: 16, borderRadius: 12, marginBottom: 12 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: category.color, marginRight: 10 }} />
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>{category.name}</Text>
                      <Text style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>({category.id})</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
