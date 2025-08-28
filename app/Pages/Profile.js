import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";

const Profile = () => {
    return (
        <ScrollView style={{ backgroundColor: "#ffffffff", height: '100%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 10 }}> Profile Setting </Text>

            <View style={{ alignItems: 'center', paddingVertical: 15, backgroundColor: 'white' }}>
                <View style={{ width: '25%', height: 90, borderRadius: 50, backgroundColor: '#F3D5C6', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity><Ionicons name="camera-outline" size={40} color="#000" /></TouchableOpacity>
                </View>
            </View>
            <View style={{ width: '90%', alignSelf: 'center', height: 50, justifyContent: 'center', flexDirection: 'row', gap: 30 }}>
                <TextInput placeholder='First Name' value="Haya" style={{ borderBottomWidth: 1, borderColor: '#ccc', width: '45%' }} />
                <TextInput placeholder='Last Name' value="Pectrus" style={{ borderBottomWidth: 1, borderColor: '#ccc', width: '45%' }} />
            </View>
            <View style={{ width: '90%', alignSelf: 'center', marginTop: '9%' }}>
                <TextInput placeholder='Email' value="Haya12@gmail.com" style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 8, width: '100%' }} />
            </View>
            <View style={{ width: '90%', alignSelf: 'center', marginTop: '9%' }}>
                <TextInput placeholder='Gender' value="Female" style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 8, width: '45%' }} />
                <TextInput placeholder='Phone' value="(+1) 23456789" style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 8, width: '45%', position: 'absolute', right: 0, top: 0 }} />
            </View>
            <View style={{ width: '90%', alignSelf: 'center', marginTop: '20%', justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ fontSize: 18 }}> Save Changes</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Profile
