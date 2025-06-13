import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import CustomToast from '@/components/CustomToast';

export default function JoinMatchScreen() {
  const params = useLocalSearchParams();
  const matchId = params.id as string;
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [notes, setNotes] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  
  const positions = [
    'GK', 'DEF', 'MID', 'FWD', 'Any'
  ];
  
  const handleClose = () => {
    router.back();
  };
  
  const handleSubmit = () => {
    if (!name.trim()) {
      setToastVisible(true);
      return;
    }
    
    if (!position) {
      setToastVisible(true);
      return;
    }
    
    // Here you would send the request to join the match
    console.log('Join request submitted', {
      matchId,
      name,
      position,
      notes,
    });
    
    // Navigate back to home screen with showToast parameter
    router.replace({ pathname: '/(tabs)', params: { showToast: '1' } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleClose}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Join Match</Text>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
        >
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Confirm Participation</Text>
        <Text style={styles.subtitle}>Please provide the following information to join this match</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#6b7280"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Preferred Position</Text>
            <View style={styles.positionsContainer}>
              {positions.map((pos) => (
                <TouchableOpacity
                  key={pos}
                  style={[
                    styles.positionButton,
                    position === pos && styles.selectedPositionButton
                  ]}
                  onPress={() => setPosition(pos)}
                >
                  <Text
                    style={[
                      styles.positionButtonText,
                      position === pos && styles.selectedPositionButtonText
                    ]}
                  >
                    {pos}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional information you'd like to share"
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleClose}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Request to Join</Text>
        </TouchableOpacity>
      </View>

      <CustomToast
        visible={toastVisible}
        message={!name.trim() ? "Please enter your name" : !position ? "Please select your preferred position" : "Request sent. Waiting for team approval."}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#1a1d23',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  positionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  positionButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedPositionButton: {
    backgroundColor: '#3b82f6',
  },
  positionButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  selectedPositionButtonText: {
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1d23',
  },
  cancelButton: {
    flex: 0.48,
    backgroundColor: '#4b5563',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 0.52,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});