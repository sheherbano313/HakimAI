import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppIconProps {
  size?: number;
  showText?: boolean;
}

export default function AppIcon({ size = 100, showText = false }: AppIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <View style={[styles.backgroundCircle, { 
        width: size, 
        height: size, 
        borderRadius: size / 2 
      }]}>
        {/* Inner circle */}
        <View style={[styles.innerCircle, { 
          width: size * 0.75, 
          height: size * 0.75, 
          borderRadius: (size * 0.75) / 2 
        }]}>
          {/* Leaf icon */}
          <Text style={[styles.leafIcon, { fontSize: size * 0.4 }]}>
            🌿
          </Text>
        </View>
      </View>
      
      {/* Decorative dots */}
      <View style={[styles.dot, styles.dot1, { 
        width: size * 0.08, 
        height: size * 0.08, 
        borderRadius: (size * 0.08) / 2 
      }]} />
      <View style={[styles.dot, styles.dot2, { 
        width: size * 0.08, 
        height: size * 0.08, 
        borderRadius: (size * 0.08) / 2 
      }]} />
      <View style={[styles.dot, styles.dot3, { 
        width: size * 0.08, 
        height: size * 0.08, 
        borderRadius: (size * 0.08) / 2 
      }]} />
      <View style={[styles.dot, styles.dot4, { 
        width: size * 0.08, 
        height: size * 0.08, 
        borderRadius: (size * 0.08) / 2 
      }]} />
      
      {showText && (
        <Text style={[styles.text, { fontSize: size * 0.12 }]}>
          HakimAI
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1b5e20',
  },
  innerCircle: {
    backgroundColor: '#4caf50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  leafIcon: {
    fontWeight: 'bold',
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#81c784',
    opacity: 0.6,
  },
  dot1: {
    top: '15%',
    left: '15%',
  },
  dot2: {
    top: '15%',
    right: '15%',
  },
  dot3: {
    bottom: '15%',
    left: '15%',
  },
  dot4: {
    bottom: '15%',
    right: '15%',
  },
  text: {
    position: 'absolute',
    bottom: -30,
    color: '#2e7d32',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
