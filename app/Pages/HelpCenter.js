import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function HelpCenter({navigation}) {
  const [showFAQ, setShowFAQ] = useState(false);

  const faqData = [
    {
      id: 1,
      question: "How do I rent an item?",
      answer: "Browse items, select size and rental period, add to cart, and complete payment."
    },
    {
      id: 2,
      question: "What if an item doesn't fit?",
      answer: "Contact support within 24 hours for free size exchange."
    },
    {
      id: 3,
      question: "How do I return items?",
      answer: "Use the prepaid return label. Return by due date in same condition."
    },
    {
      id: 4,
      question: "What happens if I damage an item?",
      answer: "Minor wear is expected. Significant damage may result in fees."
    },
    {
      id: 5,
      question: "Can I extend my rental?",
      answer: "Yes, extend through the app if available. Additional fees apply."
    },
    {
      id: 6,
      question: "How do I become a seller?",
      answer: "Create seller account, upload items with photos and prices."
    }
  ];

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F1DCD1'}}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:14,backgroundColor:'#F1DCD1',borderBottomWidth:1,borderBottomColor:'#8E6652'}}>
        <Text style={{fontSize:18,fontWeight:'700',color:'#8E6652'}}>Help Center</Text>
      </View>

      <ScrollView contentContainerStyle={{padding:20}}>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',borderRadius:12,padding:12,marginBottom:14,borderWidth:1,borderColor:'#8E6652'}}>
          <TextInput
            style={{flex:1,fontSize:15,color:'#8E6652'}}
            placeholder="Search for help..."
            placeholderTextColor="#8E6652"
          />
        </View>

        <View style={{backgroundColor:'#FFFFFF',borderRadius:12,padding:16,marginBottom:14,borderWidth:1,borderColor:'#8E6652'}}>
          <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>Get Help</Text>
          
          <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#F1DCD1'}}>
            <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
              <Text style={{fontSize:15,color:'#8E6652',fontWeight:'600',marginLeft:12}} onPress={() => navigation.navigate('Email')}>Email Support</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor:'#FFFFFF',borderRadius:12,padding:16,marginBottom:14,borderWidth:1,borderColor:'#8E6652'}}>
          <TouchableOpacity onPress={() => setShowFAQ(!showFAQ)}>
            <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>FAQ {showFAQ ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          
          {showFAQ && faqData.map((faq) => (
            <View key={faq.id} style={{paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#F1DCD1'}}>
              <Text style={{fontSize:15,color:'#8E6652',fontWeight:'600',marginBottom:4}}>{faq.question}</Text>
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