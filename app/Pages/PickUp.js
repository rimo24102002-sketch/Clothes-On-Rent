import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Modal, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PickupManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [addVisible, setAddVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);

  const pickups = [
    { id: 'P1', orderId: 'ORD-1001', customer: 'Ali Khan', address: 'Lahore, Pakistan', startDate: '2025-09-01', rentalDays: 3, endDate: '2025-09-04', status: 'Pending', rider: null },
    { id: 'P2', orderId: 'ORD-1002', customer: 'Ahmed Ali', address: 'Karachi, Pakistan', startDate: '2025-09-02', rentalDays: 2, endDate: '2025-09-04', status: 'Scheduled', rider: { name: 'Rider 1', vehicle: 'Bike' } }
  ];

  const riders = [
    { id: 'r1', name: 'Rider 1', phone: '03001234567', vehicle: 'Bike' },
    { id: 'r2', name: 'Rider 2', phone: '03007654321', vehicle: 'Bike' }
  ];

  const renderPickup = ({ item }) => (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View>
          <Text style={{ fontWeight: '800', fontSize: 15, color: '#8E6652' }}>Order #{item.orderId}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>Pickup: {item.id}</Text>
        </View>
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#8E6652' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#8E6652' }}>{item.status}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Ionicons name="person-outline" size={16} color="#888" />
        <Text style={{ marginLeft: 8, color: '#000' }}>{item.customer}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Ionicons name="location-outline" size={16} color="#888" />
        <Text style={{ marginLeft: 8, color: '#000', flex: 1 }}>{item.address}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Ionicons name="calendar-outline" size={16} color="#888" />
        <Text style={{ marginLeft: 8, color: '#000' }}>
          Rental: {item.startDate} • {item.rentalDays} days • Return: {item.endDate}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Ionicons name="bicycle-outline" size={16} color="#888" />
        <Text style={{ marginLeft: 8, color: '#000' }}>
          Rider: {item.rider ? `${item.rider.name} (${item.rider.vehicle})` : 'Not Assigned'}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
        <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: '#8E6652' }} onPress={() => setAssignVisible(true)}>
          <Text style={{ color: '#8E6652', fontWeight: '700' }}>{item.rider ? 'Reschedule' : 'Assign'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F1DCD1' }}>

      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <Text style={{ flex: 1, fontSize: 20, fontWeight: '700', color: '#8E6652' }}>Pickup Management</Text>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#8E6652', alignItems: 'center', justifyContent: 'center' }} onPress={() => setAddVisible(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 16, borderRadius: 10, paddingHorizontal: 12, height: 44, backgroundColor: '#fff' }}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, fontSize: 15 }}
          placeholder="Search order or customer..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        {['All', 'Pending', 'Scheduled', 'In Progress', 'Completed', 'Failed'].map(tab => {
          const key = tab.toLowerCase().replace(' ', '');
          const active = activeTab === key;
          return (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(key)} style={{ marginRight: 8 }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: active ? '#8E6652' : 'transparent' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : '#666' }}>{tab}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList data={pickups} keyExtractor={(item) => item.id} renderItem={renderPickup} contentContainerStyle={{ padding: 16 }} />

      <Modal visible={addVisible} transparent onRequestClose={() => setAddVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 10 }}>Add Pickup</Text>
            <TextInput placeholder="Order ID" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
            <TextInput placeholder="Customer Name" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
            <TextInput placeholder="Address" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
            <TextInput placeholder="Rental Start (YYYY-MM-DD)" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
            <TextInput placeholder="Rental Days" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc' }} onPress={() => setAddVisible(false)}>
                <Text style={{ color: '#888' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 10, borderRadius: 10, backgroundColor: '#8E6652' }} onPress={() => setAddVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={assignVisible} transparent onRequestClose={() => setAssignVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 10 }}>Assign Rider</Text>
            {riders.map(r => (
              <TouchableOpacity key={r.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 8 }}>
                <Ionicons name="bicycle-outline" size={18} color="#8E6652" style={{ marginRight: 10 }} />
                <View>
                  <Text style={{ fontWeight: '700' }}>{r.name}</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>{r.phone} • {r.vehicle}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TextInput placeholder="Pickup Date (YYYY-MM-DD)" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
            <TextInput placeholder="Time Slot" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc' }} onPress={() => setAssignVisible(false)}>
                <Text style={{ color: '#888' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 10, borderRadius: 10, backgroundColor: '#8E6652' }} onPress={() => setAssignVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
