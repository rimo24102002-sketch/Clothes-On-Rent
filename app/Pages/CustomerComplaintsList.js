import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getCustomerComplaints } from '../Helper/firebaseHelper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CustomerComplaintsList({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const customerId = user?.uid;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await getCustomerComplaints(customerId);
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
  }, [customerId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'resolved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FFA500';
      case 'low':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 12,
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
      onPress={() => {
        navigation.navigate('DirectChat', {
          currentUserId: user?.uid,
          otherUserId: 'ADMIN_SUPPORT',
          otherUserName: 'Admin Support',
          chatId: `complaint_${item.id}`,
          complaintId: item.id,
          allowReply: (item.status || '').toLowerCase() === 'pending'
        });
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>
            {item.subject || 'No subject'}
          </Text>
          <Text style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
            {item.description || 'No description'}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color="#8E6652" />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        <View style={{
          backgroundColor: getStatusColor(item.status),
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600', textTransform: 'uppercase' }}>
            {item.status || 'Pending'}
          </Text>
        </View>
        <View style={{
          backgroundColor: getPriorityColor(item.priority),
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600', textTransform: 'uppercase' }}>
            {item.priority || 'Medium'}
          </Text>
        </View>
        {item.category && (
          <View style={{
            backgroundColor: '#8E6652',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600' }}>
              {item.category}
            </Text>
          </View>
        )}
      </View>

      <Text style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
        {new Date(item.createdAt || item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#8E6652',
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('BottomTab');
            }
          }}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 }}>
          My Complaints
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading complaints...</Text>
        </View>
      ) : complaints.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Feather name="inbox" size={64} color="#999" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#666', marginTop: 20 }}>
            No Complaints Found
          </Text>
          <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 10 }}>
            You haven't submitted any complaints yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 15 }}
          refreshing={loading}
          onRefresh={loadComplaints}
        />
      )}
    </View>
  );
}

