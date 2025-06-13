import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { X, MapPin, User } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (preferredPosition: string, location: string) => void;
  currentPosition: string;
  currentLocation: string;
}

const positions = [
  { id: 'GK', label: 'Goalkeeper', color: '#6366f1' },
  { id: 'LB', label: 'Left Back', color: '#10b981' },
  { id: 'CB', label: 'Center Back', color: '#10b981' },
  { id: 'RB', label: 'Right Back', color: '#10b981' },
  { id: 'CDM', label: 'Defensive Mid', color: '#f59e0b' },
  { id: 'CM', label: 'Center Mid', color: '#f59e0b' },
  { id: 'CAM', label: 'Attacking Mid', color: '#f59e0b' },
  { id: 'LW', label: 'Left Wing', color: '#ef4444' },
  { id: 'RW', label: 'Right Wing', color: '#ef4444' },
  { id: 'ST', label: 'Striker', color: '#ef4444' },
];

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  currentPosition,
  currentLocation,
}: EditProfileModalProps) {
  const [selectedPosition, setSelectedPosition] = useState(currentPosition);
  const [location, setLocation] = useState(currentLocation);
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      setSelectedPosition(currentPosition);
      setLocation(currentLocation);
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scale.value, [0, 1], [0.8, 1]),
      },
    ],
    opacity: opacity.value,
  }));

  const handleSave = () => {
    onSave(selectedPosition, location);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <View style={styles.backdropContainer}>
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {/* Location Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MapPin size={20} color="#3b82f6" />
                  <Text style={styles.sectionTitle}>Location</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Preferred Position Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <User size={20} color="#3b82f6" />
                  <Text style={styles.sectionTitle}>Preferred Position</Text>
                </View>
                
                <View style={styles.positionsGrid}>
                  {positions.map((position) => (
                    <TouchableOpacity
                      key={position.id}
                      style={[
                        styles.positionButton,
                        selectedPosition === position.id && styles.selectedPositionButton,
                        { borderColor: position.color }
                      ]}
                      onPress={() => setSelectedPosition(position.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.positionBadge,
                        { backgroundColor: position.color },
                        selectedPosition === position.id && styles.selectedPositionBadge
                      ]}>
                        <Text style={styles.positionCode}>{position.id}</Text>
                      </View>
                      <Text style={[
                        styles.positionLabel,
                        selectedPosition === position.id && styles.selectedPositionLabel
                      ]}>
                        {position.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backdropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 20,
    maxWidth: 400,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  scrollContentContainer: {
    paddingVertical: 8,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  positionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  positionButton: {
    backgroundColor: '#0f1115',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPositionButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedPositionBadge: {
    transform: [{ scale: 1.1 }],
  },
  positionCode: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  positionLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedPositionLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});