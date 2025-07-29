import React from 'react';
import { View, StyleSheet } from 'react-native';

const GlassCard = ({ 
  children, 
  style, 
  alignItems = 'center',
  marginBottom = 24,
  padding = 16,
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.glassCard, 
        { 
          alignItems, 
          marginBottom, 
          padding 
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    // Additional glass styling to match your theme
    backdropFilter: 'blur(10px)',
  },
});

export default GlassCard;