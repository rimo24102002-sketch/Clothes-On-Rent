import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

const Home2 = () => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fdfdfdff" }}>
            <View style={{ width: '90%', height: 200, alignSelf: 'center', backgroundColor: '#F3D5C6', borderRadius: 10, marginTop: 10, padding: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>New Collection</Text>
                <Text style={{ fontSize: 16, marginTop: 5 }}>Discount 50% {"\n"}for the {"\n"}first transaction</Text>
                <View style={{ width: "30%", height: 35, backgroundColor: "#a47b68", borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                    <Text style={{ fontSize: 17, color: 'white' }}>Rent Now</Text>
                </View>
                <View >
                    <Image source={require("./image.png")} style={{ width: "50%", height: 200, borderRadius: 10, bottom: 155, alignSelf: 'flex-end', left: 15 }} />
                </View>
            </View>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, marginLeft: 20, }}>Categories{"\n"}</Text>
            <View style={{ flexDirection: 'row', gap: 18, justifyContent: "space-between", backgroundColor: 'white' }}>
                <View style={{ width: "20%", height: 50, backgroundColor: "#ffffffff", borderRadius: 50, left: 20 }}><TouchableOpacity><Image source={require("./pic.png")} style={{ width: "70%", height: 60, borderRadius: 50, }} /></TouchableOpacity><Text style={{ fontSize: 14, marginTop: 5 }}>Mhndi</Text></View>
                <View style={{ width: "20%", height: 60, backgroundColor: "rgba(254, 252, 252, 1)", borderRadius: 5, left: 10 }}><TouchableOpacity><Image source={require("./pic2.png")} style={{ width: "80%", height: 60, borderRadius: 50, }} /></TouchableOpacity>  <Text style={{ fontSize: 14, marginTop: 5 }}>Barat</Text></View>
                <View style={{ width: "20%", height: 60, backgroundColor: "#fbfbfbff", borderRadius: 50 }}><TouchableOpacity><Image source={require("./pic3.png")} style={{ width: "80%", height: 60, borderRadius: 50, }} /></TouchableOpacity>  <Text style={{ fontSize: 14, marginTop: 5 }}>Walima</Text></View>
                <View style={{ width: "20%", height: 60, backgroundColor: "#fffaf8ff", borderRadius: 50 }}><TouchableOpacity><Image source={require("./pic4.png")} style={{ width: "80%", height: 60, borderRadius: 50, }} /></TouchableOpacity>  <Text style={{ fontSize: 14, marginTop: 5 }}>Festive</Text></View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 50, paddingHorizontal: 20, backgroundColor: 'white' }}>
                <View style={{ width: "45%" }}>
                    <TouchableOpacity>
                        <Image source={require("./pp.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Poly Silk Lehnga{"\n"}Rs:30,999</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
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
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 15, borderTopWidth: 1, borderColor: "#ccc" }}>
                <Icon name="home-outline" size={30} color="black" />
                <Icon name="search-outline" size={30} color="black" />
                <Icon name="cart-outline" size={30} color="black" />
                <Icon name="person-outline" size={30} color="black" />
            </View> */}
        </ScrollView>
    )
}

export default Home2;
