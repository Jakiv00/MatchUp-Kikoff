import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { UserPlus, Check } from 'lucide-react-native';

interface Player {
  id: string;
  initials: string;
  name: string;
  selected: boolean;
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
  const [selectedPlayersCount, setSelectedPlayersCount] = useState(0);
  
  const togglePlayerSelection = (playerId: string) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        // If already selected, deselect
        if (player.selected) {
          return { ...player, selected: false };
        }
        
        // If not selected and we haven't reached the limit, select
        if (selectedPlayersCount < teamSize) {
          return { ...player, selected: true };
        }
      }
      return player;
    });
    
    const newSelectedCount = updatedPlayers.filter(p => p.selected).length;
    setSelectedPlayersCount(newSelectedCount);
    setPlayers(updatedPlayers);
  };
  
  const addNewPlayer = () => {
    // This would typically open a modal to add a friend
    console.log('Add new player');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Players</Text>
      <Text style={styles.subtitle}>
        {selectedPlayersCount}/{teamSize} players selected
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.benchContainer}
      >
        {players.map((player) => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerCircle,
              player.selected && styles.selectedPlayerCircle
            ]}
            onPress={() => togglePlayerSelection(player.id)}
            disabled={tacticsMode}
          >
            <Text style={styles.playerInitials}>{player.initials}</Text>
            {player.selected && (
              <View style={styles.checkIcon}>
                <Check size={12} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.addPlayerButton}
          onPress={addNewPlayer}
        >
          <UserPlus size={24} color="#3b82f6" />
        </TouchableOpacity>
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
  benchContainer: {
    maxHeight: 80,
  },
  playerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedPlayerCircle: {
    backgroundColor: '#3b82f6',
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
  addPlayerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
  },
});