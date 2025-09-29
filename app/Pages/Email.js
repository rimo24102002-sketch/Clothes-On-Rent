import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { sendSupportEmail } from "../Helper/firebaseHelper";
import { useSelector } from "react-redux";

export default function Email({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fill user data
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSendEmail = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!subject.trim()) {
      Alert.alert("Error", "Please enter a subject");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter your message");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      
      const supportData = {
        fullName: fullName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        sellerId: user?.sellerId || user?.uid,
        userRole: user?.role || "Seller",
      };

      await sendSupportEmail(supportData);
      
      Alert.alert(
        "Success", 
        "Your support email has been sent successfully! We'll get back to you within 24 hours.",
        [
          {
            text: "OK",
            onPress: () => {
              setSubject("");
              setMessage("");
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error("Send email error:", error);
      Alert.alert("Error", "Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', backgroundColor: '#fff' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#8E6652" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 10, color: '#333' }}>Email Support</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Info Banner */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E8', padding: 15, borderRadius: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8E6652' }}>
          <Feather name="mail" size={24} color="#8E6652" style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 14, color: '#333', flex: 1, lineHeight: 20 }}>
            Send us an email and we'll get back to you within 24 hours
          </Text>
        </View>

        {/* Contact Form */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 20, color: '#8E6652' }}>Contact Information</Text>
          
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' }}>
            {/* Full Name */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' }}>Full Name *</Text>
              <TextInput 
                placeholder="Enter your full name" 
                value={fullName}
                onChangeText={setFullName}
                style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#F8F9FA' }} 
              />
            </View>

            {/* Email Address */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' }}>Email Address *</Text>
              <TextInput 
                placeholder="Enter your email address" 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#F8F9FA' }} 
              />
            </View>

            {/* Subject */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' }}>Subject *</Text>
              <TextInput 
                placeholder="Brief description of your issue" 
                value={subject}
                onChangeText={setSubject}
                style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16 }} 
              />
            </View>

            {/* Message */}
            <View style={{ marginBottom: 0 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' }}>Message *</Text>
              <TextInput 
                placeholder="Please describe your issue in detail..." 
                value={message}
                onChangeText={setMessage}
                multiline 
                numberOfLines={6}
                textAlignVertical="top"
                style={{ borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, minHeight: 120, fontSize: 16 }} 
              />
            </View>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#8E6652', 
            padding: 16, 
            borderRadius: 12,
            opacity: loading ? 0.7 : 1
          }}
          onPress={handleSendEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Send Email</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Help Text */}
        <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 16, lineHeight: 18 }}>
          Our support team typically responds within 24 hours during business days.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
