import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { hakimsAPI, Hakim, HakimsResponse } from '../api/apiService';

export default function HakimsScreen() {
  const [hakims, setHakims] = useState<Hakim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHakims();
  }, []);

  const fetchHakims = async () => {
    try {
      setLoading(true);
      const response: HakimsResponse = await hakimsAPI.getHakims();
      if (response.success) {
        setHakims(response.hakims);
      } else {
        Alert.alert('Error', 'Failed to fetch hakims directory');
      }
    } catch (error: any) {
      console.error('❌ Error fetching hakims:', error);
      Alert.alert('Error', 'Failed to fetch hakims directory');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    return stars.join('') + ` (${rating})`;
  };

  const renderHakimCard = ({ item }: { item: Hakim }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.rating}>{renderStars(item.rating)}</Text>
      </View>
      
      <Text style={styles.specialization}>🩺 {item.specialization}</Text>
      <Text style={styles.experience}>📅 {item.experience} experience</Text>
      <Text style={styles.location}>📍 {item.location}</Text>
      
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(item.phone)}
        >
          <Text style={styles.callButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading hakims directory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🩺 Find Hakims</Text>
        <Text style={styles.headerSubtitle}>
          Connect with experienced traditional medicine practitioners
        </Text>
      </View>

      <FlatList
        data={hakims}
        keyExtractor={(item) => item.id}
        renderItem={renderHakimCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchHakims}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ⚠️ Always consult with qualified healthcare professionals
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#2e7d32',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e8f5e9',
    textAlign: 'center',
    marginTop: 5,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
  },
  specialization: {
    fontSize: 16,
    color: '#2e7d32',
    marginBottom: 5,
    fontWeight: '600',
  },
  experience: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
