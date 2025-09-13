import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from "react-native-reanimated-carousel";
import React, { useState } from 'react';
import { useEffect } from 'react';
import { getAllData } from '../Helper/firebaseHelper';
const { width } = Dimensions.get("window");

const Home2 = ({ navigation }) => {
    const images = [
        require("./Slide.png"),
        require("./Slider3.png"),
        require("./Slide4.png"),
    ];
      const [data, setData] = useState([]);
  const getDataFromDatabase = async () => {
    
      const cData = await getAllData("categories");  // Firestore se data fetch
           setData([  { name: "Mhndi", name1:"Barat", name2:"Walima",name3:"Festive", image: "url" } 
           
            ]);
  
  };
 useEffect(() => {
    getDataFromDatabase();
  }, [])

return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fdfdfdff" }}>
            
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Carousel loop width={width} height={200} autoPlay={true} data={images} scrollAnimationDuration={1000} renderItem={({ item }) => (
                    <Image source={item} style={{ width: "90%", height: "100%", borderRadius: 12, marginBottom: 40, marginHorizontal: 20, }} resizeMode="cover" />)} />
            </View>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, marginLeft: 20 }}>  Categories</Text>
              {data?.map((item, index) => (
            <View   key={index} style={{   flexDirection: 'row', justifyContent: "space-around", marginTop: 15 }}>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Mhndi")}>
                        <Image source={require("./pic.png")} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, marginTop: 5 }}>  {item.name}</Text>
                </View>

                <View key={index} style={{ alignItems: "center" }}>
                    <TouchableOpacity>
                        <Image source={require("./pic2.png")} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, marginTop: 5 }}>  {item.name1}</Text>
                </View>

                <View key={index} style={{ alignItems: "center" }}>
                    <TouchableOpacity>
                        <Image source={require("./pic3.png")} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, marginTop: 5 }}>  {item.name2}</Text>
                </View>

                <View key={index} style={{ alignItems: "center" }}>
                    <TouchableOpacity>
                        <Image source={require("./pic4.png")} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, marginTop: 5 }}>  {item.name3}</Text>
                </View>
            </View>
              ))}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 20, backgroundColor: 'white' }}>
                <View style={{ width: "45%" }}>
                    <TouchableOpacity >
                        < Image source={require("./pp.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity >
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Poly Silk Lehnga{"\n"}Rs:30,999</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Detail")}>
                        <Image source={require("./pp1.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Walima Maxy{"\n"}Rs:45,000</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./pp2.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Festive Lehnga{"\n"}Rs:46,500</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./pp4.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Party wear gown{"\n"}Rs:25,999</Text>
                </View>
            </View>
       
        </ScrollView>
    )
}

export default Home2;
