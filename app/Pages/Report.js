import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    issueType: 'Technical Issue',
    orderNumber: '',
    subject: '',
    description: '',
    urgency: 'Medium'
  });

  const issueTypes = ['Technical Issue','Payment Problem','Order Issue','Item Damage','Delivery Problem','Account Issue','Other'];
  const urgencyLevels = ['Low','Medium','High','Critical'];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.description) {
      Alert.alert('Missing Information','Please fill in the subject and description fields.');
      return;
    }
    Alert.alert('Issue Reported!','Your issue has been submitted.');
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white',padding:20}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10}}>Report an Issue</Text>
        </View>

        <View style={{flexDirection:'row',alignItems:'center',padding:15,backgroundColor:'#f9f9f9',borderRadius:10,marginBottom:20}}>
          <Ionicons name="flag" size={24} color="#8E6652" style={{marginRight:10}} />
          <Text style={{fontSize:16,fontWeight:'600'}}>Help us improve by reporting issues</Text>
        </View>

        <Text style={{fontSize:18,fontWeight:'bold',marginBottom:10}}>Issue Details</Text>

        <Text style={{marginBottom:5}}>Issue Type</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:15}}>
          {issueTypes.map(type => (
            <TouchableOpacity key={type} onPress={() => updateField('issueType',type)} 
              style={{padding:8,margin:5,borderRadius:15,borderWidth:1,borderColor:'gray',backgroundColor: formData.issueType===type?'#8E6652':'white'}}>
              <Text style={{color: formData.issueType===type?'white':'black'}}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{marginBottom:5}}>Order Number (Optional)</Text>
        <TextInput style={{borderWidth:1,borderColor:'gray',borderRadius:8,padding:10,marginBottom:15}} 
          placeholder="Enter order number" value={formData.orderNumber} onChangeText={v=>updateField('orderNumber',v)} />

        <Text style={{marginBottom:5}}>Description *</Text>
        <TextInput style={{borderWidth:1,borderColor:'gray',borderRadius:8,padding:10,minHeight:100,textAlignVertical:'top',marginBottom:20}} 
          placeholder="Describe the issue..." value={formData.description} onChangeText={v=>updateField('description',v)} multiline />

        <TouchableOpacity onPress={handleSubmit} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#8E6652',padding:15,borderRadius:10,marginBottom:20}}>
          <Ionicons name="flag" size={20} color="white" style={{marginRight:10}} />
          <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Submit Report</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}