import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Feather';

const Detail = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fefcfcff" }}>
      <View style={{ width: "100%", height: '250', backgroundColor: "hsla(225, 50%, 98%, 1.00)", alignItems: 'center' }}>
        <Image source={require("./local.png")} style={{ width: '50%', height: '250' }} />
        {/* <TouchableOpacity style={{width:"8%",height:30,backgroundColor:'pink',borderRadius:50,bottom:230,left:10}}>
           <Ionicons name="arrow-back-outline" size={24} color="black"/>
          </TouchableOpacity> */}
        <View style={{ width: '100%', backgroundColor: 'white', padding: 15, height: 80 }}>

          <Text style={{ fontWeight: 'bold' }}> Lehnga: Poly Silk {"\n"} Rs:35,999{"\n"} Rental Duration:7 Days{"\n"}</Text>
          <TouchableOpacity style={{ width: "20%", height: 30, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', marginRight: 15, borderRadius: 10, bottom: 40 }}>
            <Text style={{ fontSize: 17, fontFamily: 'Times New Roman', color: 'black' }}>Try On</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: 'white', padding: 15 }}>
          <Text style={{ fontWeight: 'bold' }}>Description:</Text>
          <Text style={{ fontWeight: 'bold' }}>Febric:</Text>
          <Text >Pishwas/ Dupatta: Organza,Lehnga: Poly SilkColor: Red,Length: 44-46 inches,Model Size: S</Text>
          <Text style={{ fontWeight: 'bold' }}>Note:</Text>
          <Text>Dry Clean only. Colors can slightly vary from pictures depending upon your device settings.</Text>

        </View>

        <View style={{ width: '100%', backgroundColor: 'white', height: 90 }}>
          <View style={{ flexDirection: 'row', padding: 15, gap: 160, backgroundColor: 'white', height: 45 }}>
            <Text>Color</Text>
            <Text>Size</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, padding: 15, height: 50, backgroundColor: 'white', alignItems: 'center' }}>
            <View style={{ width: 40, backgroundColor: 'green', height: 40, borderRadius: 50 }} />
            <View style={{ width: 40, backgroundColor: "#891111ff", height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }} >
              <Icon name="check" size={28} color="white" />
            </View>
            <View style={{ width: 40, backgroundColor: 'purple', height: 40, borderRadius: 50 }} />

            <View style={{ flexDirection: 'row', gap: 10, padding: 15 }}></View>
            <View style={{ width: 40, backgroundColor: "#e8e5e5ff", height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }} ><Text>S</Text>
            </View>
            <View style={{ width: 40, backgroundColor: "#ebe7e7ff", height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }} ><Text>M</Text>
            </View>
            <View style={{ width: 40, backgroundColor: "rgba(164, 123, 104, 1)", height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }} ><Text>L</Text>
            </View>
          </View>
          <View style={{ height: 90, backgroundColor: 'white', justifyContent: 'center', width: "100%", alignItems: 'center' }}>
            <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20 }}>
              <Text style={{ fontSize: 18 }}> Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </ScrollView>
  )
}
export default Detail