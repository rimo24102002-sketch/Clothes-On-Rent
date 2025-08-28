import { View, Text, ScrollView, Image, TouchableOpacity,TextInput } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";

const Cart = () => {
    return (
        <ScrollView style={{ backgroundColor: "#F3D5C6", height: '1000%' }}>
            <View style={{ width: '100%', height: 380 }}>
                <View style={{ alignItems: "center", padding: 15, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>Your Cart</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3D5C6", padding: 10 }}>
                    <Image source={require('./Bold.png')} style={{ width: 70, height: 90, borderRadius: 8, marginRight: 12 }} />
                    <View style={{ backgroundColor: "#F3D5C6", width: '60%' }}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Eastern Gharara</Text>
                        <Text style={{ fontSize: 14, color: "gray", marginVertical: 5 }}>Rs: 39,999</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                            <TouchableOpacity style={{ width: '15%', height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>-</Text>
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8 }}>1</Text>
                            <TouchableOpacity style={{ width: 32, height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ fontSize: 14, marginHorizontal: 8 }}>M</Text>
                    <TouchableOpacity>
                        <Ionicons name="trash-outline" size={22} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3D5C6", padding: 10, }}>
                    <Image source={require('./Bold1.png')} style={{ width: 70, height: 90, borderRadius: 8, marginRight: 12 }} />
                    <View style={{ backgroundColor: "#F3D5C6", width: '60%' }}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Lehnga</Text>
                        <Text style={{ fontSize: 14, color: "gray", marginVertical: 5 }}>Rs:32,000</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                            <TouchableOpacity style={{ width: '15%', height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>-</Text>
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8 }}>1</Text>
                            <TouchableOpacity style={{ width: 32, height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ fontSize: 14, marginHorizontal: 8 }}>L</Text>
                    <TouchableOpacity>
                        <Ionicons name="trash-outline" size={22} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3D5C6", padding: 10 }}>
                    <Image source={require('./Bold2.png')} style={{ width: 70, height: 90, borderRadius: 8, marginRight: 12 }} />
                    <View style={{ backgroundColor: "#F3D5C6", width: '60%' }}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Sharara</Text>
                        <Text style={{ fontSize: 14, color: "gray", marginVertical: 5 }}>Rs: 17,875</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                            <TouchableOpacity style={{ width: '15%', height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>-</Text>
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8 }}>1</Text>
                            <TouchableOpacity style={{ width: 32, height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ fontSize: 14, marginHorizontal: 8 }}>S</Text>
                    <TouchableOpacity>
                        <Ionicons name="trash-outline" size={22} color="black" />
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{ backgroundColor: 'white', height:350, width: '100%',}}>
                <View style={{ backgroundColor: 'white', padding: 20,flexDirection:'row' ,gap:130 }}>
                    <Text>Product Price</Text>
                     <TextInput placeholder="Rs:...." style={{marginTop:'-8'}}></TextInput>
                </View>

                <View style={{ backgroundColor: 'white', padding: 20,flexDirection:'row' ,gap:170 }}>
                    <Text>Shipping</Text>
                     <TextInput placeholder="....." style={{marginTop:'-8'}}></TextInput>
                </View>

                <View style={{ backgroundColor: 'white', padding: 20,flexDirection:'row' ,gap:170 }}>
                    <Text>Subtotal</Text>
                     <TextInput placeholder="....." style={{marginTop:'-8'}}></TextInput>
                </View>
                <View style={{ backgroundColor: 'white', padding: 30 }}>
                    <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20 }}>
                        <Text style={{ fontSize: 18 }}>Proceed to checkout</Text>
                    </TouchableOpacity>
                </View>
            </View>




        </ScrollView>
    )
}

export default Cart;
