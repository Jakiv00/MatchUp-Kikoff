import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
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
import { X, Users } from 'lucide-react-native';
import TeamSizeSelector from '@/components/CreateMatch/TeamSizeSelector';
import TacticsMenu from '@/components/CreateMatch/TacticsMenu';
import PlayerBench from '@/components/CreateMatch/PlayerBench';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Player {
  id: string;
  initials: string;
  name: string;
  selected: boolean;
  position?: string;
}

interface Formation {
  id: string;
  name: string;
  positions: Position[];
}

interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
  filled: boolean;
  playerId?: string;
  isGoalkeeper?: boolean;
}

interface CreateTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (teamData: any) => void;
}

export default function CreateTeamModal({ visible, onClose, onSubmit }: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(5);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [isTacticsMenuOpen, setIsTacticsMenuOpen] = useState(true);
  
  // Players state
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: false },
    { id: '2', initials: 'JD', name: 'John Doe', selected: false },
    { id: '3', initials: 'JS', name: 'Jane Smith', selected: false },
    { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: false },
    { id: '5', initials: 'LJ', name: 'LeBron James', selected: false },
    { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: false },
    { id: '7', initials: 'LM', name: 'Lionel Messi', selected: false },
    { id: '8', initials: 'NJ', name: 'Neymar Jr', selected: false },
    { id: '9', initials: 'KM', name: 'Kylian Mbappe', selected: false },
    { id: '10', initials: 'EH', name: 'Erling Haaland', selected: false },
  ]);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Reset form when modal opens
      setTeamName('');
      setTeamSize(5);
      setIsCustomSize(false);
      setCustomSize('');
      setSelectedFormation(null);
      setIsTacticsMenuOpen(true);
      setPlayers(prev => prev.map(p => ({ ...p, selected: false, position: undefined })));
      
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

  const handleSubmit = () => {
    const selectedPlayersCount = players.filter(p => p.selected || p.position).length;
    
    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    if (selectedPlayersCount < teamSize) {
      alert(`Please select at least ${teamSize} players for your team`);
      return;
    }

    const teamData = {
      name: teamName.trim(),
      size: teamSize,
      formation: selectedFormation,
      players: players.filter(p => p.selected || p.position),
      createdAt: new Date().toISOString(),
    };

    onSubmit(teamData);
  };

  const canSubmit = () => {
    const selectedPlayersCount = players.filter(p => p.selected || p.position).length;
    return teamName.trim().length > 0 && selectedPlayersCount >= teamSize;
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
              <Text style={styles.headerTitle}>Create a team</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {/* Team Name Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Name</Text>
                <TextInput
                  style={styles.teamNameInput}
                  value={teamName}
                  onChangeText={setTeamName}
                  placeholder="Enter team name"
                  placeholderTextColor="#9ca3af"
                  maxLength={30}
                />
              </View>

              {/* Team Size Selector */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Size (max 11)</Text>
                <TeamSizeSelector
                  teamSize={teamSize}
                  setTeamSize={setTeamSize}
                  isCustomSize={isCustomSize}
                  setIsCustomSize={setIsCustomSize}
                  customSize={customSize}
                  setCustomSize={setCustomSize}
                />
              </View>

              {/* Player Selection */}
              <View style={styles.section}>
                <View style={styles.playerSectionHeader}>
                  <Users size={20} color="#3b82f6" />
                  <Text style={styles.sectionTitle}>Player adding</Text>
                </View>
                <PlayerBench
                  players={players}
                  setPlayers={setPlayers}
                  teamSize={teamSize}
                  tacticsMode={false}
                />
              </View>

              {/* Formation */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Formation</Text>
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

              {/* Players Status */}
              <View style={styles.playersStatus}>
                <Text style={styles.playersStatusText}>
                  {players.filter(p => p.selected || p.position).length}/{teamSize} players selected
                </Text>
                {players.filter(p => p.selected || p.position).length < teamSize && (
                  <Text style={styles.playersStatusHint}>
                    (Need {teamSize - players.filter(p => p.selected || p.position).length} more field players)
                  </Text>
                )}
              </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  canSubmit() && styles.submitButtonActive
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit()}
              >
                <Text style={[
                  styles.submitButtonText,
                  canSubmit() && styles.submitButtonTextActive
                ]}>
                  Save team
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
    maxHeight: SCREEN_HEIGHT * 0.65,
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
    marginBottom: 12,
  },
  teamNameInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  playerSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playersStatus: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: 'center',
  },
  playersStatusText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  playersStatusHint: {
    fontSize: 12,
    color: '#f59e0b',
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
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