import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Splash = ({navigation}) => {
  return (
    <ScrollView style={{ backgroundColor: "#fdfdfdff", height: '100%' }}>
      <ImageBackground source={require('./splash.png')} style={{ width: "100%", height: 730 }} >

        <Text style={{ fontWeight: 'bold', fontSize: 24, marginLeft: 20 }}>Rent Clothes</Text>
        <Text style={{ fontSize: 24, marginLeft: 20 }}>LAAM</Text>

        <TouchableOpacity style={{ backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 10, width: "60%", height: 50, alignSelf: 'center', marginTop: 530, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#fff', width: 40, height: 40, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: 0 }}>
            <Ionicons name="chevron-forward" size={24} color="#5a3a2c" />
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white', }}onPress={() => navigation.navigate("Home")}>GET STARTED</Text>
        </TouchableOpacity>

      </ImageBackground>
    </ScrollView>
  )
}

export default Splash;
