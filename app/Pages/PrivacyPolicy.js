import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getPrivacyPolicy } from "../Helper/firebaseHelper";

function PrivacyPolicy({ navigation }) {

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
          <TouchableOpacity onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('BottomTab');
            }
          }}>
            <Ionicons name="arrow-back" size={24} color="#8E6652" />
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
        <TouchableOpacity onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('BottomTab');
          }
        }}>
          <Ionicons name="arrow-back" size={24} color="#8E6652" />
        </TouchableOpacity>
        <View style={{flex:1, marginLeft:15}}>
          <Text style={{
            fontSize:20,
            fontWeight:'700',
            color:'#8E6652',
          }}>
            Privacy Policy
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
          <MaterialIcons name="security" size={20} color="#fff" />
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
            <MaterialIcons name="security" size={40} color="#fff" />
          </View>
          <Text style={{
            fontSize:24,
            fontWeight:'700',
            color:'#fff',
            textAlign:'center',
            marginBottom:10
          }}>
            Your Privacy Matters
          </Text>
          <Text style={{
            fontSize:14,
            color:'#F1DCD1',
            textAlign:'center',
            lineHeight:20
          }}>
            We are committed to protecting your personal information and ensuring transparency in how we use your data.
          </Text>
        </View>

        <View style={{paddingHorizontal:20}}>
          {/* Introduction */}
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
                <Ionicons name="information-circle" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#8E6652',
                flex:1
              }}>
                Introduction
              </Text>
            </View>
            <Text style={{
              fontSize:15,
              lineHeight:24,
              color:'#333',
              marginBottom:16
            }}>
              Welcome to Rent Clothes ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our clothing rental platform.
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
                🔒 Your trust is our priority. We handle your data with the utmost care and transparency.
              </Text>
            </View>
          </View>

          {/* Information Collection */}
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
            borderLeftColor:'#3498DB'
          }}>
            <View style={{
              flexDirection:'row',
              alignItems:'center',
              marginBottom:20
            }}>
              <View style={{
                backgroundColor:'#3498DB',
                width:40,
                height:40,
                borderRadius:20,
                alignItems:'center',
                justifyContent:'center',
                marginRight:12
              }}>
                <Ionicons name="document-text" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#3498DB',
                flex:1
              }}>
                Information We Collect
              </Text>
            </View>

            <View style={{
              backgroundColor:'#EBF5FB',
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
                Personal Information
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Full name and contact information{'\n'}
                • Email address and phone number{'\n'}
                • Shipping and billing addresses{'\n'}
                • Payment information (processed securely){'\n'}
                • Profile photos and preferences
              </Text>
            </View>

            <View style={{
              backgroundColor:'#EBF5FB',
              padding:16,
              borderRadius:12,
              marginBottom:16,
              borderLeftWidth:3,
              borderLeftColor:'#27AE60'
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#27AE60',
                marginBottom:8
              }}>
                Rental Information
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Rental history and preferences{'\n'}
                • Size and fit information{'\n'}
                • Reviews and ratings{'\n'}
                • Communication with sellers
              </Text>
            </View>

            <View style={{
              backgroundColor:'#EBF5FB',
              padding:16,
              borderRadius:12,
              borderLeftWidth:3,
              borderLeftColor:'#9B59B6'
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#9B59B6',
                marginBottom:8
              }}>
                Technical Information
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Device information and IP address{'\n'}
                • App usage analytics{'\n'}
                • Location data (with permission){'\n'}
                • Cookies and similar technologies
              </Text>
            </View>
          </View>

          {/* Data Usage */}
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
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#27AE60',
                flex:1
              }}>
                How We Use Your Information
              </Text>
            </View>
            <Text style={{
              fontSize:15,
              lineHeight:24,
              color:'#333',
              marginBottom:16
            }}>
              We use your information to:
            </Text>
            <View style={{
              backgroundColor:'#E8F5E8',
              padding:16,
              borderRadius:12,
              borderLeftWidth:3,
              borderLeftColor:'#27AE60'
            }}>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Provide and improve our rental services{'\n'}
                • Process transactions and payments{'\n'}
                • Communicate about orders and updates{'\n'}
                • Personalize your experience{'\n'}
                • Ensure platform security and prevent fraud{'\n'}
                • Send promotional content (with consent){'\n'}
                • Comply with legal obligations
              </Text>
            </View>
          </View>

          {/* Data Sharing */}
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
            borderLeftColor:'#E67E22'
          }}>
            <View style={{
              flexDirection:'row',
              alignItems:'center',
              marginBottom:16
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
                <Ionicons name="share-social" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#E67E22',
                flex:1
              }}>
                Information Sharing
              </Text>
            </View>
            <Text style={{
              fontSize:15,
              lineHeight:24,
              color:'#333',
              marginBottom:16
            }}>
              We may share your information with:
            </Text>
            <View style={{
              backgroundColor:'#FDF2E9',
              padding:16,
              borderRadius:12,
              borderLeftWidth:3,
              borderLeftColor:'#E67E22'
            }}>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                • Sellers for rental transactions{'\n'}
                • Payment processors for secure transactions{'\n'}
                • Shipping partners for delivery{'\n'}
                • Service providers who assist our operations{'\n'}
                • Legal authorities when required by law{'\n\n'}
                <Text style={{
                  fontWeight:'600',
                  color:'#E67E22'
                }}>
                  We never sell your personal information to third parties.
                </Text>
              </Text>
            </View>
          </View>

          {/* Security & Rights */}
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
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
              </View>
              <Text style={{
                fontSize:20,
                fontWeight:'700',
                color:'#9B59B6',
                flex:1
              }}>
                Security & Your Rights
              </Text>
            </View>

            <View style={{
              backgroundColor:'#F4ECF7',
              padding:16,
              borderRadius:12,
              marginBottom:16,
              borderLeftWidth:3,
              borderLeftColor:'#27AE60'
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#27AE60',
                marginBottom:8
              }}>
                Data Security
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                We implement industry-standard security measures to protect your information, including:{'\n\n'}
                • Encryption of sensitive data{'\n'}
                • Secure payment processing{'\n'}
                • Regular security audits{'\n'}
                • Access controls and monitoring{'\n'}
                • Secure data storage practices
              </Text>
            </View>

            <View style={{
              backgroundColor:'#F4ECF7',
              padding:16,
              borderRadius:12,
              borderLeftWidth:3,
              borderLeftColor:'#8E6652'
            }}>
              <Text style={{
                fontSize:16,
                fontWeight:'600',
                color:'#8E6652',
                marginBottom:8
              }}>
                Your Rights
              </Text>
              <Text style={{
                fontSize:14,
                lineHeight:22,
                color:'#333'
              }}>
                You have the right to:{'\n\n'}
                • Access your personal information{'\n'}
                • Update or correct your data{'\n'}
                • Delete your account and data{'\n'}
                • Opt-out of marketing communications{'\n'}
                • Request data portability{'\n'}
                • Lodge complaints with authorities
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PrivacyPolicy;