import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { getSellerComplaints } from '../Helper/firebaseHelper';

export default function SellerComplaints({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const data = await getSellerComplaints(sellerId);
      const sorted = [...data].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setComplaints(sorted);
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [sellerId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ padding: 15, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      onPress={() => {
        navigation.navigate('DirectChat', {
          currentUserId: user?.uid,
          otherUserId: 'ADMIN_SUPPORT',
          otherUserName: 'Admin',
          chatId: `complaint_${item.id}`,
          complaintId: item.id,
          allowReply: (item.status || '').toLowerCase() === 'pending'
        });
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{item.subject || 'No subject'}</Text>
        <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{item.category} • {item.status}</Text>
        <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{new Date(item.createdAt || item.timestamp).toLocaleString()}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: '#8E6652' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginRight: 100 }}>Complaints</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="small" color="#8E6652" />
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ padding: 20 }}>
              <Text style={{ textAlign: 'center', color: '#666' }}>No complaints found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}