import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { UserPlus, Check } from 'lucide-react-native';

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

export default function PlayerBench({
  players,
  setPlayers,
  teamSize,
  tacticsMode,
}: PlayerBenchProps) {
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
      </ScrollView>
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
    maxHeight: 100, // Increased height to accommodate badges
  },
  benchContentContainer: {
    paddingBottom: 16, // Add padding to ensure badges are visible
  },
  playerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16, // Add margin to accommodate badge
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
  }
});