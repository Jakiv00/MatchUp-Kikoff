import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { X, Star } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Player {
  id: string;
  name: string;
  initials: string;
  position: string;
  rating: number;
}

interface RateTeammatesModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (ratings: Record<string, number>) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

export default function RateTeammatesModal({
  visible,
  onClose,
  onSubmit,
  players,
  setPlayers,
}: RateTeammatesModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
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

  const updatePlayerRating = (playerId: string, rating: number) => {
    setPlayers(
      players.map(player => {
        if (player.id === playerId) {
          // If clicking the same star that's already the rating, deselect (set to 0)
          const newRating = player.rating === rating ? 0 : rating;
          return { ...player, rating: newRating };
        }
        return player;
      })
    );
  };

  const renderPlayerStars = (player: Player) => {
    return (
      <View style={styles.playerStarsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.playerStarButton}
            onPress={() => updatePlayerRating(player.id, star)}
            activeOpacity={0.7}
          >
            <Star
              size={22}
              color={star <= player.rating ? '#3b82f6' : '#374151'}
              fill={star <= player.rating ? '#3b82f6' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return '#6366f1';
      case 'DEF': return '#10b981';
      case 'MID': return '#f59e0b';
      case 'FWD': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const handleSubmit = () => {
    const ratings = players.reduce((acc, player) => {
      if (player.rating > 0) {
        acc[player.id] = player.rating;
      }
      return acc;
    }, {} as Record<string, number>);

    onSubmit(ratings);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const canSubmit = players.some(player => player.rating > 0);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, animatedBackdropStyle, { zIndex: 1000 }]}>
        <View style={[styles.backdropContainer, { zIndex: 1001 }]}>
          <Animated.View style={[styles.modalContainer, animatedModalStyle, { zIndex: 1002 }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Rate Teammates</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Players List */}
            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
            >
              <View style={styles.teammatesList}>
                {players.map((player) => (
                  <View key={player.id} style={styles.teammateRow}>
                    {/* Player Avatar and Position */}
                    <View style={styles.playerInfo}>
                      <View style={[
                        styles.playerAvatar,
                        { backgroundColor: getPositionColor(player.position) }
                      ]}>
                        <Text style={styles.playerInitials}>{player.initials}</Text>
                      </View>
                      <Text style={styles.playerPosition}>{player.position}</Text>
                    </View>

                    {/* Player Name */}
                    <View style={styles.playerNameContainer}>
                      <Text style={styles.playerName}>{player.name}</Text>
                    </View>

                    {/* Rating Stars */}
                    {renderPlayerStars(player)}
                  </View>
                ))}
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
    maxHeight: SCREEN_HEIGHT * 0.8,
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
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  scrollContentContainer: {
    paddingVertical: 8,
  },
  teammatesList: {
    paddingHorizontal: 24,
  },
  teammateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  playerInfo: {
    alignItems: 'center',
    marginRight: 16,
    width: 50,
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playerInitials: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  playerPosition: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  playerNameContainer: {
    flex: 1,
    marginRight: 16,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  playerStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerStarButton: {
    padding: 4,
    borderRadius: 4,
  },
  submitContainer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
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