import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getNotificationsBySeller, markNotificationAsRead, deleteNotification, getSellerNotificationSettings } from "../Helper/firebaseHelper";

export default function SellerNotifications({ navigation }) {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || "";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({});

  const fetchNotifications = async () => { 
    try {
      if (!sellerId) { 
        setNotifications([]);
        setLoading(false);
        return; 
      }
      const data = await getNotificationsBySeller(sellerId);
      setNotifications(data || []); 
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      Alert.alert("Error", "Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const fetchNotificationSettings = async () => { 
    try {
      if (!sellerId) return;
      const settings = await getSellerNotificationSettings(sellerId);
      setNotificationSettings(settings || {});
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };
  
  useEffect(() => { 
    fetchNotifications(); 
    fetchNotificationSettings(); 
  }, [sellerId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
    fetchNotificationSettings();
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      fetchNotifications(); // Refresh to show updated read status
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Error", "Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNotification(notificationId);
              fetchNotifications(); // Refresh list
            } catch (error) {
              console.error("Error deleting notification:", error);
              Alert.alert("Error", "Failed to delete notification");
            }
          }
        }
      ]
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return 'shopping-bag';
      case 'payment': return 'credit-card';
      case 'customer': return 'user';
      case 'review': return 'star';
      default: return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return '#8E6652';
      case 'payment': return '#28a745';
      case 'customer': return '#17a2b8';
      case 'review': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ 
      backgroundColor: item.read ? '#fff' : '#F8F9FA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: item.read ? '#E0E0E0' : '#F1DCD1',
      borderLeftWidth: 4,
      borderLeftColor: getNotificationColor(item.type)
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
          <View style={{ 
            backgroundColor: getNotificationColor(item.type),
            borderRadius: 20,
            padding: 8,
            marginRight: 12
          }}>
            <Feather name={getNotificationIcon(item.type)} size={16} color="#fff" />
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ 
                fontSize: 14,
                fontWeight: '600',
                color: '#333',
                textTransform: 'capitalize'
              }}>
                {item?.type || "Notification"}
              </Text>
              {!item.read && (
                <View style={{ 
                  backgroundColor: '#8E6652',
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 8
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>NEW</Text>
                </View>
              )}
            </View>
            
            <Text style={{ 
              fontSize: 14,
              color: '#333',
              lineHeight: 20,
              marginBottom: 8
            }}>
              {item?.message || "No message"}
            </Text>
            
            <Text style={{ 
              fontSize: 12,
              color: '#666'
            }}>
              {item?.timestamp ? new Date(item.timestamp).toLocaleString() : "No date"}
            </Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!item.read && (
            <TouchableOpacity
              onPress={() => handleMarkAsRead(item.id)}
              style={{ marginRight: 8, padding: 4 }}
            >
              <Feather name="check" size={18} color="#28a745" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => handleDeleteNotification(item.id)}
            style={{ padding: 4 }}
          >
            <Feather name="trash-2" size={18} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#8E6652', marginLeft: 12 }}>Notifications</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{ marginTop: 16, color: '#666' }}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <View style={{ height:80,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0',backgroundColor:'#8E6652' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff',marginLeft:12 }}>Notifications</Text>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationSettings')}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
        >
          <Feather name="settings" size={23} color="#fff" />
         
        </TouchableOpacity>
      </View>
    {/* Notifications List */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
        {notifications.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Feather name="bell-off" size={48} color="#CCC" />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#666', textAlign: 'center' }}>No notifications yet</Text>
            <Text style={{ marginTop: 8, fontSize: 14, color: '#999', textAlign: 'center' }}>
              You'll receive notifications here when customers interact with your items
            </Text>
          </View>
        ) : (
          <FlatList 
            data={notifications.sort((a,b)=>(b?.timestamp || 0)-(a?.timestamp || 0))} 
            renderItem={renderItem} 
            keyExtractor={(item, index) => item?.id || index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8E6652']}
                tintColor="#8E6652"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
