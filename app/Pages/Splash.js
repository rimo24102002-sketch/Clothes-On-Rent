import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, StatusBar, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Splash = ({navigation}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered animations for professional entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8E6652" />
      
      <ImageBackground 
        source={require('./splash.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay for better text visibility */}
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        >
          {/* Top Section - Logo and Brand */}
          <Animated.View 
            style={[
              styles.topSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {/* Logo Icon */}
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="hanger" size={60} color="#fff" />
            </View>
            
            {/* Brand Name */}
            <Text style={styles.brandName}>LAAM</Text>
            <Text style={styles.tagline}>Rent Clothes</Text>
            
            {/* Decorative Line */}
            <View style={styles.decorativeLine} />
          </Animated.View>

          {/* Middle Section - Features */}
          <Animated.View 
            style={[
              styles.middleSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#F1DCD1" />
              <Text style={styles.featureText}>Premium Quality Outfits</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#F1DCD1" />
              <Text style={styles.featureText}>Affordable Rental Prices</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#F1DCD1" />
              <Text style={styles.featureText}>Fast & Secure Delivery</Text>
            </View>
          </Animated.View>

          {/* Bottom Section - CTA Button */}
          <Animated.View 
            style={[
              styles.bottomSection,
              {
                opacity: buttonAnim,
                transform: [{ translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })}]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8E6652', '#A47B68', '#8E6652']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>GET STARTED</Text>
                <View style={styles.buttonIconContainer}>
                  <Ionicons name="arrow-forward" size={24} color="#8E6652" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer Text */}
            <Text style={styles.footerText}>
              Your perfect outfit awaits
            </Text>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  
  // Top Section Styles
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(142, 102, 82, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#F1DCD1',
    marginTop: 8,
    letterSpacing: 2,
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: '#F1DCD1',
    marginTop: 15,
    borderRadius: 2,
  },

  // Middle Section Styles
  middleSection: {
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
    fontWeight: '500',
  },

  // Bottom Section Styles
  bottomSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
    marginRight: 10,
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#F1DCD1',
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Splash;
