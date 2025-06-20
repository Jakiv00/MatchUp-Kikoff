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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { X, Search, Check, Users } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Player {
  id: string;
  initials: string;
  name: string;
  selected: boolean;
  position?: string;
  preferredPosition: string;
}

interface PlayerSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  players: Player[];
  onPlayersUpdate: (players: Player[]) => void;
}

// Extended player data with preferred positions
const allPlayers: Player[] = [
  { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: false, preferredPosition: 'ST' },
  { id: '2', initials: 'JD', name: 'John Doe', selected: false, preferredPosition: 'GK' },
  { id: '3', initials: 'JS', name: 'Jane Smith', selected: false, preferredPosition: 'CB' },
  { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: false, preferredPosition: 'CM' },
  { id: '5', initials: 'LJ', name: 'LeBron James', selected: false, preferredPosition: 'LW' },
  { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: false, preferredPosition: 'ST' },
  { id: '7', initials: 'LM', name: 'Lionel Messi', selected: false, preferredPosition: 'RW' },
  { id: '8', initials: 'NJ', name: 'Neymar Jr', selected: false, preferredPosition: 'LW' },
  { id: '9', initials: 'KM', name: 'Kylian Mbappé', selected: false, preferredPosition: 'ST' },
  { id: '10', initials: 'EH', name: 'Erling Haaland', selected: false, preferredPosition: 'ST' },
  { id: '11', initials: 'VM', name: 'Virgil van Dijk', selected: false, preferredPosition: 'CB' },
  { id: '12', initials: 'KDB', name: 'Kevin De Bruyne', selected: false, preferredPosition: 'CM' },
  { id: '13', initials: 'MR', name: 'Marcus Rodriguez', selected: false, preferredPosition: 'LB' },
  { id: '14', initials: 'SJ', name: 'Sarah Johnson', selected: false, preferredPosition: 'RB' },
  { id: '15', initials: 'DW', name: 'David Wilson', selected: false, preferredPosition: 'CDM' },
  { id: '16', initials: 'EL', name: 'Emma Lopez', selected: false, preferredPosition: 'CAM' },
  { id: '17', initials: 'RT', name: 'Ryan Thompson', selected: false, preferredPosition: 'GK' },
  { id: '18', initials: 'AL', name: 'Alex Lee', selected: false, preferredPosition: 'CB' },
  { id: '19', initials: 'MG', name: 'Maria Garcia', selected: false, preferredPosition: 'CM' },
  { id: '20', initials: 'JW', name: 'James Wilson', selected: false, preferredPosition: 'RW' },
];

export default function PlayerSelectorModal({ 
  visible, 
  onClose, 
  players, 
  onPlayersUpdate 
}: PlayerSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Initialize local players with current selection state
  useEffect(() => {
    if (visible) {
      const updatedPlayers = allPlayers.map(player => {
        const existingPlayer = players.find(p => p.id === player.id);
        return {
          ...player,
          selected: existingPlayer?.selected || false,
          position: existingPlayer?.position,
        };
      });
      setLocalPlayers(updatedPlayers);
      setSearchQuery('');
      
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
  }, [visible, players]);

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

  // Filter players based on search query
  const filteredPlayers = localPlayers.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.preferredPosition.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const togglePlayerSelection = (playerId: string) => {
    setLocalPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, selected: !player.selected }
          : player
      )
    );
  };

  const handleSave = () => {
    // Update the parent component with selected players
    const selectedPlayers = localPlayers.filter(p => p.selected);
    onPlayersUpdate(selectedPlayers);
    onClose();
  };

  const selectedCount = localPlayers.filter(p => p.selected).length;

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
                <Users size={24} color="#3b82f6" />
                <Text style={styles.headerTitle}>Select Players</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color="#9ca3af" />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search players or positions..."
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <Text style={styles.selectedCount}>
                {selectedCount} selected
              </Text>
            </View>

            {/* Players List */}
            <ScrollView 
              style={styles.playersList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.playersContent}
            >
              {filteredPlayers.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={[
                    styles.playerItem,
                    player.selected && styles.selectedPlayerItem
                  ]}
                  onPress={() => togglePlayerSelection(player.id)}
                  activeOpacity={0.7}
                >
                  {/* Player Avatar */}
                  <View style={[
                    styles.playerAvatar,
                    { backgroundColor: getPositionColor(player.preferredPosition) }
                  ]}>
                    <Text style={styles.playerInitials}>{player.initials}</Text>
                  </View>

                  {/* Player Info */}
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerPosition}>
                      Preferred: {player.preferredPosition}
                    </Text>
                  </View>

                  {/* Position Badge */}
                  <View style={[
                    styles.positionBadge,
                    { backgroundColor: getPositionColor(player.preferredPosition) }
                  ]}>
                    <Text style={styles.positionText}>{player.preferredPosition}</Text>
                  </View>

                  {/* Selection Indicator */}
                  <View style={[
                    styles.selectionIndicator,
                    player.selected && styles.selectedIndicator
                  ]}>
                    {player.selected && (
                      <Check size={16} color="#ffffff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {filteredPlayers.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No players found matching "{searchQuery}"
                  </Text>
                </View>
              )}
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
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  Save ({selectedCount})
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1115',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
    textAlign: 'center',
  },
  playersList: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  playersContent: {
    paddingVertical: 8,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  selectedPlayerItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  playerInitials: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  playerInfo: {
    flex: 1,
    marginRight: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 14,
    color: '#9ca3af',
  },
  positionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  positionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
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
  saveButton: {
    flex: 0.6,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});