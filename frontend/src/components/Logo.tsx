import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
  style?: any;
}

export default function Logo({ 
  size = 'medium', 
  showText = true, 
  color = '#2e7d32',
  style 
}: LogoProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { iconSize: 24, fontSize: 16 };
      case 'large':
        return { iconSize: 48, fontSize: 28 };
      default:
        return { iconSize: 32, fontSize: 20 };
    }
  };

  const { iconSize, fontSize } = getSize();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <Text style={[styles.icon, { fontSize: iconSize * 0.6, color }]}>
          🌿
        </Text>
      </View>
      {showText && (
        <Text style={[styles.text, { fontSize, color }]}>
          HakimAI
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  icon: {
    fontWeight: 'bold',
  },
  text: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
