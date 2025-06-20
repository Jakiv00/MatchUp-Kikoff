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
import { X, Save, Users } from 'lucide-react-native';

// Import existing components
import TeamSizeSelector from '@/components/CreateMatch/TeamSizeSelector';
import TacticsMenu from '@/components/CreateMatch/TacticsMenu';
import PlayerBench from '@/components/CreateMatch/PlayerBench';

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
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: false },
    { id: '2', initials: 'JD', name: 'John Doe', selected: false },
    { id: '3', initials: 'JS', name: 'Jane Smith', selected: false },
    { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: false },
    { id: '5', initials: 'LJ', name: 'LeBron James', selected: false },
    { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: false },
    { id: '7', initials: 'LM', name: 'Lionel Messi', selected: false },
    { id: '8', initials: 'NJ', name: 'Neymar Jr', selected: false },
    { id: '9', initials: 'KM', name: 'Kylian Mbappé', selected: false },
    { id: '10', initials: 'EH', name: 'Erling Haaland', selected: false },
    { id: '11', initials: 'VM', name: 'Virgil van Dijk', selected: false },
    { id: '12', initials: 'KDB', name: 'Kevin De Bruyne', selected: false },
  ]);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setTeamName('');
      setTeamSize(11);
      setIsCustomSize(false);
      setCustomSize('');
      setSelectedFormation(null);
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

  const handleCreateTeam = () => {
    const teamData = {
      name: teamName,
      size: teamSize,
      formation: selectedFormation,
      players: players.filter(p => p.selected || p.position),
    };

    onCreateTeam(teamData);
    onClose();
  };

  const canCreate = () => {
    const selectedCount = players.filter(p => p.selected || p.position).length;
    return teamName.trim().length > 0 && selectedCount >= teamSize;
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

              {/* Player Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Players</Text>
                <View style={styles.componentWrapper}>
                  <PlayerBench
                    players={players}
                    setPlayers={setPlayers}
                    teamSize={teamSize}
                    tacticsMode={false}
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