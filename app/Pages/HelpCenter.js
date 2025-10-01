import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Modal, Alert } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getHelpArticles } from "../Helper/firebaseHelper";
import Header from "../Components/Header";

export default function HelpCenter({navigation}) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;
  
  const [showFAQ, setShowFAQ] = useState(false);
  const [helpArticles, setHelpArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadHelpData();
  }, []);

  const loadHelpData = async () => {
    try {
      const articles = await getHelpArticles();
      setHelpArticles(articles || []);
    } catch (error) {
      console.error("Error loading help articles:", error);
    } finally {
      setLoading(false);
    }
  };


  const faqData = [
    {
    id: 1,
    question: "How do I list my items for rent?",
  },
  {
    id: 2,
    question: "How do I get paid?",
    answer: "All payments are collected as Cash on Delivery (COD). You receive your earnings when the item is returned successfully."
  },
  {
    id: 3,
    question: "Who handles delivery?",
    answer: "We provide prepaid shipping labels. You only need to package the item securely for pickup and return."
  },
  {
    id: 4,
    question: "What if my item is damaged?",
    answer: "Minor wear is normal. If significant damage occurs, the renter is responsible for repair or replacement costs."
  },
  {
    id: 5,
    question: "Can I set my own rental prices?",
    answer: "Yes, you control your rental prices. However, we may suggest competitive pricing to increase bookings."
  },
  {
    id: 6,
    question: "How do I track my rentals?",
    answer: "Use your seller dashboard to track active orders, COD payments, and item return status."
  }
  ];

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F8F9FA'}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#8E6652', marginLeft: 12 }}>Help Center</Text>
        </View>
    

      <ScrollView contentContainerStyle={{padding:20}}>
        {/* Search Bar */}
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:12,padding:12,marginBottom:16,borderWidth:1,borderColor:'#E0E0E0'}}>
          <Feather name="search" size={20} color="#8E6652" style={{marginRight:10}} />
          <TextInput
            style={{flex:1,fontSize:15,color:'#333'}}
            placeholder="Search for help..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Actions */}
        <View style={{backgroundColor:'#fff',borderRadius:12,padding:16,marginBottom:16,borderWidth:1,borderColor:'#E0E0E0'}}>
          <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>Get Help</Text>
          
          {/* Email Support */}
          <TouchableOpacity 
            style={{flexDirection:'row',alignItems:'center',paddingVertical:12}}
            onPress={() => navigation.navigate('Email')}
          >
            <Feather name="mail" size={20} color="#8E6652" />
            <Text style={{fontSize:15,color:'#333',fontWeight:'600',marginLeft:12,flex:1}}>Email Support</Text>
            <Feather name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor:'#FFFFFF',borderRadius:12,padding:16,marginBottom:14,borderWidth:1,borderColor:'#8E6652'}}>
          <TouchableOpacity onPress={() => setShowFAQ(!showFAQ)}>
            <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>FAQ {showFAQ ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          
          {showFAQ && faqData.map((faq) => (
            <View key={faq.id} style={{paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#F1DCD1'}}>
              <Text style={{fontSize:16,color:'#8E6652',fontWeight:'600',marginBottom:4}}>{faq.question}</Text>
              <Text style={{fontSize:14,color:'#8E6652',lineHeight:20}}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        <View style={{backgroundColor:'#FFFFFF',borderRadius:12,padding:16,marginBottom:14,borderWidth:1,borderColor:'#8E6652'}}>
          <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>Contact Us</Text>
          <Text style={{fontSize:14,color:'#8E6652',lineHeight:22,textAlign:'center'}}>
            Email: support@rentclothes.com{'\n'}
            Available 24/7
          </Text>
        </View>

        <View style={{height:24}} />
      </ScrollView>

    </SafeAreaView>
  );
}