import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const [name, setName] = useState('User Name');
  const [shopName, setShopName] = useState('Your Shop');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

        {}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#8E6652' }}>
          <TouchableOpacity style={{ padding: 8 }}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginLeft: 10 }}>Seller Profile</Text>
        </View>

        {}
        <View style={{ backgroundColor: '#fff', margin: 24, borderRadius: 20, padding: 20, alignItems: 'center' }}>
          <TouchableOpacity style={{ marginBottom: 15 }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F1DCD1' }}>
              <Feather name="plus" size={40} color="#8E6652" />
            </View>
          </TouchableOpacity>

          <TextInput
            value={name}
            onChangeText={setName}
            style={{ fontSize: 16, fontWeight: '800', color: '#333', borderWidth: 1, borderColor: '#8E6652', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8, textAlign: 'center', width: 200 }}
            placeholder="Enter Name"
          />
          <Text style={{ fontSize: 16, color: '#8E6652', fontWeight: '600', marginTop: 8 }}>Seller</Text>
        </View>

        {}
        <View style={{ backgroundColor: '#fff', marginHorizontal: 24, borderRadius: 16, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', paddingVertical: 12 }}>
            <Feather name="mail" size={20} color="#8E6652" />
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '600', flex: 1, marginLeft: 10 }}>Email</Text>
            <Text style={{ fontSize: 16, color: '#666', fontWeight: '600' }}>your@email.com</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', paddingVertical: 12 }}>
            <Feather name="user" size={20} color="#8E6652" />
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '600', flex: 1, marginLeft: 10 }}>Seller ID</Text>
            <Text style={{ fontSize: 16, color: '#666', fontWeight: '600' }}>RC-SLR-XXXX</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
            <MaterialIcons name="storefront" size={20} color="#8E6652" />
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '600', flex: 1, marginLeft: 10 }}>Shop Name</Text>
            <TextInput
              value={shopName}
              onChangeText={setShopName}
              style={{ borderWidth: 1, borderColor: '#8E6652', borderRadius: 8, paddingHorizontal: 8, flex: 1, textAlign: 'right' }}
              placeholder="Enter Shop Name"
            />
          </View>
        </View>

        {}
        <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 16 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#8E6652', padding: 16, borderRadius: 12 }}>
            <Feather name="package" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 10 }}>View Product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 1, borderColor: '#8E6652', padding: 16, borderRadius: 12 }}>
            <Ionicons name="bicycle" size={22} color="#8E6652" />
            <Text style={{ color: '#8E6652', fontSize: 16, fontWeight: '700', marginLeft: 10, flex: 1 }}>Pickup Management</Text>
            <Feather name="chevron-right" size={20} color="#8E6652" />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 1, borderColor: '#8E6652', padding: 16, borderRadius: 12 }}>
            <Feather name="settings" size={22} color="#8E6652" />
            <Text style={{ color: '#8E6652', fontSize: 16, fontWeight: '700', marginLeft: 10, flex: 1 }}>Account Settings</Text>
            <Feather name="chevron-right" size={20} color="#8E6652" />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#E0E0E0', padding: 16, borderRadius: 12 }}>
            <Feather name="user" size={20} color="#666" />
            <Text style={{ color: '#666', fontSize: 16, fontWeight: '600', marginLeft: 10, flex: 1 }}>Switch to Customer View</Text>
            <Feather name="chevron-right" size={18} color="#666" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}