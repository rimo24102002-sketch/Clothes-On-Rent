import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, Alert } from "react-native";
import { useSelector } from "react-redux";
import { listDeliveriesBySeller, updateDelivery } from "../Helper/firebaseHelper";
import { Feather } from "@expo/vector-icons";

export default function DeliveryManagement() {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || "";
  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      if (!sellerId) { setDeliveries([]); return; }
      const list = await listDeliveriesBySeller(sellerId);
      setDeliveries(list);
    };
    load();
  }, [sellerId]);

  const filteredDeliveries = filter === "All" ? deliveries : deliveries.filter((d) => d.status === filter);

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      await updateDelivery(deliveryId, { status: newStatus, updatedAt: Date.now() });
      const list = await listDeliveriesBySeller(sellerId);
      setDeliveries(list);
      Alert.alert("Success", `Delivery status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update delivery status");
    }
  };

  const renderDelivery = ({ item }) => (
    <View style={{ borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: "#fff" }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>Delivery #{item.id}</Text>
      <Text style={{ color: "#666", marginTop: 2 }}>Order: {item.orderId || "N/A"}</Text>
      <Text style={{ color: "#666" }}>Customer: {item.customer || "Unknown"}</Text>
      <Text style={{ color: "#666" }}>Address: {item.address || "No address"}</Text>
      <Text style={{ color: "#666" }}>Driver: {item.driver || "Not assigned"}</Text>
      
      <View style={{ backgroundColor: item.status === "Scheduled" ? "#FAD7A0" : item.status === "In Transit" ? "#F9E79F" : item.status === "Delivered" ? "#ABEBC6" : "#F5B7B1", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 }}>
        <Text style={{ color: item.status === "Scheduled" ? "#7e5005ff" : item.status === "In Transit" ? "#af8400ff" : item.status === "Delivered" ? "#07863cff" : "#a7190aff", fontSize: 12, fontWeight: "bold" }}>{item.status}</Text>
      </View>

      {/* Action Buttons */}
      {item.status !== "Delivered" && item.status !== "Failed" && (
        <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
          {item.status === "Scheduled" && (
            <TouchableOpacity
              style={{ backgroundColor: "#FFA500", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flex: 1 }}
              onPress={() => updateDeliveryStatus(item.id, "In Transit")}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "center" }}>Start Transit</Text>
            </TouchableOpacity>
          )}
          
          {item.status === "In Transit" && (
            <TouchableOpacity
              style={{ backgroundColor: "#28A745", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flex: 1 }}
              onPress={() => updateDeliveryStatus(item.id, "Delivered")}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "center" }}>Mark Delivered</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={{ backgroundColor: "#DC3545", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flex: 1 }}
            onPress={() => updateDeliveryStatus(item.id, "Failed")}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "center" }}>Mark Failed</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.createdAt && (
        <Text style={{ fontSize: 10, color: "#999", marginTop: 8 }}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#8E6652" }}>Delivery Management</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {["All", "Scheduled", "In Transit", "Delivered", "Failed"].map((status) => (
          <TouchableOpacity key={status} onPress={() => setFilter(status)} style={{ backgroundColor: filter === status ? "#8E6652" : "#E5E8E8", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, alignSelf: "flex-start" }}>
            <Text style={{ color: filter === status ? "black" : "#8E6652", fontWeight: "bold", fontSize: 12 }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filteredDeliveries} renderItem={renderDelivery} keyExtractor={(d) => d.id} ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40 }}>No deliveries found.</Text>} />
    </View>
  );
}
