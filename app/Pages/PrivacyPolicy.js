import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { getPrivacyPolicy } from "../Helper/firebaseHelper";

export default function PrivacyPolicy({ navigation }) {
  const [privacyPolicy, setPrivacyPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      const data = await getPrivacyPolicy();
      setPrivacyPolicy(data);
    } catch (error) {
      console.error("Error loading privacy policy:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{flex:1,backgroundColor:'#F8F9FA'}}>
        <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:15,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E0E0E0'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color="#8E6652" />
          </TouchableOpacity>
          <Text style={{fontSize:18,fontWeight:'600',color:'#333',marginLeft:12}}>Privacy Policy</Text>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{marginTop:16,color:'#666'}}>Loading Privacy Policy...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F8F9FA'}}>
      <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:15,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E0E0E0'}}>
        <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginLeft:12}}>Privacy Policy</Text>
      </View>

      <ScrollView style={{flex:1,paddingHorizontal:20}} showsVerticalScrollIndicator={false}>
      

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Introduction</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            Welcome to Rent Clothes ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our clothing rental platform.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Information We Collect</Text>
          
          <Text style={{fontSize:16,fontWeight:'500',color:'#8E6652',marginTop:15,marginBottom:8}}>Personal Information</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            - Full name and contact information{'\n'}
            - Email address and phone number{'\n'}
            - Shipping and billing addresses{'\n'}
            - Payment information (processed securely){'\n'}
            - Profile photos and preferences
          </Text>

          <Text style={{fontSize:16,fontWeight:'500',color:'#8E6652',marginTop:15,marginBottom:8}}>Rental Information</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            - Rental history and preferences{'\n'}
            - Size and fit information{'\n'}
            - Reviews and ratings{'\n'}
            - Communication with sellers
          </Text>

          <Text style={{fontSize:16,fontWeight:'500',color:'#8E6652',marginTop:15,marginBottom:8}}>Technical Information</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            - Device information and IP address{'\n'}
            - App usage analytics{'\n'}
            - Location data (with permission){'\n'}
            - Cookies and similar technologies
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>How We Use Your Information</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            We use your information to:{'\n\n'}
            - Provide and improve our rental services{'\n'}
            - Process transactions and payments{'\n'}
            - Communicate about orders and updates{'\n'}
            - Personalize your experience{'\n'}
            - Ensure platform security and prevent fraud{'\n'}
            - Send promotional content (with consent){'\n'}
            - Comply with legal obligations
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Information Sharing</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            We may share your information with:{'\n\n'}
            - Sellers for rental transactions{'\n'}
            - Payment processors for secure transactions{'\n'}
            - Shipping partners for delivery{'\n'}
            - Service providers who assist our operations{'\n'}
            - Legal authorities when required by law{'\n\n'}
            We never sell your personal information to third parties.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Data Security</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            We implement industry-standard security measures to protect your information, including:{'\n\n'}
            - Encryption of sensitive data{'\n'}
            - Secure payment processing{'\n'}
            - Regular security audits{'\n'}
            - Access controls and monitoring{'\n'}
            - Secure data storage practices
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Your Rights</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            You have the right to:{'\n\n'}
            - Access your personal information{'\n'}
            - Update or correct your data{'\n'}
            - Delete your account and data{'\n'}
            - Opt-out of marketing communications{'\n'}
            - Request data portability{'\n'}
            - Lodge complaints with authorities
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Data Retention</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            We retain your information for as long as necessary to provide our services and comply with legal obligations. Account data is typically retained for 7 years after account closure, while transaction records may be kept longer for legal compliance.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Children's Privacy</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Changes to This Policy</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            We may update this Privacy Policy periodically. We will notify you of significant changes through the app or via email. Your continued use of our services after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,marginBottom:30,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Contact Us</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            If you have questions about this Privacy Policy, please contact us:{'\n\n'}
            Email: privacy@rentclothes.com{'\n'}
            Phone: +1 (555) 123-4567{'\n'}
            Address: 123 Fashion Street, Style City, SC 12345
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}