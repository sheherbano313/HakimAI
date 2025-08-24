import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2025 HakimAI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { padding: 10, backgroundColor: '#eee', alignItems: 'center' },
  text: { color: '#555' }
});
