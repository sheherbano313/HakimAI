import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>HakimAI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, backgroundColor: '#4CAF50' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});
