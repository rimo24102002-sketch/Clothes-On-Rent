import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  SafeAreaView, 
  RefreshControl, 
  ActivityIndicator, 
  TextInput, 
  Alert 
} from "react-native";
import { useSelector } from "react-redux";
import { listOrdersBySeller, updateOrder } from "../Helper/firebaseHelper";
import { Feather } from "@expo/vector-icons";
import StandardHeader from '../Components/StandardHeader';

export default function SellerOrders({ navigation }) {
  const user = useSelector((s) => s.home.user);
  const sellerId = user?.sellerId || user?.uid || "";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!sellerId) { setOrders([]); return; }
      const list = await listOrdersBySeller(sellerId);
      setOrders(list);
    };
    load();
  }, [sellerId]);

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
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity style={{ backgroundColor: '#8E6652', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} onPress={async () => {
          await updateOrder(item.id, { status: 'Delivered' });
          const list = await listOrdersBySeller(sellerId);
          setOrders(list);
        }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Mark Delivered</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#ccc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} onPress={async () => {
          await updateOrder(item.id, { status: 'Canceled' });
          const list = await listOrdersBySeller(sellerId);
          setOrders(list);
        }}>
          <Text style={{ color: '#333', fontWeight: '700' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      <StandardHeader 
        title="Order Management" 
        navigation={navigation} 
      />
      <View style={{ flex: 1, padding: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {["All", "Pending", "Delivered", "Canceled"].map((status) => (
          <TouchableOpacity key={status} onPress={() => setFilter(status)} style={{ backgroundColor: filter === status ? "#8E6652" : "#E5E8E8", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, alignSelf: "flex-start" }}>
            <Text style={{ color: filter === status ? "black" : "#8E6652", fontWeight: "bold", fontSize: 12 }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filteredOrders} renderItem={renderOrder} keyExtractor={(o) => o.id} ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40 }}>No orders found.</Text>} />
      </View>
    </SafeAreaView>
  );
}
