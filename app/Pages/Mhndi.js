import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

const Mhndi = ({}) => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 50, paddingHorizontal: 20, backgroundColor: 'white' }}>
                <View style={{ width: "45%" }}>
                    <TouchableOpacity>
                        <Image source={require("./m1.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Poly Silk Lehnga{"\n"}Rs:30,999</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./m9.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Lehnga{"\n"}Rs:45,000</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./m3.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>sharara{"\n"}Rs:46,500</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./m4.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Lhnga{"\n"}Rs:25,000</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 20, backgroundColor: 'white' }}>
                <View style={{ width: "45%" }}>
                    <TouchableOpacity>
                        <Image source={require("./m5.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Poly Silk Lehnga{"\n"}Rs:32,999</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./m6.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Embroided Lhnga{"\n"}Rs:45,000</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./m7.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Festive Lehnga{"\n"}Rs:46,500</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./m2.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Lhnga{"\n"}Rs:25,999</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 20, backgroundColor: 'white' }}>
                <View style={{ width: "45%" }}>
                    <TouchableOpacity>
                        <Image source={require("./m8.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Poly Silk Lehnga{"\n"}Rs:39,999</Text>
                </View>
                <View style={{ width: "45%", marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={require("./pp4.png")} style={{ width: "100%", height: 170, borderRadius: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", marginTop: 5 }}>Mhndi sharar{"\n"}Rs:42,000</Text>
                </View>

            </View>
        </ScrollView>
    );
};

export default Mhndi
