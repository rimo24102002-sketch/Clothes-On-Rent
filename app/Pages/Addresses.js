import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', street: '', city: '', state: '', zip: '', country: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ visible: false, id: null });

  useEffect(() => {                      
    (async () => {
      const stored = await AsyncStorage.getItem('userAddresses');
      if (stored) setAddresses(JSON.parse(stored));
    })();
  }, []);            

  const saveAddresses = async (newAdd) => {
    await AsyncStorage.setItem('userAddresses', JSON.stringify(newAdd));
    setAddresses(newAdd);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.street.trim() || !form.city.trim()) {
      alert('Name, street, and city are required.');
      return;
    }

    const newAddress = {
      ...form,
      id: editing ? editing.id : Date.now().toString() + Math.random().toString(36)
    };

    const updated = editing
      ? addresses.map(a => a.id === editing.id ? newAddress : a)
      : [...addresses, newAddress];

    await saveAddresses(updated);
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', street: '', city: '', state: '', zip: '', country: '' });
  };

  const handleEdit = (addr) => {
    setEditing(addr);
    setForm({
      name: addr.name,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const updated = addresses.filter(a => a.id !== id);
    await saveAddresses(updated);
    setDeleteConfirm({ visible: false, id: null });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F1DCD1' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Addresses</Text>

      <ScrollView>
        {addresses.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text>No addresses added</Text>
            <Pressable
              onPress={() => {
                setEditing(null);
                setForm({ name: '', street: '', city: '', state: '', zip: '', country: '' });
                setShowModal(true);
              }}
              style={{ marginTop: 20, backgroundColor: '#8E6652', padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: '#fff' }}>Add Address</Text>
            </Pressable>
          </View>
        ) : addresses.map(addr => (
          <View key={addr.id} style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>{addr.name}</Text>
            <Text>{addr.street}</Text>
            <Text>{addr.city}, {addr.state} {addr.zip}</Text>
            {addr.country ? <Text>{addr.country}</Text> : null}

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Pressable onPress={() => handleEdit(addr)} style={{ marginRight: 15 }}>
                <Text style={{ color: '#8E6652' }}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => setDeleteConfirm({ visible: true, id: addr.id })}>
                <Text style={{ color: 'red' }}>Delete</Text>
              </Pressable>
            </View>

            <Text style={{ marginTop: 10, fontStyle: 'italic', color: '#333' }}>Payment: Cash on Delivery</Text>
          </View>
        ))}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, padding: 20, backgroundColor: '#F1DCD1' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            {editing ? 'Edit Address' : 'Add Address'}
          </Text>

          {['name', 'street', 'city', 'state', 'zip', 'country'].map(field => (
            <View key={field} style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5 }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              <TextInput
                style={{ backgroundColor: '#fff', padding: 10, borderRadius: 5 }}
                value={form[field]}
                onChangeText={text => setForm({ ...form, [field]: text })}
                placeholder={`Enter ${field}`}
              />
            </View>
          ))}

          <Pressable onPress={handleSave} style={{ backgroundColor: '#8E6652', padding: 12, borderRadius: 5, marginBottom: 10 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Save</Text>
          </Pressable>
          <Pressable onPress={() => { setShowModal(false); setEditing(null); }} style={{ backgroundColor: '#ccc', padding: 12, borderRadius: 5 }}>
            <Text style={{ textAlign: 'center' }}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteConfirm.visible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Are you sure you want to delete this address?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Pressable onPress={() => setDeleteConfirm({ visible: false, id: null })} style={{ marginRight: 20 }}>
                <Text style={{ color: '#8E6652' }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(deleteConfirm.id)}>
                <Text style={{ color: 'red' }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Add Button */}
      <Pressable
        onPress={() => {
          setEditing(null);
          setForm({ name: '', street: '', city: '', state: '', zip: '', country: '' });
          setShowModal(true);
        }}
        style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#8E6652', padding:15, borderRadius: 50 }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>+</Text>
      </Pressable>
    </View>
  );
}
