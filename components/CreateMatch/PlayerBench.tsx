import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { UserPlus, Check, X, User, Plus } from 'lucide-react-native';

interface Player {
  id: string;
  initials: string;
  name: string;
  selected: boolean;
  position?: string;
}

interface PlayerBenchProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  teamSize: number;
  tacticsMode: boolean;
}

// Available players pool (players not currently on the bench)
const availablePlayersPool = [
  { id: 'p13', initials: 'MR', name: 'Marcus Rodriguez', selected: false },
  { id: 'p14', initials: 'SJ', name: 'Sarah Johnson', selected: false },
  { id: 'p15', initials: 'DW', name: 'David Wilson', selected: false },
  { id: 'p16', initials: 'EL', name: 'Emma Lopez', selected: false },
  { id: 'p17', initials: 'RT', name: 'Ryan Thompson', selected: false },
];

export default function PlayerBench({
  players,
  setPlayers,
  teamSize,
  tacticsMode,
}: PlayerBenchProps) {
  const [showAddPlayersModal, setShowAddPlayersModal] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState(availablePlayersPool);

  // Initialize with 12 players if not already present
  React.useEffect(() => {
    if (players.length < 12) {
      const additionalPlayers = Array.from({ length: 12 - players.length }, (_, i) => ({
        id: `${players.length + i + 1}`,
        initials: `P${players.length + i + 1}`,
        name: `Player ${players.length + i + 1}`,
        selected: false
      }));
      setPlayers([...players, ...additionalPlayers]);
    }
  }, []);

  const selectedPlayersCount = players.filter(p => p.selected || p.position).length;
  const maxPlayers = teamSize + 1; // Team size plus optional goalkeeper
  
  const togglePlayerSelection = (playerId: string) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        // If already selected, deselect
        if (player.selected) {
          return { ...player, selected: false, position: undefined };
        }
        
        // If not selected and we haven't reached the limit, select
        if (selectedPlayersCount < maxPlayers) {
          return { ...player, selected: true };
        }
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
  };

  const handleAddPlayer = (newPlayer: Player) => {
    // Remove the last player from the bench
    const updatedPlayers = [...players];
    const lastPlayer = updatedPlayers.pop();
    
    // Add the new player to the beginning
    const playerToAdd = { ...newPlayer, selected: false, position: undefined };
    updatedPlayers.unshift(playerToAdd);
    
    setPlayers(updatedPlayers);
    
    // Update available players list
    const updatedAvailable = availablePlayers.filter(p => p.id !== newPlayer.id);
    if (lastPlayer && !availablePlayers.find(p => p.id === lastPlayer.id)) {
      updatedAvailable.push({
        id: lastPlayer.id,
        initials: lastPlayer.initials,
        name: lastPlayer.name,
        selected: false
      });
    }
    setAvailablePlayers(updatedAvailable);
    
    setShowAddPlayersModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Players</Text>
      <Text style={styles.subtitle}>
        {selectedPlayersCount}/{maxPlayers} players selected
        {selectedPlayersCount < teamSize && (
          <Text style={styles.hint}> (Need {teamSize - selectedPlayersCount} more field players)</Text>
        )}
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.benchContainer}
        contentContainerStyle={styles.benchContentContainer}
      >
        {players.map((player) => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerCircle,
              player.selected && styles.selectedPlayerCircle,
              player.position && styles.positionedPlayerCircle,
              player.position === 'GK' && styles.goalkeeperCircle
            ]}
            onPress={() => togglePlayerSelection(player.id)}
            disabled={tacticsMode}
          >
            <Text style={styles.playerInitials}>{player.initials}</Text>
            {player.selected && !player.position && (
              <View style={styles.checkIcon}>
                <Check size={12} color="#ffffff" />
              </View>
            )}
            {player.position && (
              <View style={[
                styles.positionBadge,
                player.position === 'GK' && styles.goalkeeperBadge
              ]}>
                <Text style={styles.positionText}>{player.position}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        
        {/* Add Players Button */}
        <TouchableOpacity
          style={styles.addPlayerButton}
          onPress={() => setShowAddPlayersModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.addPlayerIconContainer}>
            <User size={20} color="#3b82f6" />
            <View style={styles.plusIconOverlay}>
              <Plus size={14} color="#3b82f6" />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Players Modal */}
      <Modal
        visible={showAddPlayersModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddPlayersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Player to Bench</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddPlayersModal(false)}
              >
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.playersList}>
              {availablePlayers.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerListItem}
                  onPress={() => handleAddPlayer(player)}
                  activeOpacity={0.7}
                >
                  <View style={styles.playerAvatar}>
                    <Text style={styles.playerAvatarText}>{player.initials}</Text>
                  </View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <UserPlus size={20} color="#3b82f6" />
                </TouchableOpacity>
              ))}
              
              {availablePlayers.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No available players</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  hint: {
    color: '#f59e0b',
    fontSize: 14,
  },
  benchContainer: {
    maxHeight: 100,
  },
  benchContentContainer: {
    paddingBottom: 16,
  },
  playerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16,
  },
  selectedPlayerCircle: {
    backgroundColor: '#3b82f6',
  },
  positionedPlayerCircle: {
    backgroundColor: '#10b981',
  },
  goalkeeperCircle: {
    backgroundColor: '#6366f1',
  },
  playerInitials: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionBadge: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 1,
  },
  goalkeeperBadge: {
    backgroundColor: '#4f46e5',
  },
  positionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  addPlayerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16,
  },
  addPlayerIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIconOverlay: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
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
  playersList: {
    maxHeight: 300,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  playerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});