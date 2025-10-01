import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, RefreshControl, Modal, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getNotificationsBySeller, markNotificationAsRead, deleteNotification, getSellerNotificationSettings } from "../Helper/firebaseHelper";
import Header from "../Components/Header";

export default function SellerNotifications({ navigation }) {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || "";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const handleDeleteNotification = async (notificationId) => {
    console.log("Delete notification called with ID:", notificationId);
    
    if (!notificationId) {
      Alert.alert("Error", "Notification ID is missing");
      return;
    }

    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Attempting to delete notification:", notificationId);
              await deleteNotification(notificationId);
              console.log("Notification deleted successfully from Firebase");
              
              // Update local state immediately
              setNotifications(prev => {
                const updated = prev.filter(n => n.id !== notificationId);
                console.log("Updated notifications count:", updated.length);
                return updated;
              });
              
              Alert.alert("Success", "Notification deleted successfully");
            } catch (error) {
              console.error("Error deleting notification:", error);
              Alert.alert("Error", `Failed to delete notification: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.read) {
        await handleMarkAsRead(notification.id);
      }
      
      // Show detail modal
      setSelectedNotification(notification);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error opening notification:', error);
    }
  };

  const handleNavigateToSettings = () => {
    navigation.navigate('NotificationSettings');
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
    <TouchableOpacity 
      style={{ 
        backgroundColor: item.read ? '#fff' : '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: item.read ? '#E0E0E0' : '#F1DCD1',
        borderLeftWidth: 4,
        borderLeftColor: getNotificationColor(item.type)
      }}
      onPress={() => handleNotificationClick(item)}
      activeOpacity={0.7}
    >
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
              onPress={(e) => {
                e.stopPropagation();
                handleMarkAsRead(item.id);
              }}
              style={{ marginRight: 8, padding: 4 }}
            >
              <Feather name="check" size={18} color="#28a745" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteNotification(item.id);
            }}
            style={{ padding: 4 }}
          >
            <Feather name="trash-2" size={18} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#8E6652', marginLeft: 12 }}>Notifications</Text>
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
     <Header 
        title="Notifications"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            onPress={handleNavigateToSettings}
            style={{ backgroundColor: '#fff', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}
          >
            <Feather name="settings" size={18} color="#8E6652" />
          </TouchableOpacity>
        }
      />
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

      {/* Notification Detail Modal */}
      <Modal visible={showDetailModal} transparent={true} animationType="slide">
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowDetailModal(false)}
        >
          <TouchableOpacity 
            style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' }}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedNotification && (
              <ScrollView style={{ padding: 20 }}>
                {/* Modal Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ 
                      backgroundColor: getNotificationColor(selectedNotification.type),
                      borderRadius: 20,
                      padding: 8,
                      marginRight: 12
                    }}>
                      <Feather name={getNotificationIcon(selectedNotification.type)} size={20} color="#fff" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', textTransform: 'capitalize' }}>
                      {selectedNotification.type || 'Notification'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Feather name="x" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Notification Content */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, color: '#333', lineHeight: 24, marginBottom: 16 }}>
                    {selectedNotification.message || 'No message available'}
                  </Text>
                  
                  {selectedNotification.details && (
                    <View style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>Details:</Text>
                      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                        {selectedNotification.details}
                      </Text>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Feather name="clock" size={16} color="#666" />
                    <Text style={{ fontSize: 14, color: '#666', marginLeft: 8 }}>
                      {selectedNotification.timestamp ? new Date(selectedNotification.timestamp).toLocaleString() : 'No date'}
                    </Text>
                  </View>

                  {selectedNotification.orderId && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                      <Feather name="shopping-bag" size={16} color="#666" />
                      <Text style={{ fontSize: 14, color: '#666', marginLeft: 8 }}>
                        Order ID: {selectedNotification.orderId}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {!selectedNotification.read && (
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                      onPress={() => {
                        handleMarkAsRead(selectedNotification.id);
                        setShowDetailModal(false);
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '600' }}>Mark as Read</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#dc3545', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                    onPress={() => {
                      setShowDetailModal(false);
                      handleDeleteNotification(selectedNotification.id);
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
