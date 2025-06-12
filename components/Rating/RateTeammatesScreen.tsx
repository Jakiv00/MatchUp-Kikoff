import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ArrowLeft, Star } from 'lucide-react-native';

interface Player {
  id: string;
  name: string;
  initials: string;
  position: string;
  rating: number;
}

interface RateTeammatesScreenProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (ratings: Record<string, number>) => void;
}

const mockPlayers: Player[] = [
  { id: '1', name: 'Jaki Valansi', initials: 'JV', position: 'GK', rating: 0 },
  { id: '2', name: 'Taha Çelik', initials: 'TÇ', position: 'DEF', rating: 0 },
  { id: '3', name: 'Hasan Erdem', initials: 'HE', position: 'DEF', rating: 0 },
  { id: '4', name: 'Kerim Dereli', initials: 'KD', position: 'MID', rating: 0 },
  { id: '5', name: 'Jeymi Moşe', initials: 'JM', position: 'FWD', rating: 0 },
];

export default function RateTeammatesScreen({ visible, onClose, onSubmit }: RateTeammatesScreenProps) {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const scale = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const updatePlayerRating = (playerId: string, rating: number) => {
    setPlayers(prev => 
      prev.map(player => {
        if (player.id === playerId) {
          // If clicking the same star that's already the rating, deselect (set to 0)
          const newRating = player.rating === rating ? 0 : rating;
          return { ...player, rating: newRating };
        }
        return player;
      })
    );
  };

  const renderStars = (player: Player) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => updatePlayerRating(player.id, star)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.starWrapper,
                star <= player.rating && styles.starWrapperActive,
              ]}
            >
              <Star
                size={24}
                color={star <= player.rating ? '#3b82f6' : '#374151'}
                fill={star <= player.rating ? '#3b82f6' : 'transparent'}
              />
            </Animated.View>
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

  const canSubmit = players.some(player => player.rating > 0);

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Teammates</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Players List */}
        <ScrollView 
          style={styles.playersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.playersContent}
        >
          {players.map((player) => (
            <View key={player.id} style={styles.playerRow}>
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
              {renderStars(player)}
            </View>
          ))}
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d23',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerRight: {
    width: 40,
  },
  playersList: {
    flex: 1,
  },
  playersContent: {
    paddingVertical: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d23',
  },
  playerInfo: {
    alignItems: 'center',
    marginRight: 16,
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
    fontSize: 12,
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
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  starWrapper: {
    transform: [{ scale: 1 }],
  },
  starWrapperActive: {
    transform: [{ scale: 1.1 }],
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a1d23',
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