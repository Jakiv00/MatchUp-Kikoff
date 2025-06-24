import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
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
import { X, Users, Trophy, Target } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Team {
  id: string;
  name: string;
  members: number;
  wins: number;
  losses: number;
  avatar: string;
  color: string;
  teamSize: number;
  formation?: any;
  players?: any[];
}

interface TeamInfoModalProps {
  visible: boolean;
  onClose: () => void;
  team: Team;
}

export default function TeamInfoModal({
  visible,
  onClose,
  team,
}: TeamInfoModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
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

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return '#6366f1';
      case 'LB':
      case 'CB':
      case 'RB':
      case 'LCB':
      case 'RCB': return '#10b981';
      case 'CDM':
      case 'CM':
      case 'CAM':
      case 'LCM':
      case 'RCM':
      case 'LM':
      case 'RM': return '#f59e0b';
      case 'LW':
      case 'ST':
      case 'RW':
      case 'LS':
      case 'RS': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const renderFormationField = () => {
    if (!team.formation) {
      return (
        <View style={styles.noFormationContainer}>
          <Text style={styles.noFormationText}>No formation configured</Text>
        </View>
      );
    }

    return (
      <View style={styles.soccerField}>
        <View style={styles.fieldCenter}>
          <View style={styles.centerCircle} />
        </View>
        <View style={styles.goalArea1} />
        <View style={styles.goalArea2} />
        
        {team.formation.positions.map((position: any) => {
          const assignedPlayer = team.players?.find(p => p.position === position.name);
          
          return (
            <View
              key={position.id}
              style={[
                styles.positionCircle,
                {
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                },
                assignedPlayer && styles.filledPositionCircle,
                position.isGoalkeeper && styles.goalkeeperPosition
              ]}
            >
              <View style={[
                styles.positionInner,
                position.isGoalkeeper && styles.goalkeeperInner,
                { backgroundColor: assignedPlayer ? getPositionColor(position.name) : '#4b5563' }
              ]}>
                {assignedPlayer ? (
                  <Text style={styles.playerInitials}>{assignedPlayer.initials}</Text>
                ) : (
                  <Text style={[
                    styles.positionText,
                    position.isGoalkeeper && styles.goalkeeperText
                  ]}>{position.name}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderPlayersList = () => {
    if (!team.players || team.players.length === 0) {
      return (
        <View style={styles.noPlayersContainer}>
          <Text style={styles.noPlayersText}>No players information available</Text>
        </View>
      );
    }

    const positionedPlayers = team.players.filter(p => p.position);
    const benchPlayers = team.players.filter(p => !p.position);

    return (
      <View>
        {/* Starting XI */}
        {positionedPlayers.length > 0 && (
          <View style={styles.playerGroup}>
            <Text style={styles.playerGroupTitle}>Starting XI</Text>
            <View style={styles.playersGrid}>
              {positionedPlayers.map((player) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={[
                    styles.playerAvatar,
                    { backgroundColor: getPositionColor(player.position || player.preferredPosition) }
                  ]}>
                    <Text style={styles.playerInitials}>{player.initials}</Text>
                  </View>
                  <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                  <Text style={styles.playerPosition}>{player.position}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bench */}
        {benchPlayers.length > 0 && (
          <View style={styles.playerGroup}>
            <Text style={styles.playerGroupTitle}>Bench</Text>
            <View style={styles.playersGrid}>
              {benchPlayers.map((player) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={[
                    styles.playerAvatar,
                    { backgroundColor: getPositionColor(player.preferredPosition) }
                  ]}>
                    <Text style={styles.playerInitials}>{player.initials}</Text>
                  </View>
                  <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                  <Text style={styles.playerPosition}>{player.preferredPosition}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <View style={styles.backdropContainer}>
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Team Details</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {/* Team Info Card */}
              <View style={styles.teamInfoCard}>
                <View style={styles.teamHeader}>
                  <View style={[styles.teamAvatar, { backgroundColor: team.color }]}>
                    <Text style={styles.teamAvatarText}>{team.avatar}</Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamMembers}>{team.members} members</Text>
                  </View>
                </View>

                {/* Team Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Trophy size={20} color="#f59e0b" />
                    <Text style={styles.statValue}>{team.wins}</Text>
                    <Text style={styles.statLabel}>Wins</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Target size={20} color="#ef4444" />
                    <Text style={styles.statValue}>{team.losses}</Text>
                    <Text style={styles.statLabel}>Losses</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Users size={20} color="#3b82f6" />
                    <Text style={styles.statValue}>{team.teamSize}v{team.teamSize}</Text>
                    <Text style={styles.statLabel}>Format</Text>
                  </View>
                </View>
              </View>

              {/* Formation */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Formation: {team.formation?.name || 'Not Set'}
                </Text>
                {renderFormationField()}
              </View>

              {/* Players List */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Squad ({team.players?.length || 0} players)
                </Text>
                {renderPlayersList()}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
    maxHeight: SCREEN_HEIGHT * 0.9,
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
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  scrollContentContainer: {
    paddingBottom: 24,
  },
  teamInfoCard: {
    backgroundColor: '#0f1115',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  teamAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  teamMembers: {
    fontSize: 16,
    color: '#9ca3af',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#1a1d23',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  noFormationContainer: {
    backgroundColor: '#0f1115',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFormationText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
  soccerField: {
    width: SCREEN_WIDTH - 64,
    height: 200,
    backgroundColor: '#1f2a2f',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  fieldCenter: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: '50%',
  },
  centerCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    top: -20,
    left: '50%',
    marginLeft: -20,
  },
  goalArea1: {
    position: 'absolute',
    width: 80,
    height: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 0,
    top: 0,
    left: '50%',
    marginLeft: -40,
  },
  goalArea2: {
    position: 'absolute',
    width: 80,
    height: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopWidth: 0,
    bottom: 0,
    left: '50%',
    marginLeft: -40,
  },
  positionCircle: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  positionInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledPositionCircle: {
    backgroundColor: '#3b82f6',
  },
  goalkeeperPosition: {
    width: 36,
    height: 36,
    borderRadius: 18,
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  goalkeeperInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  goalkeeperText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  positionText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '700',
  },
  playerInitials: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  noPlayersContainer: {
    backgroundColor: '#0f1115',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPlayersText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
  playerGroup: {
    marginBottom: 20,
  },
  playerGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  playerCard: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 80) / 4,
    marginBottom: 12,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 8,
    color: '#9ca3af',
    fontWeight: '600',
  },
});