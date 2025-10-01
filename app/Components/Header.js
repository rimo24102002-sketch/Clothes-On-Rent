import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Header = ({ title, onBackPress, showBackButton = true, rightComponent = null }) => {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
      backgroundColor: "#8E6652",
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    }}>
      {showBackButton && (
        <TouchableOpacity 
          style={{ padding: 8, marginRight: 2 }} 
          onPress={onBackPress}
        >
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      
      <Text style={{
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        marginLeft: showBackButton ? 10 : 0,
        marginTop: 8,
        flex: 1
      }}>
        {title}
      </Text>
      
      {rightComponent && (
        <View style={{ marginLeft: 10, marginTop: 8 }}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

export default Header;
