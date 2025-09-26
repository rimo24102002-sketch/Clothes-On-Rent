import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const RatingScreen = () => {
  return (
    <ScrollView style={{ backgroundColor: "#fff", height: "100%", padding: 20 }}>
      {/* <TouchableOpacity>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity> */}
      <Text style={{ fontSize: 18, fontWeight: "bold"}}>Rating and Reviews</Text>
     
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5,gap:5 }}>
      
      </View>
 
      <Text style={{ fontSize: 16, fontWeight:'bold'}}>What is your rate?</Text>
      <View style={{ flexDirection: "row" }}>
        <Ionicons name="star" size={32} color="#FFA500" style={{ marginRight: 5 }} />
        <Ionicons name="star" size={32} color="#FFA500" style={{ marginRight: 5 }} />
        <Ionicons name="star" size={32} color="#FFA500" style={{ marginRight: 5 }} />
        <Ionicons name="star" size={32} color="#FFA500" style={{ marginRight: 5 }} />
        <Ionicons name="star-outline" size={32} color="#aaa" />
      </View>
      <Text style={{ marginTop: 15, fontWeight: "bold", fontSize: 14, textAlign: "center" }}>
        Please share your opinion {"\n"} about the product
      </Text>
      <TextInput style={{ width: "100%",  height: 200, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 15, textAlignVertical: "top" }} placeholder='Write your review...'/>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#f9f1ed", justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="camera-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={{ marginTop: 5 }}>Add your photo</Text>
      </View>
   <View style={{ backgroundColor: 'white', padding: 30, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20,marginTop:'50' }}>
                    <Text style={{ fontSize: 18 }}>Submit Review</Text>
                </TouchableOpacity>
            </View>
    </ScrollView>
  );
};

export default RatingScreen;
