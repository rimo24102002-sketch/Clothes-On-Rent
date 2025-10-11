import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getTermsOfService } from "../Helper/firebaseHelper";

const { width } = Dimensions.get('window');

export default function TermsOfService({ navigation }) {
  const [termsData, setTermsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTermsOfService();
  }, []);

  const loadTermsOfService = async () => {
    try {
      const data = await getTermsOfService();
      setTermsData(data);
    } catch (error) {
      console.error("Error loading terms of service:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{flex:1,backgroundColor:'#F8F9FA'}}>
        <View style={{
          flexDirection:'row',
          alignItems:'center',
          paddingHorizontal:20,
          paddingVertical:15,
          backgroundColor:'#fff',
          borderBottomWidth:1,
          borderBottomColor:'#E0E0E0'
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#8E6652" />
          </TouchableOpacity>
          <Text style={{
            fontSize:18,
            fontWeight:'600',
            color:'#8E6652',
            marginLeft:12
          }}>
            Terms of Service
          </Text>
        </View>
        <View style={{
          flex:1,
          justifyContent:'center',
          alignItems:'center'
        }}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{
            marginTop:16,
            color:'#666',
            fontSize:16
          }}>
            Loading Terms of Service...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F8F9FA'}}>
      {/* Enhanced Header */}
      <View style={{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:20,
        paddingVertical:20,
        backgroundColor:'#fff',
        borderBottomWidth:2,
        borderBottomColor:'#8E6652',
        shadowColor:'#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#8E6652" />
        </TouchableOpacity>
        <View style={{flex:1, marginLeft:15}}>
          <Text style={{
            fontSize:20,
            fontWeight:'700',
            color:'#8E6652',
          }}>
            Terms of Service
          </Text>
          <Text style={{
            fontSize:12,
            color:'#999',
            marginTop:2
          }}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </View>
        <View style={{
          backgroundColor:'#8E6652',
          paddingHorizontal:12,
          paddingVertical:6,
          borderRadius:20
        }}>
          <MaterialIcons name="description" size={20} color="#fff" />
        </View>
      </View>

      <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={{
          backgroundColor:'#8E6652',
          paddingVertical:40,
          paddingHorizontal:20,
          alignItems:'center'
        }}>
          <View style={{
            backgroundColor:'rgba(255,255,255,0.2)',
            width:80,
            height:80,
            borderRadius:40,
            alignItems:'center',
            justifyContent:'center',
            marginBottom:20
          }}>
            <MaterialIcons name="handshake" size={40} color="#fff" />
          </View>
          <Text style={{
            fontSize:24,
            fontWeight:'700',
            color:'#fff',
            textAlign:'center',
            marginBottom:10
          }}>
            Our Commitment to You
          </Text>
          <Text style={{
            fontSize:14,
            color:'#F1DCD1',
            textAlign:'center',
            lineHeight:20
          }}>
            We believe in transparency and fairness. These terms ensure a safe and enjoyable experience for everyone.
          </Text>
        </View>

        <View style={{paddingHorizontal:20}}>
          {/* Agreement to Terms */}
          <View style={{
            backgroundColor:'#fff',
            borderRadius:16,
            padding:24,
            marginTop:20,
            shadowColor:'#000',
            shadowOffset:{width:0,height:4},
            shadowOpacity:0.1,
            shadowRadius:8,
            elevation:6,
            borderLeftWidth:4,
            borderLeftColor:'#8E6652'
          }}>
            <View style={{
              flexDirection:'row',
              alignItems:'center',
              marginBottom:16
            }}>
              <View style={{
                backgroundColor:'#8E6652',
                width:40,
                height:40,
                borderRadius:20,
                alignItems:'center',
                justifyContent:'center',
                marginRight:12
              }}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#8E6652',
                flex:1
              }}>
                Agreement to Terms
              </Text>
            </View>
            <Text style={{
              fontSize:15,
              lineHeight:24,
              color:'#333',
              marginBottom:16
            }}>
              Welcome to Rent Clothes! These Terms of Service ("Terms") govern your use of our clothing rental platform and services. By accessing or using our app, you agree to be bound by these Terms.
            </Text>
            <View style={{
              backgroundColor:'#F8F9FA',
              padding:16,
              borderRadius:12,
              borderLeftWidth:3,
              borderLeftColor:'#8E6652'
            }}>
              <Text style={{
                fontSize:14,
                color:'#8E6652',
                fontStyle:'italic'
              }}>
                💡 If you disagree with any part of these terms, you may not access our service.
              </Text>
            </View>
          </View>

          {/* Service Description */}
          <View style={{
            backgroundColor:'#fff',
            borderRadius:16,
            padding:24,
            marginTop:16,
            shadowColor:'#000',
            shadowOffset:{width:0,height:4},
            shadowOpacity:0.1,
            shadowRadius:8,
            elevation:6,
            borderLeftWidth:4,
            borderLeftColor:'#27AE60'
          }}>
            <View style={{
              flexDirection:'row',
              alignItems:'center',
              marginBottom:16
            }}>
              <View style={{
                backgroundColor:'#27AE60',
                width:40,
                height:40,
                borderRadius:20,
                alignItems:'center',
                justifyContent:'center',
                marginRight:12
              }}>
                <Ionicons name="storefront" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#27AE60',
                flex:1
              }}>
                Service Description
              </Text>
            </View>
            <Text style={{
              fontSize:15,
              lineHeight:24,
              color:'#333'
            }}>
              Rent Clothes is a peer-to-peer clothing rental marketplace that connects users who want to rent clothing items with users who want to rent out their clothing. We provide the platform and facilitate transactions but are not a party to the rental agreements between users.
            </Text>
          </View>

          {/* User Accounts Section */}
          <View style={{
            backgroundColor:'#fff',
            borderRadius:16,
            padding:24,
            marginTop:16,
            shadowColor:'#000',
            shadowOffset:{width:0,height:4},
            shadowOpacity:0.1,
            shadowRadius:8,
            elevation:6,
            borderLeftWidth:4,
            borderLeftColor:'#9B59B6'
          }}>
            <View style={{
              flexDirection:'row',
              alignItems:'center',
              marginBottom:20
            }}>
              <View style={{
                backgroundColor:'#9B59B6',
                width:40,
                height:40,
                borderRadius:20,
                alignItems:'center',
                justifyContent:'center',
                marginRight:12
              }}>
                <Ionicons name="people" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#9B59B6',
                flex:1
              }}>
                User Accounts
              </Text>
            </View>

            <View style={{
              backgroundColor:'#F8F9FA',
              padding:16,
              borderRadius:12,
              marginBottom:16
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#8E6652',
                marginBottom:8
              }}>
                Account Creation
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • You must be at least 18 years old to create an account{'\n'}
                • You must provide accurate and complete information{'\n'}
                • You are responsible for maintaining account security{'\n'}
                • One person may not maintain multiple accounts{'\n'}
                • You must notify us of any unauthorized account use
              </Text>
            </View>

            <View style={{
              backgroundColor:'#F8F9FA',
              padding:16,
              borderRadius:12
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#8E6652',
                marginBottom:8
              }}>
                Account Responsibilities
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Keep your login credentials confidential{'\n'}
                • Update your information when it changes{'\n'}
                • Comply with all applicable laws and regulations{'\n'}
                • Respect other users and their property
              </Text>
            </View>
          </View>

          {/* Rental Terms */}
          <View style={{
            backgroundColor:'#fff',
            borderRadius:16,
            padding:24,
            marginTop:16,
            marginBottom:30,
            shadowColor:'#000',
            shadowOffset:{width:0,height:4},
            shadowOpacity:0.1,
            shadowRadius:8,
            elevation:6,
            borderLeftWidth:4,
            borderLeftColor:'#E67E22'
          }}>
            <View style={{
              flexDirection:'row',
              alignItems:'center',
              marginBottom:20
            }}>
              <View style={{
                backgroundColor:'#E67E22',
                width:40,
                height:40,
                borderRadius:20,
                alignItems:'center',
                justifyContent:'center',
                marginRight:12
              }}>
                <MaterialIcons name="schedule" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#E67E22',
                flex:1
              }}>
                Rental Terms
              </Text>
            </View>

            <View style={{
              backgroundColor:'#FFF3E0',
              padding:16,
              borderRadius:12,
              marginBottom:16,
              borderLeftWidth:3,
              borderLeftColor:'#8E6652'
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#8E6652',
                marginBottom:8
              }}>
                For Renters
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Pay all rental fees and deposits as agreed{'\n'}
                • Return items in the same condition as received{'\n'}
                • Follow care instructions provided by the Seller{'\n'}
                • Report any damage or issues immediately{'\n'}
                • Return items by the agreed-upon date
              </Text>
            </View>

            <View style={{
              backgroundColor:'#FFF3E0',
              padding:16,
              borderRadius:12,
              borderLeftWidth:3,
              borderLeftColor:'#27AE60'
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#27AE60',
                marginBottom:8
              }}>
                For Sellers
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Provide accurate descriptions and photos{'\n'}
                • Ensure items are clean and in good condition{'\n'}
                • Respond promptly to rental requests{'\n'}
                • Provide clear care and return instructions{'\n'}
                • Honor confirmed rental agreements
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
