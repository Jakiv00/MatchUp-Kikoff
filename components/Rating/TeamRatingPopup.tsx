import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { X, Star, Info, ChevronRight } from 'lucide-react-native';
import RateTeammatesModal from './RateTeammatesModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Player {
  id: string;
  name: string;
  initials: string;
  position: string;
  rating: number;
}

interface TeamRatingPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (teamRating: number, fieldRating: number, rateAllPlayers: boolean, teammateRatings?: Record<string, number>) => void;
}

const mockPlayers: Player[] = [
  { id: '1', name: 'Jaki Valansi', initials: 'JV', position: 'GK', rating: 0 },
  { id: '2', name: 'Taha Çelik', initials: 'TÇ', position: 'DEF', rating: 0 },
  { id: '3', name: 'Hasan Erdem', initials: 'HE', position: 'DEF', rating: 0 },
  { id: '4', name: 'Kerim Dereli', initials: 'KD', position: 'MID', rating: 0 },
  { id: '5', name: 'Jeymi Moşe', initials: 'JM', position: 'FWD', rating: 0 },
];

export default function TeamRatingPopup({ visible, onClose, onSubmit }: TeamRatingPopupProps) {
  const [teamRating, setTeamRating] = useState(0);
  const [fieldRating, setFieldRating] = useState(0);
  const [rateAllPlayers, setRateAllPlayers] = useState(false);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [rateTeammatesModalVisible, setRateTeammatesModalVisible] = useState(false);
  const [manualToggleAction, setManualToggleAction] = useState(false);
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Reset all states when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset all states to initial values
      setTeamRating(0);
      setFieldRating(0);
      setRateAllPlayers(false);
      setPlayers(mockPlayers.map(p => ({ ...p, rating: 0 })));
      setRateTeammatesModalVisible(false);
      setManualToggleAction(false);
      
      // Animate modal in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      // Animate modal out
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Check if all players have 5 stars and update toggle accordingly
  useEffect(() => {
    if (!manualToggleAction) {
      const allPlayersRated5 = players.length > 0 && players.every(player => player.rating === 5);
      setRateAllPlayers(allPlayersRated5);
    } else {
      // If any player's rating is less than 5, turn off the toggle
      const anyPlayerNotRated5 = players.some(player => player.rating !== 5);
      if (anyPlayerNotRated5) {
        setRateAllPlayers(false);
        setManualToggleAction(false);
      }
    }
  }, [players, manualToggleAction]);

  // Handle toggle effect - Auto-rate all players when toggle is enabled
  useEffect(() => {
    if (rateAllPlayers && manualToggleAction) {
      setPlayers(prev => prev.map(player => ({ ...player, rating: 5 })));
    }
  }, [rateAllPlayers, manualToggleAction]);

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

  const renderStars = (rating: number, onStarPress: (star: number) => void, size: number = 36) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={[styles.starButton, { width: size + 8, height: size + 8 }]}
            onPress={() => onStarPress(star)}
            activeOpacity={0.7}
          >
            <Star
              size={size}
              color={star <= rating ? '#3b82f6' : '#374151'}
              fill={star <= rating ? '#3b82f6' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleTeamStarPress = (star: number) => {
    // If clicking the same star that's already the rating, deselect (set to 0)
    const newRating = teamRating === star ? 0 : star;
    setTeamRating(newRating);
  };

  const handleFieldStarPress = (star: number) => {
    // If clicking the same star that's already the rating, deselect (set to 0)
    const newRating = fieldRating === star ? 0 : star;
    setFieldRating(newRating);
  };

  const handleRateTeammatesPress = () => {
    setRateTeammatesModalVisible(true);
  };

  const handleRateTeammatesSubmit = (ratings: Record<string, number>) => {
    // Update players with new ratings
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        rating: ratings[player.id] !== undefined ? ratings[player.id] : player.rating
      }))
    );
    setRateTeammatesModalVisible(false);
  };

  const handleToggleChange = (value: boolean) => {
    setManualToggleAction(true);
    setRateAllPlayers(value);
    
    if (value) {
      // When manually turning ON, set all players to 5 stars
      setPlayers(prev => prev.map(player => ({ ...player, rating: 5 })));
    } else {
      // When manually turning OFF, reset all player ratings to 0
      setPlayers(prev => prev.map(player => ({ ...player, rating: 0 })));
    }
  };

  const handleSubmit = () => {
    const teammateRatings = players.reduce((acc, player) => {
      if (player.rating > 0) {
        acc[player.id] = player.rating;
      }
      return acc;
    }, {} as Record<string, number>);

    onSubmit(teamRating, fieldRating, rateAllPlayers, teammateRatings);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const canSubmit = teamRating > 0 || fieldRating > 0 || players.some(p => p.rating > 0);
  const ratedPlayersCount = players.filter(p => p.rating > 0).length;

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
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>

            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {/* Team Rating Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Rating</Text>
                {renderStars(teamRating, handleTeamStarPress, 40)}
              </View>

              {/* Rate Teammates Button */}
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.rateTeammatesButton}
                  onPress={handleRateTeammatesPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.rateTeammatesButtonContent}>
                    <Text style={styles.rateTeammatesButtonText}>Rate Teammates</Text>
                    {ratedPlayersCount > 0 && (
                      <Text style={styles.ratedPlayersCount}>
                        {ratedPlayersCount} rated
                      </Text>
                    )}
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* 5 Star to All Players Toggle */}
              <View style={styles.toggleSection}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <Text style={styles.toggleLabel}>5 star to all players</Text>
                    <TouchableOpacity style={styles.infoButton}>
                      <Info size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                  <Switch
                    value={rateAllPlayers}
                    onValueChange={handleToggleChange}
                    trackColor={{ false: '#374151', true: '#3b82f6' }}
                    thumbColor={Platform.OS === 'ios' ? '#ffffff' : rateAllPlayers ? '#ffffff' : '#f4f3f4'}
                    ios_backgroundColor="#374151"
                  />
                </View>
              </View>

              {/* Field Rating Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Field Rating</Text>
                {renderStars(fieldRating, handleFieldStarPress, 32)}
              </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  canSubmit && styles.submitButtonActive
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                <Text style={[
                  styles.submitButtonText,
                  canSubmit && styles.submitButtonTextActive
                ]}>
                  Submit Ratings
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Rate Teammates Modal */}
      {rateTeammatesModalVisible && (
        <RateTeammatesModal
          visible={rateTeammatesModalVisible}
          onClose={() => setRateTeammatesModalVisible(false)}
          onSubmit={handleRateTeammatesSubmit}
          players={players}
          setPlayers={setPlayers}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  scrollContent: {
    maxHeight: SCREEN_HEIGHT * 0.65,
  },
  scrollContentContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  starButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  rateTeammatesButton: {
    backgroundColor: '#0f1115',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  rateTeammatesButtonContent: {
    flex: 1,
  },
  rateTeammatesButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  ratedPlayersCount: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  toggleSection: {
    marginBottom: 32,
    width: '100%',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  toggleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginRight: 8,
  },
  infoButton: {
    padding: 4,
  },
  submitContainer: {
    padding: 24,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#3b82f6',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  submitButtonTextActive: {
    color: '#ffffff',
  },
});