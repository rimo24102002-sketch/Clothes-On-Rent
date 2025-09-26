import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { getAllData, addData, updateData } from "../Helper/firebaseHelper";

export default function SellerNotifications() {
  const sellerId = "SELLER_ID"; // replace with actual seller ID
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const notificationTemplates = [
    { type:"order", message:"New order received ✅" },
    { type:"order", message:"Order cancelled by buyer ❌" },
    { type:"order", message:"Order returned / refund requested 🔄" },
    { type:"order", message:"Order shipped / delivered status 📦" },
    { type:"customer", message:"New review or rating added by a buyer ⭐" },
    { type:"customer", message:"Customer complaint / dispute ⚠️" }
  ];

  const fetchNotifications = async () => { 
    try {
      const data = await getAllData("notifications"); 
      setNotifications(data || []); 
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };
  
  const fetchSellerSettings = async () => { 
    try {
      const seller = await getAllData("sellers"); 
      const current = seller?.find(s => s.id === sellerId); 
      setNotificationsEnabled(current?.notificationsEnabled ?? true); 
    } catch (error) {
      console.error("Error fetching seller settings:", error);
    }
  };
  
  useEffect(() => { fetchNotifications(); fetchSellerSettings(); }, []);

  const addTestNotification = async () => {
    if (!notificationsEnabled) { Alert.alert("Notifications are OFF", "You won't receive notifications right now."); return; }
    const randomNotif = notificationTemplates[Math.floor(Math.random()*notificationTemplates.length)];
    try {
      await addData("notifications", { 
        type: randomNotif.type, 
        message: randomNotif.message, 
        timestamp: Date.now(), 
        isRead: false 
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error adding notification:", error);
      Alert.alert("Error", "Failed to add notification");
    }
  };

  const toggleNotifications = async () => { 
    const newStatus = !notificationsEnabled; 
    setNotificationsEnabled(newStatus); 
    try {
      await updateData("sellers", sellerId, { notificationsEnabled: newStatus }); 
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding:10, borderBottomWidth:1, borderBottomColor:"#ccc" }}>
      <Text style={{ fontWeight:"bold" }}>
        {item?.type ? item.type.toUpperCase() : "NOTIFICATION"}
      </Text>
      <Text>{item?.message || "No message"}</Text>
      <Text style={{ fontSize:12, color:"gray" }}>
        {item?.timestamp ? new Date(item.timestamp).toLocaleString() : "No date"}
      </Text>
    </View>
  );

  return (
    <View style={{ flex:1, padding:20, backgroundColor:"#fff" }}>
      <Text style={{ fontSize:22, fontWeight:"bold", marginBottom:10 }}>Notifications</Text>

      <TouchableOpacity onPress={toggleNotifications} style={{ backgroundColor:notificationsEnabled?"green":"gray", padding:10, borderRadius:8, marginBottom:15 }}>
        <Text style={{ color:"#fff", textAlign:"center", fontWeight:"bold" }}>{notificationsEnabled?"Notifications ON":"Notifications OFF"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={addTestNotification} style={{ backgroundColor:"brown", padding:10, borderRadius:8, marginBottom:15 }}>
        <Text style={{ color:"#fff", textAlign:"center", fontWeight:"bold" }}>Add Dummy Notification</Text>
      </TouchableOpacity>

      {notifications.length === 0 ? (
        <Text style={{ textAlign:"center", marginTop:20, color:"gray" }}>No notifications yet</Text>
      ) : (
        <FlatList 
          data={notifications.sort((a,b)=>(b?.timestamp || 0)-(a?.timestamp || 0))} 
          renderItem={renderItem} 
          keyExtractor={(item, index) => item?.id || index.toString()} 
        />
      )}
    </View>
  );
}
