import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";

export default function DeliveryManagement() {
  const [deliveries] = useState([
    { id: "D1", orderId: "ORD-1001", customer: "John Doe", address: "123 Main St, Karachi", driver: "Not Assigned", status: "Scheduled" },
    { id: "D2", orderId: "ORD-1002", customer: "Sara Ahmed", address: "45 Street, Lahore", driver: "Ali Raza", status: "In Transit" },
    { id: "D3", orderId: "ORD-1003", customer: "Bilal Khan", address: "Mall Road, Lahore", driver: "Ahmed Khan", status: "Delivered" },
  ]);
  const [filter, setFilter] = useState("All");

  const filteredDeliveries = filter === "All" ? deliveries : deliveries.filter((d) => d.status === filter);

  const renderDelivery = ({ item }) => (
    <View style={{ borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>Delivery #{item.id}</Text>
      <Text>Order: {item.orderId}</Text>
      <Text>Customer: {item.customer}</Text>
      <Text>Address: {item.address}</Text>
      <Text>Driver: {item.driver}</Text>
      <View style={{ backgroundColor: item.status === "Scheduled" ? "#FAD7A0" : item.status === "In Transit" ? "#F9E79F" : item.status === "Delivered" ? "#ABEBC6" : "#F5B7B1", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 6 }}>
        <Text style={{ color: item.status === "Scheduled" ? "#7e5005ff" : item.status === "In Transit" ? "#af8400ff" : item.status === "Delivered" ? "#07863cff" : "#a7190aff", fontSize: 12, fontWeight: "bold" }}>{item.status}</Text>
      </View>
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
