import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Detail = ({ navigation }) => {
  const [selectedColor, setSelectedColor] = useState('grey');
  const [selectedSize, setSelectedSize] = useState('L');

  const handleRateProduct = () => {
    navigation.navigate('CReview', {
      productId: 'sample-product-id',
      productName: 'Flared Lehenga',
      productImage: 'https://placeholder-url.com/image.jpg'
    });
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTab' }]
    });
  };

  const handleAddToCart = () => {
    navigation.navigate('BottomTab', { screen: 'Cart' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header with Back and Home buttons */}
      <View style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoHome}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4
          }}
        >
          <Ionicons name="home" size={24} color="#8E6652" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={{
          width: '100%',
          height: 400,
          backgroundColor: '#FFF',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image
            source={require('./local.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>

        {/* Product Info Card */}
        <View style={{
          backgroundColor: '#FFF',
          marginTop: -30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingTop: 25,
          paddingHorizontal: 20,
          elevation: 5
        }}>
          {/* Title and Price */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Flared Lehenga
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#8E6652' }}>
                Rs 45,000
              </Text>
              <View style={{
                backgroundColor: '#E8F5E9',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15
              }}>
                <Text style={{ color: '#4CAF50', fontWeight: '600', fontSize: 12 }}>
                  7 Days Rental
                </Text>
              </View>
            </View>
          </View>

          {/* Try On Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('VTO')}
            style={{
              backgroundColor: '#8E6652',
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              elevation: 3
            }}
          >
            <MaterialIcons name="photo-camera" size={20} color="#FFF" />
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
              Virtual Try On
            </Text>
          </TouchableOpacity>

          {/* Description Section */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
              Description
            </Text>
            <View style={{
              backgroundColor: '#F9F9F9',
              padding: 15,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#8E6652'
            }}>
              <Text style={{ fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 8 }}>
                <Text style={{ fontWeight: '600', color: '#333' }}>Fabric: </Text>
                Pishwas/Dupatta: Organza, Lehenga
              </Text>
              <Text style={{ fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 8 }}>
                <Text style={{ fontWeight: '600', color: '#333' }}>Color: </Text>
                Grey
              </Text>
              <Text style={{ fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 8 }}>
                <Text style={{ fontWeight: '600', color: '#333' }}>Length: </Text>
                44-46 inches
              </Text>
              <Text style={{ fontSize: 14, color: '#666', lineHeight: 22 }}>
                <Text style={{ fontWeight: '600', color: '#333' }}>Model Size: </Text>
                S
              </Text>
            </View>
          </View>

          {/* Note */}
          <View style={{
            backgroundColor: '#FFF9E6',
            padding: 15,
            borderRadius: 12,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: '#FFA726'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialIcons name="info" size={20} color="#FFA726" />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#F57C00', marginLeft: 8 }}>
                Important Note
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: '#666', lineHeight: 20 }}>
              Dry clean only. Colors may slightly vary from pictures depending on your device settings.
            </Text>
          </View>

          {/* Color Selection */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 }}>
              Select Color
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setSelectedColor('green')}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#4CAF50',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: selectedColor === 'green' ? 3 : 0,
                  borderColor: '#333'
                }}
              >
                {selectedColor === 'green' && (
                  <Ionicons name="checkmark" size={28} color="#FFF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedColor('grey')}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#9E9E9E',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: selectedColor === 'grey' ? 3 : 0,
                  borderColor: '#333'
                }}
              >
                {selectedColor === 'grey' && (
                  <Ionicons name="checkmark" size={28} color="#FFF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedColor('purple')}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#9C27B0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: selectedColor === 'purple' ? 3 : 0,
                  borderColor: '#333'
                }}
              >
                {selectedColor === 'purple' && (
                  <Ionicons name="checkmark" size={28} color="#FFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Size Selection */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 }}>
              Select Size
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {['S', 'M', 'L'].map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: selectedSize === size ? '#8E6652' : '#F0F0F0',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: selectedSize === size ? '#8E6652' : 'transparent'
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: selectedSize === size ? '#FFF' : '#666'
                  }}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ marginBottom: 30, gap: 12 }}>
            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={handleAddToCart}
              style={{
                backgroundColor: '#8E6652',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>
                Add to Cart
              </Text>
            </TouchableOpacity>

            {/* Rate Product Button */}
            <TouchableOpacity
              onPress={handleRateProduct}
              style={{
                backgroundColor: '#FFF',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#8E6652',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <MaterialIcons name="star-rate" size={22} color="#8E6652" />
              <Text style={{ color: '#8E6652', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                Rate This Product
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Detail