import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
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
import { X, Save, Users, Plus, ChevronRight } from 'lucide-react-native';

// Import existing components
import TeamSizeSelector from '@/components/CreateMatch/TeamSizeSelector';
import TacticsMenu from '@/components/CreateMatch/TacticsMenu';
import PlayerSelectorModal from '@/components/CreateTeam/PlayerSelectorModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Types
interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
  filled: boolean;
  playerId?: string;
}

interface Formation {
  id: string;
  name: string;
  positions: Position[];
}

interface Player {
  id: string;
  initials: string;
  name: string;
  selected: boolean;
  position?: string;
  preferredPosition: string;
}

interface CreateTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: any) => void;
}

export default function CreateTeamModal({ visible, onClose, onCreateTeam }: CreateTeamModalProps) {
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Team configuration state
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(11);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState('');
  
  // Tactics state
  const [isTacticsMenuOpen, setIsTacticsMenuOpen] = useState(true);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  
  // Players state
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerSelectorVisible, setPlayerSelectorVisible] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setTeamName('');
      setTeamSize(11);
      setIsCustomSize(false);
      setCustomSize('');
      setSelectedFormation(null);
      setPlayers([]);
      
      // Animate in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      // Animate out
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

  const handleCreateTeam = () => {
    // Create comprehensive team data structure matching mock teams
    const teamData = {
      name: teamName,
      teamSize: teamSize,
      wins: 0, // Initialize with 0 wins
      losses: 0, // Initialize with 0 losses
      members: players.length,
      avatar: teamName.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2),
      color: '#8b5cf6', // Default purple color for new teams
      isLeader: true, // User is always the leader of teams they create
      formation: selectedFormation,
      players: players,
    };

    onCreateTeam(teamData);
    onClose();
  };

  const canCreate = () => {
    return teamName.trim().length > 0 && players.length >= teamSize;
  };

  const handlePlayersUpdate = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return '#6366f1';
      case 'LB':
      case 'CB':
      case 'RB': return '#10b981';
      case 'CDM':
      case 'CM':
      case 'CAM': return '#f59e0b';
      case 'LW':
      case 'ST':
      case 'RW': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  // Calculate selected players count
  const selectedPlayersCount = players.length;

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
              <View style={styles.headerLeft}>
                <Users size={24} color="#8b5cf6" />
                <Text style={styles.headerTitle}>Create Team</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {/* Team Name Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={teamName}
                  onChangeText={setTeamName}
                  placeholder="Enter team name..."
                  placeholderTextColor="#9ca3af"
                  maxLength={30}
                />
              </View>

              {/* Player Selection Button */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Players selected: {selectedPlayersCount}</Text>
                
                <TouchableOpacity
                  style={styles.playerSelectorButton}
                  onPress={() => setPlayerSelectorVisible(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.playerSelectorContent}>
                    <View style={styles.playerSelectorLeft}>
                      <Plus size={20} color="#3b82f6" />
                      <Text style={styles.playerSelectorText}>
                        {selectedPlayersCount === 0 ? 'Select players' : `${selectedPlayersCount} players selected`}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#9ca3af" />
                  </View>
                </TouchableOpacity>

                {/* Selected Players Preview */}
                {selectedPlayersCount > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.selectedPlayersPreview}
                    contentContainerStyle={styles.selectedPlayersContent}
                  >
                    {players.map((player) => (
                      <View key={player.id} style={styles.selectedPlayerItem}>
                        <View style={[
                          styles.selectedPlayerAvatar,
                          { backgroundColor: getPositionColor(player.preferredPosition) }
                        ]}>
                          <Text style={styles.selectedPlayerInitials}>{player.initials}</Text>
                        </View>
                        <Text style={styles.selectedPlayerName} numberOfLines={1}>
                          {player.name.split(' ')[0]}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Team Size Selector */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Size</Text>
                <View style={styles.componentWrapper}>
                  <TeamSizeSelector
                    teamSize={teamSize}
                    setTeamSize={setTeamSize}
                    isCustomSize={isCustomSize}
                    setIsCustomSize={setIsCustomSize}
                    customSize={customSize}
                    setCustomSize={setCustomSize}
                  />
                </View>
              </View>

              {/* Tactics Formation */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Formation & Tactics</Text>
                <View style={styles.componentWrapper}>
                  <TacticsMenu
                    teamSize={teamSize}
                    isOpen={isTacticsMenuOpen}
                    setIsOpen={setIsTacticsMenuOpen}
                    selectedFormation={selectedFormation}
                    setSelectedFormation={setSelectedFormation}
                    players={players}
                    setPlayers={setPlayers}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.createButton, !canCreate() && styles.disabledButton]}
                onPress={handleCreateTeam}
                disabled={!canCreate()}
              >
                <Save size={20} color="#ffffff" />
                <Text style={styles.createButtonText}>Create Team</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Player Selector Modal */}
      <PlayerSelectorModal
        visible={playerSelectorVisible}
        onClose={() => setPlayerSelectorVisible(false)}
        players={players}
        onPlayersUpdate={handlePlayersUpdate}
      />
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
    borderColor: 'rgba(139, 92, 246, 0.2)',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 12,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#0f1115',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  playerSelectorButton: {
    backgroundColor: '#0f1115',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 16,
  },
  playerSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  playerSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerSelectorText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
  selectedPlayersPreview: {
    maxHeight: 100,
  },
  selectedPlayersContent: {
    paddingBottom: 8,
  },
  selectedPlayerItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  selectedPlayerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  selectedPlayerInitials: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedPlayerName: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  componentWrapper: {
    backgroundColor: '#0f1115',
    borderRadius: 12,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    gap: 12,
  },
  cancelButton: {
    flex: 0.4,
    backgroundColor: '#4b5563',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  createButton: {
    flex: 0.6,
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: '#6b7280',
    opacity: 0.5,
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});