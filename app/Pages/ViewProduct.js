import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Products() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#8E6652' }}>My Products</Text>
        </View>
        <View style={{ backgroundColor: '#fff', margin: 20, borderRadius: 12, padding: 16, alignItems: 'center' }}>
          <TouchableOpacity style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#8E6652' }}>
            <Feather name="camera" size={40} color="#8E6652" />
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: '#8E6652', marginTop: 10 }}>Tap to add product image</Text>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8E6652', padding: 14, borderRadius: 12, marginTop: 16 }}>
            <Feather name="plus" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 }}>Add New Product</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5' }}>
          
          <TouchableOpacity style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' }}>
            <Feather name="camera" size={40} color="#8E6652" />
          </TouchableOpacity>
          
          <View style={{ padding: 12 }}>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>Product Name</Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Text style={{ fontSize: 14, color: '#8E6652', marginTop: 4 }}>Category</Text>
            </TouchableOpacity>
            
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginTop: 4 }}>$99.99</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="edit-2" size={18} color="#8E6652" />
              <Text style={{ marginLeft: 6, color: '#8E6652', fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="trash-2" size={18} color="red" />
              <Text style={{ marginLeft: 6, color: 'red', fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
