import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState([
    { id: "CMP-1001", orderId: "ORD-1005", customer: "Michael Brown", type: "Product Quality", priority: "High", description: "Received item with a tear on the sleeve.", status: "Open", response: "" },
    { id: "CMP-1002", orderId: "ORD-1006", customer: "Sarah Wilson", type: "Late Delivery", priority: "Medium", description: "Order was supposed to be delivered on August 23rd.", status: "In Progress", response: "We apologize for the delay. We've contacted the delivery service." },
  ]);
  const [filter, setFilter] = useState("All");

  const filteredComplaints = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  const renderComplaint = ({ item }) => (
    <View style={{ borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>Complaint #{item.id}</Text>
      <Text>Order: {item.orderId}</Text>
      <Text>Customer: {item.customer}</Text>
      <Text>Type: {item.type} • {item.priority}</Text>
      <Text>Description: {item.description}</Text>

      <View style={{ backgroundColor: item.status === "Open" ? "#FAD7A0" : item.status === "In Progress" ? "#F9E79F" : item.status === "Resolved" ? "#ABEBC6" : "#D7DBDD", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 6 }}>
        <Text style={{ color: item.status === "Open" ? "#7e5005ff" : item.status === "In Progress" ? "#af8400ff" : item.status === "Resolved" ? "#07863cff" : "#566573", fontSize: 12, fontWeight: "bold" }}>{item.status}</Text>
      </View>

      {item.response ? <Text style={{ marginTop: 8, fontStyle: "italic", color: "#333" }}>Response: {item.response}</Text> : null}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#8E6652" }}>Complaints Management</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {["All", "Open", "In Progress", "Resolved"].map((status) => (
          <TouchableOpacity key={status} onPress={() => setFilter(status)} style={{ backgroundColor: filter === status ? "#8E6652" : "#E5E8E8", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, alignSelf: "flex-start" }}>
            <Text style={{ color: filter === status ? "black" : "#8E6652", fontWeight: "bold", fontSize: 12 }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList data={filteredComplaints} renderItem={renderComplaint} keyExtractor={(c) => c.id} ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40 }}>No complaints found.</Text>} />
    </View>
  );
}
