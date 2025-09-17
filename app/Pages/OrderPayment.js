import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";

export default function SellerOrders() {
  const [orders] = useState([
    { id: "1", customer: "Ali Khan", address: "Street 123, Karachi", items: ["Lehanga", "Kurti"], payment: "Cash on Delivery", status: "Pending" },
    { id: "2", customer: "Sara Ahmed", address: "Street 45, Lahore", items: ["Bridal Lehanga"], payment: "Cash on Delivery", status: "Delivered" },
  ]);
  const [filter, setFilter] = useState("All");

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const renderOrder = ({ item }) => (
    <View style={{ borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>Order #{item.id}</Text>
      <Text>Customer: {item.customer}</Text>
      <Text>Address: {item.address}</Text>
      <Text>Items: {item.items.join(", ")}</Text>
      <Text style={{ fontWeight: "bold", marginTop: 6, marginBottom: 4 }}>{item.payment}</Text>
      <View style={{ backgroundColor: item.status === "Pending" ? "#FAD7A0" : item.status === "Delivered" ? "#ABEBC6" : item.status === "Canceled" ? "#F5B7B1" : "#D7DBDD", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 4 }}>
        <Text style={{ color: item.status === "Pending" ? "#7e5005ff" : item.status === "Delivered" ? "#07863cff" : item.status === "Canceled" ? "#a7190aff" : "#566573", fontSize: 12, fontWeight: "bold" }}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#8E6652" }}>Seller Orders</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {["All", "Pending", "Delivered", "Canceled"].map((status) => (
          <TouchableOpacity key={status} onPress={() => setFilter(status)} style={{ backgroundColor: filter === status ? "#8E6652" : "#E5E8E8", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, alignSelf: "flex-start" }}>
            <Text style={{ color: filter === status ? "black" : "#8E6652", fontWeight: "bold", fontSize: 12 }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filteredOrders} renderItem={renderOrder} keyExtractor={(o) => o.id} ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40 }}>No orders found.</Text>} />
    </View>
  );
}
