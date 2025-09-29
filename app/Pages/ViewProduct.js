import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { addProduct, deleteProduct, listProductsBySeller, updateProduct, uploadImageToCloudinary } from '../Helper/firebaseHelper';

export default function Products() {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || '';
  const [products, setProducts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', securityFee: '', sizesText: '' });

  const load = async () => {
    if (!sellerId) return setProducts([]);
    const list = await listProductsBySeller(sellerId);
    setProducts(list);
  };

  useEffect(() => { load(); }, [sellerId]);

  const handleAdd = async () => {
    try {
      setAdding(true);
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      let imageUrl = '';
      if (!res.canceled && res.assets?.length > 0) {
        imageUrl = await uploadImageToCloudinary(res.assets[0].uri);
      }
      const id = await addProduct(sellerId, { name: 'New Product', price: 0, imageUrl, securityFee: 0, sizes: ["S","M","L"] });
      await load();
      Alert.alert('Product added', `ID: ${id}`);
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to add product');
    } finally {
      setAdding(false);
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

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5' }}>
      <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' }}>
        <Feather name="camera" size={40} color="#8E6652" />
      </View>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>{item.name || 'Product'}</Text>
        <Text style={{ fontSize: 14, color: '#8E6652', marginTop: 4 }}>{item.category || 'Uncategorized'}</Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginTop: 4 }}>${item.price ?? 0}</Text>
        <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Security Fee: ${item.securityFee ?? 0}</Text>
        <Text style={{ fontSize: 14, color: '#333', marginTop: 2 }}>Sizes: {(item.sizes && item.sizes.length>0) ? item.sizes.join(', ') : 'S, M, L'}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { setEditing(item); setEditForm({ name: item.name || '', price: String(item.price ?? ''), category: item.category || '', securityFee: String(item.securityFee ?? ''), sizesText: (item.sizes && item.sizes.length>0) ? item.sizes.join(', ') : 'S, M, L' }); }}>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#8E6652' }}>My Products</Text>
          <TouchableOpacity style={{ marginLeft: 'auto', backgroundColor: '#8E6652', padding: 10, borderRadius: 8 }} onPress={handleAdd} disabled={adding}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{adding ? 'Adding...' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={products} renderItem={renderItem} keyExtractor={(i) => i.id} ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666' }}>No products yet.</Text>} />
        <Modal visible={!!editing} transparent onRequestClose={() => setEditing(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 10 }}>Edit Product</Text>
              <TextInput placeholder="Name" value={editForm.name} onChangeText={(t) => setEditForm({ ...editForm, name: t })} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
              <TextInput placeholder="Price" value={editForm.price} onChangeText={(t) => setEditForm({ ...editForm, price: t })} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
              <TextInput placeholder="Category" value={editForm.category} onChangeText={(t) => setEditForm({ ...editForm, category: t })} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
              <TextInput placeholder="Security Fee" value={editForm.securityFee} onChangeText={(t) => setEditForm({ ...editForm, securityFee: t })} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
              <TextInput placeholder="Available Sizes (comma separated) e.g. S, M, L" value={editForm.sizesText} onChangeText={(t) => setEditForm({ ...editForm, sizesText: t })} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc' }} onPress={() => setEditing(null)}>
                  <Text style={{ color: '#888' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, borderRadius: 10, backgroundColor: '#8E6652' }} onPress={async () => {
                  try {
                    const sizes = editForm.sizesText.split(',').map(s => s.trim()).filter(Boolean);
                    await updateProduct(editing.id, { name: editForm.name, price: Number(editForm.price) || 0, category: editForm.category, securityFee: Number(editForm.securityFee) || 0, sizes });
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
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
