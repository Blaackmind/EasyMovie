import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NoAvatar = ({ size = 100, color = "#FFF" }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <MaterialCommunityIcons 
        name="account-circle" 
        size={size} 
        color={color} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default NoAvatar; 