import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function StandardHeader({ 
  title, 
  navigation, 
  showBackButton = true, 
  rightComponent = null,
  backgroundColor = '#8E6652',
  textColor = '#fff'
}) {
  return (
    <View style={{
      backgroundColor: backgroundColor,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={{ marginRight: 16, padding: 4 }}
          >
            <Feather name="arrow-left" size={24} color={textColor} />
          </TouchableOpacity>
        )}
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          color: textColor,
          flex: 1,
        }}>
          {title}
        </Text>
      </View>
      
      {rightComponent && (
        <View style={{ marginLeft: 16 }}>
          {rightComponent}
        </View>
      )}
    </View>
  );
}
