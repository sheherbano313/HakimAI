import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { contactAPI, ContactInfo, ContactResponse } from '../api/apiService';

export default function ContactUsScreen() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response: ContactResponse = await contactAPI.getInfo();
      if (response.success) {
        setContactInfo(response.contact);
      } else {
        Alert.alert('Error', 'Failed to fetch contact information');
      }
    } catch (error: any) {
      console.error('❌ Error fetching contact info:', error);
      Alert.alert('Error', 'Failed to fetch contact information');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (url: string, type: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', `Unable to open ${type}`);
    });
  };

  const handleCall = (phone: string) => {
    handlePress(`tel:${phone}`, 'phone');
  };

  const handleEmail = (email: string) => {
    handlePress(`mailto:${email}`, 'email');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading contact information...</Text>
      </View>
    );
  }

  if (!contactInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load contact information</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchContactInfo}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📞 Contact Us</Text>
        <Text style={styles.headerSubtitle}>
          Get in touch with the HakimAI team
        </Text>
      </View>

      <View style={styles.content}>
        {/* Email */}
        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📧</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{contactInfo.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEmail(contactInfo.email)}
          >
            <Text style={styles.actionButtonText}>Send Email</Text>
          </TouchableOpacity>
        </View>

        {/* Phone */}
        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📱</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{contactInfo.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(contactInfo.phone)}
          >
            <Text style={styles.actionButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📍</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>{contactInfo.address}</Text>
          </View>
        </View>

        {/* Website */}
        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>🌐</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Website</Text>
            <Text style={styles.contactValue}>{contactInfo.website}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handlePress(contactInfo.website, 'website')}
          >
            <Text style={styles.actionButtonText}>Visit</Text>
          </TouchableOpacity>
        </View>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton]}
              onPress={() => handlePress(contactInfo.socialMedia.facebook, 'Facebook')}
            >
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.socialButton, styles.twitterButton]}
              onPress={() => handlePress(contactInfo.socialMedia.twitter, 'Twitter')}
            >
              <Text style={styles.socialButtonText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.socialButton, styles.instagramButton]}
              onPress={() => handlePress(contactInfo.socialMedia.instagram, 'Instagram')}
            >
              <Text style={styles.socialButtonText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Hours */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>🕒 Support Hours</Text>
          <Text style={styles.supportText}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
          <Text style={styles.supportText}>Saturday: 10:00 AM - 4:00 PM</Text>
          <Text style={styles.supportText}>Sunday: Closed</Text>
          <Text style={styles.supportNote}>
            We typically respond to emails within 24 hours
          </Text>
        </View>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  content: {
    padding: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  socialSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  twitterButton: {
    backgroundColor: '#1da1f2',
  },
  instagramButton: {
    backgroundColor: '#e4405f',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  supportCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
    textAlign: 'center',
  },
  supportText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'center',
  },
  supportNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});
