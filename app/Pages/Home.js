import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedRole } from '../_redux/Slices/HomeDataSlice'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

const Home = ({navigation}) => {
  const dispatch = useDispatch()
  const [selectedRole, setSelectedRoleState] = useState(null)

  // Handle Customer selection
  const handleCustomerPress = () => {
    console.log('Customer role selected')
    setSelectedRoleState('Customer')
    // Save selected role to Redux for use in Login/SignUp
    dispatch(setSelectedRole('Customer'))
    // Navigate to Login page - role will be read from Redux
    navigation.navigate('Login')
  }

  // Handle Seller selection
  const handleSellerPress = () => {
    console.log('Seller role selected')
    setSelectedRoleState('Seller')
    // Save selected role to Redux for use in Login/SignUp
    dispatch(setSelectedRole('Seller'))
    // Navigate to SignUp page - role will be read from Redux
    navigation.navigate('SignUp')
  }
     
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <View style={styles.headerRight} />
      </View>

      <ImageBackground 
        source={require('./Home.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* App Title */}
          <Text style={styles.appTitle}>Rent Clothes</Text>
          
          {/* Main Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.heading}>Sign In As</Text>
            <Text style={styles.subheading}>Choose your account type to continue</Text>
            
            {/* Customer Button */}
            <TouchableOpacity 
              style={[
                styles.roleButton,
                selectedRole === 'Customer' && styles.selectedButton
              ]}
              onPress={handleCustomerPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Customer</Text>
              <Text style={styles.buttonSubtext}>Browse and rent clothes</Text>
            </TouchableOpacity>
            
            {/* Seller Button */}
            <TouchableOpacity 
              style={[
                styles.roleButton,
                selectedRole === 'Seller' && styles.selectedButton
              ]}
              onPress={handleSellerPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Seller</Text>
              <Text style={styles.buttonSubtext}>List your clothes for rent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8E6652',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Balance the back button
  },
  headerRight: {
    width: 40, // Same width as back button for centering
  },
  backgroundImage: {
    width: '100%',
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  appTitle: {
    fontWeight: 'bold',
    fontSize: 28,
    marginLeft: 20,
    marginTop: 40,
    color: '#8E6652',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -50,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    color: '#8E6652',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  roleButton: {
    width: '85%',
    backgroundColor: '#8E6652',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  selectedButton: {
    backgroundColor: '#6B4E3D',
    transform: [{ scale: 1.05 }],
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#F1DCD1',
    textAlign: 'center',
  },
})

export default Home