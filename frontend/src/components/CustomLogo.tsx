import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
  style?: any;
}

export default function CustomLogo({ 
  size = 'medium', 
  showText = true, 
  color = '#2e7d32',
  style 
}: CustomLogoProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { containerSize: 40, fontSize: 14, iconSize: 20 };
      case 'large':
        return { containerSize: 80, fontSize: 24, iconSize: 40 };
      default:
        return { containerSize: 60, fontSize: 18, iconSize: 30 };
    }
  };

  const { containerSize, fontSize, iconSize } = getSize();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.logoContainer, { width: containerSize, height: containerSize }]}>
        {/* Main circle background */}
        <View style={[styles.circle, { 
          width: containerSize, 
          height: containerSize, 
          backgroundColor: color + '20' // 20% opacity
        }]}>
          {/* Inner circle */}
          <View style={[styles.innerCircle, { 
            width: containerSize * 0.7, 
            height: containerSize * 0.7,
            backgroundColor: color + '40' // 40% opacity
          }]}>
            {/* Leaf icon */}
            <Text style={[styles.leafIcon, { fontSize: iconSize }]}>
              🌿
            </Text>
          </View>
        </View>
      </View>
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.mainText, { fontSize, color }]}>
            Hakim
          </Text>
          <Text style={[styles.aiText, { fontSize: fontSize * 0.8, color }]}>
            AI
          </Text>
        </View>
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circle: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  innerCircle: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  leafIcon: {
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainText: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  aiText: {
    fontWeight: 'bold',
    color: '#4caf50',
    marginLeft: 2,
  },
});
