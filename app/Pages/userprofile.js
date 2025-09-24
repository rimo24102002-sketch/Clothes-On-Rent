import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { addData, uploadImageToCloudinary } from "../Helper/firebaseHelper";


const Profile = () => {

    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [address, setaddress] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [email, setemail] = useState("");
    const handleSubmit = async () => {

        if (firstname == "" || lastname == "" || address == "" || phonenumber == "" || email == "" || imageUrl == "") {
            alert("Please fill all fields before submitting.")
            return
        }

        await addData("customer", { firstname, lastname, address, phonenumber, email, imageUrl });
    };
    const handleImagePicker = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType,
                allowsEditing: true,
                quality: 1,
            });


            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const uploadedImageUrl = await uploadImageToCloudinary(imageUri)
                setImageUrl(uploadedImageUrl)
                alert(uploadedImageUrl)
            }


        } catch (error) {

            console.log("Error picking image:", error);

        }

    }
    return (
        <ScrollView style={{ backgroundColor: "#ffffffff", height: '100%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 10 }}> Profile Setting </Text>

            <View style={{ alignItems: 'center', paddingVertical: 15, backgroundColor: 'white' }}>

                <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3D5C6', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={handleImagePicker}>
                        {imageUrl != "" ?
                            <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            : <Ionicons name="camera-outline" size={40} color="#000" />
                        }
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{ width: '90%', alignSelf: 'center', height: 50, justifyContent: 'center', flexDirection: 'row', gap: 30 }}>
                <TextInput placeholder='First Name' onChangeText={(e) => setfirstname(e)} style={{ borderBottomWidth: 1, borderColor: '#ccc', width: '45%' }} />
                <TextInput placeholder='Last Name' onChangeText={(e) => setlastname(e)} style={{ borderBottomWidth: 1, borderColor: '#ccc', width: '45%' }} />
            </View>
            <View style={{ width: '90%', alignSelf: 'center', height: 50, justifyContent: 'center', gap: 30 }}>
                <TextInput placeholder='Address' onChangeText={(e) => setaddress(e)} style={{ borderBottomWidth: 1, borderColor: '#ccc', width: '100%' }} />
            </View>
            <View style={{ width: '90%', alignSelf: 'center', height: 50, justifyContent: 'center', gap: 30 }}>
                <TextInput placeholder='Email' onChangeText={(e) => setemail(e)} style={{ borderBottomWidth: 1, borderColor: '#ccc', width: '100%' }} />
                    </View>
            <View style={{ width: '90%', alignSelf: 'center' }}>

                <TextInput placeholder='Phone' onChangeText={(e) => setphonenumber(e)} style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 8, width: '100%' }} />
            </View>
            <View style={{ width: '90%', alignSelf: 'center', marginTop: '20%', justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity  style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ fontSize: 18 }}> Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Profile
