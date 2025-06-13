import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { CreditCard as Edit3, CreditCard } from 'lucide-react-native';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import EditProfileModal from '@/components/Profile/EditProfileModal';

export default function ProfileScreen() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [preferredPosition, setPreferredPosition] = useState('ST');
  const [location, setLocation] = useState('Los Angeles, CA');

  const handleEditPress = () => {
    setEditModalVisible(true);
  };

  const handlePaymentPress = () => {
    // Handle payment/billing functionality
    console.log('Payment button pressed');
  };

  const handleSaveProfile = (newPosition: string, newLocation: string) => {
    setPreferredPosition(newPosition);
    setLocation(newLocation);
    setEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handlePaymentPress}
            activeOpacity={0.7}
          >
            <CreditCard size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditPress}
            activeOpacity={0.7}
          >
            <Edit3 size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ProfileHeader
        username="Alex Rodriguez"
        email="alex.rodriguez@email.com"
        location={location}
        rating={4.8}
        matchesPlayed={34}
        teamRating={4.2}
        preferredPosition={preferredPosition}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Additional profile content will go here</Text>
        </View>
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveProfile}
        currentPosition={preferredPosition}
        currentLocation={location}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  content: {
    flex: 1,
  },
  placeholder: {
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});