import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';

export default function TermsOfService() {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F1DCD1'}}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:15,backgroundColor:'#F1DCD1',borderBottomWidth:1,borderBottomColor:'#E5D5C8'}}>
        <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652'}}>Terms of Service</Text>
      </View>

      <ScrollView style={{flex:1,paddingHorizontal:20}} showsVerticalScrollIndicator={false}>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Agreement to Terms</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            Welcome to Rent Clothes! These Terms of Service ("Terms") govern your use of our clothing rental platform and services. By accessing or using our app, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our service.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Service Description</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            Rent Clothes is a peer-to-peer clothing rental marketplace that connects users who want to rent clothing items ("Renters") with users who want to rent out their clothing ("Sellers"). We provide the platform and facilitate transactions but are not a party to the rental agreements between users.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>User Accounts</Text>
          
          <Text style={{fontSize:16,fontWeight:'500',color:'#8E6652',marginTop:15,marginBottom:8}}>Account Creation</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • You must be at least 18 years old to create an account{'\n'}
            • You must provide accurate and complete information{'\n'}
            • You are responsible for maintaining account security{'\n'}
            • One person may not maintain multiple accounts{'\n'}
            • You must notify us of any unauthorized account use
          </Text>

          <Text style={{fontSize:16,fontWeight:'500',color:'#8E6652',marginTop:15,marginBottom:8}}>Account Responsibilities</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • Keep your login credentials confidential{'\n'}
            • Update your information when it changes{'\n'}
            • Comply with all applicable laws and regulations{'\n'}
            • Respect other users and their property
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Rental Terms</Text>
          
          <Text style={{fontSize:16,fontWeight:'500',color:'#8E6652',marginTop:15,marginBottom:8}}>For Renters</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • Pay all rental fees and deposits as agreed{'\n'}
            • Return items in the same condition as received{'\n'}
            • Follow care instructions provided by the Seller{'\n'}
            • Report any damage or issues immediately{'\n'}
            • Return items by the agreed-upon date
          </Text>

          <Text style={{fontSize:16,fontWeight:'500',color:'#8E6652',marginTop:15,marginBottom:8}}>For Sellers</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • Provide accurate descriptions and photos{'\n'}
            • Ensure items are clean and in good condition{'\n'}
            • Respond promptly to rental requests{'\n'}
            • Provide clear care and return instructions{'\n'}
            • Honor confirmed rental agreements
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Payments and Fees</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • All payments are processed through secure third-party providers{'\n'}
            • Rent Clothes charges a service fee on each transaction{'\n'}
            • Security deposits may be required for high-value items{'\n'}
            • Refunds are subject to our refund policy{'\n'}
            • Users are responsible for applicable taxes{'\n'}
            • Late return fees may apply as specified by Sellers
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Prohibited Activities</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            You may not:{'\n\n'}
            • Use the service for illegal activities{'\n'}
            • Harass, abuse, or harm other users{'\n'}
            • Post false or misleading information{'\n'}
            • Attempt to circumvent our fee structure{'\n'}
            • Violate intellectual property rights{'\n'}
            • Use automated systems to access our service{'\n'}
            • Interfere with the platform's operation{'\n'}
            • Create fake accounts or reviews
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Content and Intellectual Property</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • You retain ownership of content you upload{'\n'}
            • You grant us license to use your content for service operation{'\n'}
            • You must have rights to all content you post{'\n'}
            • We may remove content that violates these Terms{'\n'}
            • Our platform and branding are our intellectual property{'\n'}
            • Respect trademark and copyright laws
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Liability and Disclaimers</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • We provide the platform "as is" without warranties{'\n'}
            • We are not responsible for disputes between users{'\n'}
            • We do not guarantee item availability or condition{'\n'}
            • Users assume risks associated with rental transactions{'\n'}
            • Our liability is limited to the maximum extent allowed by law{'\n'}
            • We recommend users obtain appropriate insurance
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Dispute Resolution</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • We encourage users to resolve disputes directly{'\n'}
            • Our support team can provide mediation assistance{'\n'}
            • Serious disputes may be subject to arbitration{'\n'}
            • Legal action must be brought within one year{'\n'}
            • Class action lawsuits are waived where permitted{'\n'}
            • Governing law is the jurisdiction of our headquarters
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Account Termination</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            • You may close your account at any time{'\n'}
            • We may suspend or terminate accounts for Terms violations{'\n'}
            • Outstanding rental obligations survive account closure{'\n'}
            • We may retain certain information as required by law{'\n'}
            • Termination does not affect completed transactions
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Changes to Terms</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            We reserve the right to modify these Terms at any time. We will notify users of significant changes through the app or via email. Continued use of our service after changes constitutes acceptance of the new Terms. If you disagree with changes, you must stop using our service.
          </Text>
        </View>

        <View style={{backgroundColor:'white',borderRadius:12,padding:20,marginTop:15,marginBottom:30,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:3.84,elevation:5}}>
          <Text style={{fontSize:18,fontWeight:'600',color:'#8E6652',marginBottom:12}}>Contact Us</Text>
          <Text style={{fontSize:14,lineHeight:22,color:'#333'}}>
            If you have questions about these Terms of Service, please contact us:{'\n\n'}
            Email: orvith@rentclothes.com{'\n'}
            For urgent matters, please use our in-app support feature.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
