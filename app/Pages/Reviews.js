import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SellerReviews() {
  const [reviews] = useState([
    {
      id: "1",
      customer: "Ali Khan",
      rating: 4,
      review: "Good quality product, satisfied!",
      photo: true,
    },
    {
      id: "2",
      customer: "Sara Ahmed",
      rating: 5,
      review: "Excellent! Highly recommended.",
      photo: false,
    },
  ]);

  const renderReview = ({ item }) => (
    <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.customer}</Text>

      <View style={{ flexDirection: "row", marginVertical: 5 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons
            key={index}
            name={index < item.rating ? "star" : "star-outline"}
            size={20}
            color="#FFA500"
            style={{ marginRight: 3 }}
          />
        ))}
      </View>

      <Text>{item.review}</Text>

      {item.photo && (
        <TouchableOpacity style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="image-outline" size={20} color="#8E6652" />
          <Text style={{ marginLeft: 5, color: "#8E6652" }}>View Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#8E6652" }}>
        Customer Reviews
      </Text>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No reviews yet.</Text>}
      />
    </View>
  );
}
