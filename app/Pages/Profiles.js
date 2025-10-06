import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { useSelector, useDispatch } from "react-redux"
import * as ImagePicker from 'expo-image-picker'
import { getCustomerProfile, updateCustomerProfile, uploadImageToCloudinary } from "../Helper/firebaseHelper"
import { setUser } from "../redux/Slices/HomeDataSlice"

const Profile = ({ navigation }) => {
    const user = useSelector((state) => state.home.user)
    const dispatch = useDispatch()
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [gender, setGender] = useState("")
    const [profileImage, setProfileImage] = useState(null)

    useEffect(() => {
        loadCustomerProfile()
    }, [])

    const loadCustomerProfile = async () => {
        try {
            if (!user?.uid) return
            
            const profile = await getCustomerProfile(user.uid)
            
            setFirstName(profile.firstName || "")
            setLastName(profile.lastName || "")
            setEmail(profile.email || user.email || "")
            setPhone(profile.phone || "")
            setAddress(profile.address || "")
            setGender(profile.gender || "")
            setProfileImage(profile.profileImageUrl || null)
            
        } catch (error) {
            console.error("Error loading customer profile:", error)
            Alert.alert("Error", "Failed to load profile data")
        } finally {
            setLoading(false)
        }
    }

    const pickImageFromGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.')
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            })

            if (!result.canceled && result.assets[0]) {
                setImageLoading(true)
                const imageUri = result.assets[0].uri
                
                // Upload to Cloudinary
                const uploadedUrl = await uploadImageToCloudinary(imageUri)
                setProfileImage(uploadedUrl)
                
                // Update profile in Firebase
                await updateCustomerProfile(user.uid, { profileImageUrl: uploadedUrl })
                
                Alert.alert("Success", "Profile image updated successfully!")
            }
        } catch (error) {
            console.error("Error picking image:", error)
            Alert.alert("Error", "Failed to upload image")
        } finally {
            setImageLoading(false)
        }
    }

    const saveProfile = async () => {
        try {
            if (!firstName.trim() || !lastName.trim()) {
                Alert.alert("Error", "Please fill in your first and last name")
                return
            }

            setSaving(true)
            
            const profileData = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                gender: gender.trim(),
                profileImageUrl: profileImage
            }

            await updateCustomerProfile(user.uid, profileData)
            
            // Update Redux store
            dispatch(setUser({
                ...user,
                ...profileData
            }))

            Alert.alert("Success", "Profile updated successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ])
            
        } catch (error) {
            console.error("Error saving profile:", error)
            Alert.alert("Error", "Failed to save profile changes")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1DCD1' }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text style={{ marginTop: 16, color: '#8E6652' }}>Loading profile...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={{ backgroundColor: '#F1DCD1', flex: 1 }}>
            {/* Header */}
            <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#8E6652' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Customer Profile</Text>
                <TouchableOpacity onPress={saveProfile} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
                {/* Profile Image */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <View style={{ position: 'relative' }}>
                        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#8E6652' }}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={{ width: 94, height: 94, borderRadius: 47 }} />
                            ) : (
                                <Ionicons name="person" size={50} color="#8E6652" />
                            )}
                        </View>
                        <TouchableOpacity 
                            onPress={pickImageFromGallery}
                            disabled={imageLoading}
                            style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#8E6652', borderRadius: 15, padding: 8 }}
                        >
                            {imageLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="camera" size={16} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                    {/* Name Fields */}
                    <View style={{ flexDirection: 'row', gap: 15, marginBottom: 20 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>First Name</Text>
                            <TextInput
                                placeholder="Enter first name"
                                value={firstName}
                                onChangeText={setFirstName}
                                style={{ borderBottomWidth: 1, borderColor: '#E0E0E0', paddingVertical: 8, fontSize: 16 }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Last Name</Text>
                            <TextInput
                                placeholder="Enter last name"
                                value={lastName}
                                onChangeText={setLastName}
                                style={{ borderBottomWidth: 1, borderColor: '#E0E0E0', paddingVertical: 8, fontSize: 16 }}
                            />
                        </View>
                    </View>

                    {/* Email Field */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Email</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#d1d5db' }}>
                            <Ionicons name="mail-outline" size={18} color="#8E6652" style={{ marginRight: 10 }} />
                            <Text style={{ flex: 1, fontSize: 16, color: '#374151', fontWeight: '500' }}>
                                {email || "No email provided"}
                            </Text>
                        </View>
                    </View>

                    {/* Phone Field */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Phone</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="call-outline" size={18} color="#8E6652" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Enter phone number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                style={{ flex: 1, borderBottomWidth: 1, borderColor: '#E0E0E0', paddingVertical: 8, fontSize: 16 }}
                            />
                        </View>
                    </View>

                    {/* Address Field */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Address</Text>
                        <View style={{ paddingTop: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Ionicons name="location-outline" size={18} color="#8E6652" style={{ marginRight: 10, marginTop: 2 }} />
                                <TextInput
                                    placeholder="Enter your address"
                                    value={address}
                                    onChangeText={setAddress}
                                    multiline
                                    numberOfLines={3}
                                    style={{ flex: 1, borderBottomWidth: 1, borderColor: '#E0E0E0', paddingVertical: 8, fontSize: 16, textAlignVertical: 'top', minHeight: 80 }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Gender Field */}
                    <View>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Gender</Text>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            {['Male', 'Female', 'Other'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => setGender(option)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        borderRadius: 20,
                                        backgroundColor: gender === option ? '#8E6652' : '#f5f5f5',
                                        borderWidth: 1,
                                        borderColor: gender === option ? '#8E6652' : '#E0E0E0'
                                    }}
                                >
                                    <Text style={{ color: gender === option ? '#fff' : '#333', fontSize: 14 }}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile
