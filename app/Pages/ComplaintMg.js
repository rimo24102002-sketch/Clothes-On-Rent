import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Alert, TextInput, Modal } from "react-native";
import { useSelector } from "react-redux";
import { listComplaintsBySeller, addComplaintResponse, resolveComplaint, updateComplaint, addSampleComplaints } from "../Helper/firebaseHelper";
import { Feather } from "@expo/vector-icons";

export default function ComplaintsManagement() {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Load complaints from Firebase
  const loadComplaints = async () => {
    try {
      setLoading(true);
      console.log("Loading complaints for sellerId:", sellerId);
      
      if (!sellerId) {
        console.log("No sellerId found, setting empty complaints");
        setComplaints([]);
        return;
      }
      
      const data = await listComplaintsBySeller(sellerId);
      console.log("Loaded complaints data:", data);
      setComplaints(data || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
      Alert.alert("Error", "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [sellerId]);

  // Handle adding response to complaint
  const handleAddResponse = async () => {
    if (!responseText.trim()) {
      Alert.alert("Error", "Please enter a response");
      return;
    }

    try {
      await addComplaintResponse(selectedComplaint.id, responseText.trim());
      setResponseText("");
      setShowResponseModal(false);
      setSelectedComplaint(null);
      loadComplaints(); // Refresh the list
      Alert.alert("Success", "Response added successfully");
    } catch (error) {
      console.error("Error adding response:", error);
      Alert.alert("Error", "Failed to add response");
    }
  };

  // Handle resolving complaint
  const handleResolveComplaint = async (complaint) => {
    Alert.alert(
      "Resolve Complaint",
      "Are you sure you want to mark this complaint as resolved?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Resolve",
          onPress: async () => {
            try {
              await resolveComplaint(complaint.id);
              loadComplaints(); // Refresh the list
              Alert.alert("Success", "Complaint marked as resolved");
            } catch (error) {
              console.error("Error resolving complaint:", error);
              Alert.alert("Error", "Failed to resolve complaint");
            }
          },
        },
      ]
    );
  };

  // Add sample complaints for testing
  const handleAddSampleData = async () => {
    // Debug: Check if sellerId exists
    if (!sellerId) {
      Alert.alert("Error", "Seller ID not found. Please make sure you're logged in as a seller.");
      return;
    }

    console.log("Adding sample data for sellerId:", sellerId);
    
    Alert.alert(
      "Add Sample Data",
      `This will add 3 sample complaints for seller: ${sellerId}. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: async () => {
            try {
              console.log("Calling addSampleComplaints with sellerId:", sellerId);
              await addSampleComplaints(sellerId);
              console.log("Sample complaints added, now loading...");
              await loadComplaints();
              Alert.alert("Success", "Sample complaints added!");
            } catch (error) {
              console.error("Error adding sample data:", error);
              Alert.alert("Error", `Failed to add sample data: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const filteredComplaints = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  const renderComplaint = ({ item }) => (
    <View style={{ borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: "#fff" }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>Complaint #{item.id}</Text>
      <Text style={{ color: "#666", marginTop: 2 }}>Order: {item.orderId || "N/A"}</Text>
      <Text style={{ color: "#666" }}>Customer: {item.customer || "Unknown"}</Text>
      <Text style={{ color: "#666" }}>Type: {item.type || "General"} • {item.priority || "Medium"}</Text>
      <Text style={{ color: "#333", marginTop: 4 }}>Description: {item.description || "No description"}</Text>

      <View style={{ backgroundColor: item.status === "Open" ? "#FAD7A0" : item.status === "In Progress" ? "#F9E79F" : item.status === "Resolved" ? "#ABEBC6" : "#D7DBDD", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 }}>
        <Text style={{ color: item.status === "Open" ? "#7e5005ff" : item.status === "In Progress" ? "#af8400ff" : item.status === "Resolved" ? "#07863cff" : "#566573", fontSize: 12, fontWeight: "bold" }}>{item.status}</Text>
      </View>

      {item.response ? (
        <Text style={{ marginTop: 8, fontStyle: "italic", color: "#333", backgroundColor: "#F8F9FA", padding: 8, borderRadius: 6 }}>
          Response: {item.response}
        </Text>
      ) : null}

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
        {item.status !== "Resolved" && (
          <>
            <TouchableOpacity
              style={{ backgroundColor: "#8E6652", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flex: 1 }}
              onPress={() => {
                setSelectedComplaint(item);
                setResponseText(item.response || "");
                setShowResponseModal(true);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "center" }}>
                {item.response ? "Update Response" : "Add Response"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ backgroundColor: "#28A745", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flex: 1 }}
              onPress={() => handleResolveComplaint(item)}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "center" }}>Mark Resolved</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {item.createdAt && (
        <Text style={{ fontSize: 10, color: "#999", marginTop: 8 }}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FA" }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading complaints...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#8E6652" }}>Complaints Management</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {complaints.length === 0 && (
              <TouchableOpacity onPress={handleAddSampleData}>
                <Feather name="plus" size={20} color="#8E6652" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={loadComplaints}>
              <Feather name="refresh-cw" size={20} color="#8E6652" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {["All", "Open", "In Progress", "Resolved"].map((status) => (
            <TouchableOpacity 
              key={status} 
              onPress={() => setFilter(status)} 
              style={{ 
                backgroundColor: filter === status ? "#8E6652" : "#E5E8E8", 
                paddingVertical: 8, 
                paddingHorizontal: 16, 
                borderRadius: 20, 
                marginRight: 8 
              }}
            >
              <Text style={{ 
                color: filter === status ? "#fff" : "#8E6652", 
                fontWeight: "600", 
                fontSize: 12 
              }}>
                {status} ({status === "All" ? complaints.length : complaints.filter(c => c.status === status).length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList 
        data={filteredComplaints} 
        renderItem={renderComplaint} 
        keyExtractor={(c) => c.id || Math.random().toString()} 
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Feather name="inbox" size={48} color="#CCC" />
            <Text style={{ textAlign: "center", marginTop: 16, color: "#666", fontSize: 16 }}>
              {filter === "All" ? "No complaints yet" : `No ${filter.toLowerCase()} complaints`}
            </Text>
            <Text style={{ textAlign: "center", marginTop: 8, color: "#999", fontSize: 14 }}>
              Complaints from customers will appear here
            </Text>
          </View>
        } 
      />

      {/* Response Modal */}
      <Modal visible={showResponseModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#333" }}>
                {selectedComplaint?.response ? "Update Response" : "Add Response"}
              </Text>
              <TouchableOpacity onPress={() => setShowResponseModal(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedComplaint && (
              <View style={{ marginBottom: 16, padding: 12, backgroundColor: "#F8F9FA", borderRadius: 8 }}>
                <Text style={{ fontWeight: "600", color: "#333" }}>Complaint #{selectedComplaint.id}</Text>
                <Text style={{ color: "#666", fontSize: 12 }}>{selectedComplaint.description}</Text>
              </View>
            )}

            <TextInput
              value={responseText}
              onChangeText={setResponseText}
              placeholder="Enter your response to this complaint..."
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
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>
                  {selectedComplaint?.response ? "Update" : "Send"} Response
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
