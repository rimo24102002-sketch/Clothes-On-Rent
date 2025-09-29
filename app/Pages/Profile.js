import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, Image, Modal } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { updateData, uploadImageToCloudinary } from "../Helper/firebaseHelper";

export default function Profile({ navigation }) {
  const user = useSelector((state) => state.home.user);

  const [name, setName] = useState(user?.name || "User Name");
  const [shopName, setShopName] = useState(user?.shopName || "Your Shop");
  const [imageUrl, setImageUrl] = useState(user?.profileImage || null);
  const [showImageModal, setShowImageModal] = useState(false);

  const showImageOptions = () => setShowImageModal(true);

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const imageUri = result.assets[0].uri;
        const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
        console.log("Uploaded Image URL:", uploadedImageUrl);
        
        setImageUrl(uploadedImageUrl);
        updateData("users", user.uid, { profileImage: uploadedImageUrl });
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const removeProfile = () => {
    setShowImageModal(false);
    setImageUrl(null);
    updateData("users", user.uid, { profileImage: null });
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#F1DCD1"}}>
      <ScrollView contentContainerStyle={{paddingBottom:20}}>
        {/* Header */}
        <View style={{flexDirection:"row",alignItems:"center",paddingHorizontal:24,paddingVertical:20,backgroundColor:"#8E6652"}}>
          <TouchableOpacity style={{padding:8}} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{fontSize:20,fontWeight:"700",color:"#fff",marginLeft:10}}>Seller Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={{backgroundColor:"#fff",margin:24,borderRadius:20,padding:20,alignItems:"center"}}>
          <TouchableOpacity style={{marginBottom:15}} onPress={showImageOptions}>
            <View style={{width:100,height:100,borderRadius:50,backgroundColor:"#F9F9F9",justifyContent:"center",alignItems:"center",borderWidth:2,borderColor:"#F1DCD1",position:"relative"}}>
              {imageUrl !== null ? (
                <>
                  <Image source={{ uri: imageUrl }} style={{width:96,height:96,borderRadius:48}} resizeMode="cover" />
                  <View style={{position:"absolute",bottom:-5,right:-5,backgroundColor:"#8E6652",borderRadius:15,width:30,height:30,justifyContent:"center",alignItems:"center",borderWidth:2,borderColor:"#fff"}}>
                    <Feather name="edit-2" size={14} color="#fff" />
                  </View>
                </>
              ) : (
                <>
                  <Feather name="plus" size={40} color="#8E6652" />
                  <Text style={{fontSize:12,color:"#8E6652",marginTop:5,textAlign:"center"}}>Add Photo</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TextInput 
            value={name} 
            onChangeText={setName} 
            style={{fontSize:16,fontWeight:"800",color:"#333",borderWidth:1,borderColor:"#8E6652",borderRadius:12,paddingHorizontal:12,paddingVertical:8,marginTop:8,textAlign:"center",width:200}} 
            placeholder="Enter Name" 
          />
          <Text style={{fontSize:16,color:"#8E6652",fontWeight:"600",marginTop:8}}>{user?.role || "Seller"}</Text>
        </View>

        {/* Info Section */}
        <View style={{backgroundColor:"#fff",marginHorizontal:24,borderRadius:16,padding:16}}>
          <View style={{flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:"#F5F5F5",paddingVertical:12}}>
            <Feather name="mail" size={20} color="#8E6652" />
            <Text style={{fontSize:16,color:"#333",fontWeight:"600",flex:1,marginLeft:10}}>Email</Text>
            <Text style={{fontSize:16,color:"#666",fontWeight:"600"}}>{user?.email || "your@email.com"}</Text>
          </View>

          <View style={{flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:"#F5F5F5",paddingVertical:12}}>
            <Feather name="user" size={20} color="#8E6652" />
            <Text style={{fontSize:16,color:"#333",fontWeight:"600",flex:1,marginLeft:10}}>Seller ID</Text>
            <Text style={{fontSize:16,color:"#666",fontWeight:"600"}}>{user?.sellerId || user?.uid || "SLR-XXXXXX"}</Text>
          </View>

          <View style={{flexDirection:"row",alignItems:"center",paddingVertical:12}}>
            <MaterialIcons name="storefront" size={20} color="#8E6652" />
            <Text style={{fontSize:16,color:"#333",fontWeight:"600",flex:1,marginLeft:10}}>Shop Name</Text>
            <TextInput 
              value={shopName} 
              onChangeText={setShopName} 
              style={{borderWidth:1,borderColor:"#8E6652",borderRadius:8,paddingHorizontal:8,flex:1,textAlign:"left"}} 
              placeholder="Enter Shop Name" 
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{paddingHorizontal:24,marginTop:24,gap:16}}>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"#F8F8F8",borderWidth:1,borderColor:"#E0E0E0",padding:16,borderRadius:12}} onPress={() => navigation.navigate("Home")}>
            <Feather name="user" size={20} color="#666" />
            <Text style={{color:"#666",fontSize:16,fontWeight:"600",marginLeft:10,flex:1}}>Switch to Customer View</Text>
            <Feather name="chevron-right" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Options Modal */}
      <Modal visible={showImageModal} transparent={true} animationType="slide" onRequestClose={() => setShowImageModal(false)}>
        <View style={{flex:1,justifyContent:"flex-end",backgroundColor:"rgba(0,0,0,0.5)"}}>
          <View style={{backgroundColor:"#fff",padding:20,borderTopLeftRadius:20,borderTopRightRadius:20}}>
            <Text style={{fontSize:18,fontWeight:"700",color:"#333",marginBottom:20,textAlign:"center"}}>Profile Picture Options</Text>

            {/* Choose from Gallery */}
            <TouchableOpacity style={{flexDirection:"row",alignItems:"center",paddingVertical:15,borderBottomWidth:1,borderBottomColor:"#F5F5F5"}} onPress={handleImagePicker}>
              <View style={{width:40,height:40,borderRadius:20,backgroundColor:"#F1DCD1",justifyContent:"center",alignItems:"center"}}>
                <Feather name="image" size={20} color="#8E6652" />
              </View>
              <Text style={{fontSize:16,color:"#333",fontWeight:"600",marginLeft:15}}>Choose from Gallery</Text>
            </TouchableOpacity>

            {/* Remove Image (only if exists) */}
            {imageUrl && (
              <TouchableOpacity style={{flexDirection:"row",alignItems:"center",paddingVertical:15,borderBottomWidth:1,borderBottomColor:"#F5F5F5"}} onPress={removeProfile}>
                <View style={{width:40,height:40,borderRadius:20,backgroundColor:"#FFE5E5",justifyContent:"center",alignItems:"center"}}>
                  <Feather name="trash-2" size={20} color="#FF6B6B" />
                </View>
                <Text style={{fontSize:16,color:"#FF6B6B",fontWeight:"600",marginLeft:15}}>Remove Current Image</Text>
              </TouchableOpacity>
            )}

            {/* Cancel Button */}
            <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"center",paddingVertical:15,backgroundColor:"#8E6652",borderRadius:12,marginTop:20}} onPress={() => setShowImageModal(false)}>
              <Feather name="x" size={20} color="#fff" />
              <Text style={{fontSize:16,color:"#fff",fontWeight:"600",marginLeft:10}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
