import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'

const Home = ({navigation}) => {
     
  return (
    <View >
      <ImageBackground source={require('./Home.png')}style={{width:"100%",height:730 }} >
       <Text style={{fontWeight: 'bold', fontSize: 24, marginLeft: 20 }} >Rent Clothes</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center', marginRight: 35,marginTop:120}}>Sign In As</Text>
      <TouchableOpacity style={{ width:"35%", height: 35, backgroundColor: "#a47b68", borderRadius: 15, alignItems: 'center', justifyContent: 'center', fontSize: 20, marginLeft: "30%", color: "white",marginTop:20 }}>
        <Text style={{fontSize: 17, fontFamily: 'Times New Roman', color: 'white'}} onPress={() => navigation.navigate("Signup")}>Customer</Text>
        </TouchableOpacity>
      <TouchableOpacity style={{ width: "35%", height: 35, backgroundColor: "#a47b68", borderRadius: 15, alignItems: 'center', justifyContent: 'center', fontSize: 20,marginLeft: "30%", color: "white",marginTop:18 }}>
          <Text style={{fontSize: 17, fontFamily: 'Times New Roman', color: 'white'}} onPress={() => navigation.navigate("Signup")}>Seller</Text>

      </TouchableOpacity>
    </ImageBackground>
    </View>
  )
}

export default Home
