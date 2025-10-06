import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Alert } from "react-native";
import StandardHeader from '../Components/StandardHeader';
import { addSampleOrders, addSampleDeliveries } from '../Helper/firebaseHelper';

export default function Management({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid || '';

  const handleAddSampleOrders = async () => {
    try {
      await addSampleOrders(sellerId);
      Alert.alert("Success", "Sample orders added successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to add sample orders");
    }
  };

  const handleAddSampleDeliveries = async () => {
    try {
      await addSampleDeliveries(sellerId);
      Alert.alert("Success", "Sample deliveries added successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to add sample deliveries");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F1DCD1" }}>
      <StandardHeader 
        title="Management Center" 
        navigation={navigation} 
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

        {/* Management Options */}
        <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 16 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#8E6652",
              padding: 16,
              borderRadius: 12,
            }}
            onPress={() => navigation.navigate("ViewProduct")}
          >
            <Feather name="package" size={20} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "700",
                marginLeft: 10,
              }}
            >
              View Product
            </Text>
          </TouchableOpacity>

          {/* Pickup */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("PickUp")}
          >
            <Ionicons name="bicycle" size={22} color="#8E6652" />
            <Text style={styles.actionText}>Pickup Management</Text>
            <Feather name="chevron-right" size={20} color="#8E6652" />
          </TouchableOpacity>

          {/* Delivery */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("Delivery")}
          >
            <Ionicons name="car-outline" size={22} color="#8E6652" />
            <Text style={styles.actionText}>Delivery Management</Text>
            <Feather name="chevron-right" size={20} color="#8E6652" />
          </TouchableOpacity>

          {/* Orders */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("OrderPayment")}
          >
            <Ionicons name="clipboard-outline" size={22} color="#8E6652" />
            <Text style={styles.actionText}>Order Management</Text>
            <Feather name="chevron-right" size={20} color="#8E6652" />
          </TouchableOpacity>

          {/* Sample Data Section */}
          <View style={{ marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E0E0E0' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#8E6652', marginBottom: 16, textAlign: 'center' }}>
              Testing & Development
            </Text>
            
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' }]}
              onPress={handleAddSampleOrders}
            >
              <Ionicons name="receipt-outline" size={22} color="#4CAF50" />
              <Text style={[styles.actionText, { color: '#4CAF50' }]}>Add Sample Orders</Text>
              <Feather name="chevron-right" size={20} color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FFF3E0', borderColor: '#FF9800' }]}
              onPress={handleAddSampleDeliveries}
            >
              <Ionicons name="car-sport-outline" size={22} color="#FF9800" />
              <Text style={[styles.actionText, { color: '#FF9800' }]}>Add Sample Deliveries</Text>
              <Feather name="chevron-right" size={20} color="#FF9800" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8E6652",
    padding: 16,
    borderRadius: 12,
  },
  actionText: {
    color: "#8E6652",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
    flex: 1,
  },
};
