import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, Image, Modal, ActivityIndicator, Alert } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { updateData, uploadImageToCloudinary, getSellerApprovalStatus, submitSellerForApproval } from "../Helper/firebaseHelper";
import Header from "../Components/Header";

export default function Profile({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;

  const [name, setName] = useState(user?.name || "User Name");
  const [shopName, setShopName] = useState(user?.shopName || "Your Shop");
  const [imageUrl, setImageUrl] = useState(user?.profileImage || null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load approval status on component mount
  useEffect(() => {
    loadApprovalStatus();
  }, [sellerId]);

  const loadApprovalStatus = async () => {
    try {
      if (!sellerId) return;
      const status = await getSellerApprovalStatus(sellerId);
      setApprovalStatus(status);
      console.log('Seller approval status:', status);
    } catch (error) {
      console.error('Error loading approval status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!name.trim() || !shopName.trim()) {
      Alert.alert('Error', 'Please fill in your name and shop name before submitting for approval.');
      return;
    }

    try {
      setSubmitting(true);
      const sellerData = {
        name: name.trim(),
        shopName: shopName.trim(),
        email: user?.email || ''
      };
      
      await submitSellerForApproval(sellerId, sellerData);
      await loadApprovalStatus(); // Reload status
      
      Alert.alert(
        'Submitted for Approval', 
        'Your profile has been submitted for admin approval. You will be notified once reviewed.'
      );
    } catch (error) {
      console.error('Error submitting for approval:', error);
      Alert.alert('Error', 'Failed to submit for approval. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showImageOptions = () => setShowImageModal(true);

  const handleImagePicker = async () => {
    try {
      // Close modal immediately when option is selected
      setShowImageModal(false);
      
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
    // Close modal immediately when option is selected
    setShowImageModal(false);
    setImageUrl(null);
    updateData("users", user.uid, { profileImage: null });
  };

  if (loading) {
    return (
      <SafeAreaView style={{flex:1,backgroundColor:"#F1DCD1",justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{marginTop:16,fontSize:16,color:"#8E6652",fontWeight:"600"}}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#28A745';
      case 'rejected': return '#DC3545';
      case 'pending': 
      default: return '#FFC107';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approved ✓';
      case 'rejected': return 'Rejected ✗';
      case 'pending': 
      default: return 'Pending Review ⏳';
    }
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#F1DCD1"}}>
      <ScrollView contentContainerStyle={{paddingBottom:20}}>
      <Header 
        title="Seller Profile"
        onBackPress={() => navigation.goBack()}
      />

        {/* Approval Status Banner */}
        {approvalStatus && (
          <View style={{
            backgroundColor: approvalStatus.status === 'approved' ? '#D4EDDA' : 
                           approvalStatus.status === 'rejected' ? '#F8D7DA' : '#FFF3CD',
            marginHorizontal: 24,
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: getStatusColor(approvalStatus.status)
          }}>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
              <View style={{flex:1}}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: approvalStatus.status === 'approved' ? '#155724' : 
                         approvalStatus.status === 'rejected' ? '#721C24' : '#856404'
                }}>
                  Account Status: {getStatusText(approvalStatus.status)}
                </Text>
                <Text style={{
                  fontSize: 14,
                  marginTop: 4,
                  color: approvalStatus.status === 'approved' ? '#155724' : 
                         approvalStatus.status === 'rejected' ? '#721C24' : '#856404'
                }}>
                  {approvalStatus.status === 'pending' && 'Your profile is under admin review. Please wait for approval.'}
                  {approvalStatus.status === 'approved' && 'Your seller account has been approved! You can now access all features.'}
                  {approvalStatus.status === 'rejected' && `Your application was rejected. ${approvalStatus.comments || 'Please contact support.'}`}
                </Text>
              </View>
            </View>
          </View>
        )}

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

        {/* Info Section - Show based on approval status */}
        <View style={{backgroundColor:"#fff",marginHorizontal:24,borderRadius:16,padding:16}}>
          {approvalStatus?.status === 'approved' ? (
            <>
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
            </>
          ) : (
            <View style={{alignItems:"center",paddingVertical:20}}>
              <Feather name="clock" size={48} color="#FFC107" />
              <Text style={{fontSize:18,fontWeight:"700",color:"#856404",marginTop:12,textAlign:"center"}}>
                Profile Under Review
              </Text>
              <Text style={{fontSize:14,color:"#856404",marginTop:8,textAlign:"center",lineHeight:20}}>
                Your email and shop details will be visible once your account is approved by admin.
              </Text>
              
              {approvalStatus?.status === 'pending' && (
                <TouchableOpacity 
                  style={{
                    backgroundColor:"#8E6652",
                    paddingHorizontal:20,
                    paddingVertical:12,
                    borderRadius:8,
                    marginTop:16,
                    flexDirection:"row",
                    alignItems:"center"
                  }}
                  onPress={handleSubmitForApproval}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Feather name="send" size={16} color="#fff" />
                  )}
                  <Text style={{color:"#fff",fontWeight:"600",marginLeft:8}}>
                    {submitting ? 'Submitting...' : 'Resubmit for Approval'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons - Only show if approved */}
        {approvalStatus?.status === 'approved' && (
          <View style={{paddingHorizontal:24,marginTop:24,gap:16}}>
            <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"#F8F8F8",borderWidth:1,borderColor:"#E0E0E0",padding:16,borderRadius:12}} onPress={() => navigation.navigate("Home")}>
              <Feather name="user" size={20} color="#666" />
              <Text style={{color:"#666",fontSize:16,fontWeight:"600",marginLeft:10,flex:1}}>Switch to Customer View</Text>
              <Feather name="chevron-right" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Image Options Modal */}
      <Modal visible={showImageModal} transparent={true} animationType="slide" onRequestClose={() => setShowImageModal(false)}>
        <TouchableOpacity 
          style={{flex:1,justifyContent:"flex-end",backgroundColor:"rgba(0,0,0,0.5)"}}
          activeOpacity={1}
          onPress={() => setShowImageModal(false)}
        >
          <TouchableOpacity 
            style={{backgroundColor:"#fff",padding:20,borderTopLeftRadius:20,borderTopRightRadius:20}}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
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
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
