import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getSellerReviews, addReviewResponse } from "../Helper/firebaseHelper";

export default function SellerReviews({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [sellerId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      if (!sellerId) {
        setReviews([]);
        return;
      }
      const data = await getSellerReviews(sellerId);
      setReviews(data || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
      Alert.alert("Error", "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleAddResponse = async () => {
    if (!responseText.trim()) {
      Alert.alert("Error", "Please enter a response");
      return;
    }

    try {
      await addReviewResponse(selectedReview.id, responseText.trim());
      setResponseText("");
      setShowResponseModal(false);
      setSelectedReview(null);
      loadReviews(); // Refresh reviews
      Alert.alert("Success", "Response added successfully");
    } catch (error) {
      console.error("Error adding response:", error);
      Alert.alert("Error", "Failed to add response");
    }
  };

  const renderReview = ({ item }) => (
    <View style={{ borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 12, padding: 16, marginBottom: 12, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>{item.customer || "Anonymous"}</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Feather
            key={index}
            name="star"
            size={16}
            color={index < (item.rating || 0) ? "#FFA500" : "#E0E0E0"}
            style={{ marginRight: 2 }}
          />
        ))}
        <Text style={{ marginLeft: 8, color: "#666", fontSize: 14 }}>({item.rating || 0}/5)</Text>
      </View>

      <Text style={{ color: "#333", lineHeight: 20, marginBottom: 12 }}>{item.review || "No review text"}</Text>

      {item.sellerResponse && (
        <View style={{ backgroundColor: "#F8F9FA", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <Text style={{ fontWeight: "600", color: "#8E6652", marginBottom: 4 }}>Your Response:</Text>
          <Text style={{ color: "#333", fontSize: 14 }}>{item.sellerResponse}</Text>
        </View>
      )}

      {!item.sellerResponse && (
        <TouchableOpacity
          style={{ backgroundColor: "#8E6652", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: "flex-start" }}
          onPress={() => {
            setSelectedReview(item);
            setResponseText("");
            setShowResponseModal(true);
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Add Response</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FA" }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 16, color: "#666" }}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E0E0E0" }}>
        <Text style={{ fontSize: 21, fontWeight: "600", color: "#8E6652", marginLeft: 12 }}>Customer Reviews</Text>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id || Math.random().toString()}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Feather name="star" size={48} color="#CCC" />
              <Text style={{ textAlign: "center", marginTop: 16, color: "#666", fontSize: 16 }}>No reviews yet</Text>
              <Text style={{ textAlign: "center", marginTop: 8, color: "#999", fontSize: 14 }}>
                Customer reviews will appear here once you start receiving orders
              </Text>
            </View>
          }
        />
      </View>

      {/* Response Modal */}
      <Modal visible={showResponseModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#333" }}>Add Response</Text>
              <TouchableOpacity onPress={() => setShowResponseModal(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedReview && (
              <View style={{ marginBottom: 16, padding: 12, backgroundColor: "#F8F9FA", borderRadius: 8 }}>
                <Text style={{ fontWeight: "600", color: "#333" }}>{selectedReview.customer}'s Review:</Text>
                <Text style={{ color: "#666", fontSize: 14, marginTop: 4 }}>{selectedReview.review}</Text>
              </View>
            )}

            <TextInput
              value={responseText}
              onChangeText={setResponseText}
              placeholder="Write your response to this review..."
              multiline
              numberOfLines={4}
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 8,
                padding: 12,
                textAlignVertical: "top",
                marginBottom: 16,
                fontSize: 14,
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#E5E8E8", paddingVertical: 12, borderRadius: 8 }}
                onPress={() => setShowResponseModal(false)}
              >
                <Text style={{ textAlign: "center", color: "#666", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#8E6652", paddingVertical: 12, borderRadius: 8 }}
                onPress={handleAddResponse}
              >
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>Send Response</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
