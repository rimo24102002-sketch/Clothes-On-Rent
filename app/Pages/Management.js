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
import Header from "../Components/Header";

export default function Management({ navigation }) {
  const user = useSelector((state) => state.home.user);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F1DCD1" }}>
     <Header 
        title="Management Center"
        onBackPress={() => navigation.goBack()}
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

          {/* Order Tracking */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("OrderTracking")}
          >
            <Ionicons name="location-outline" size={22} color="#8E6652" />
            <Text style={styles.actionText}>Order Tracking</Text>
            <Feather name="chevron-right" size={20} color="#8E6652" />
          </TouchableOpacity>

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
