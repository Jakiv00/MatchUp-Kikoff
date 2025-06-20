import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, X, Save } from 'lucide-react-native';

// Import existing components from create match
import TeamSizeSelector from '@/components/CreateMatch/TeamSizeSelector';
import TacticsMenu from '@/components/CreateMatch/TacticsMenu';
import PlayerBench from '@/components/CreateMatch/PlayerBench';

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

export default function CreateTeamScreen() {
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

  const handleClose = () => {
    router.back();
  };

  const handleCreateTeam = () => {
    // Here we would send the data to a backend
    console.log('Creating team with:', {
      teamName,
      teamSize,
      formation: selectedFormation,
      players: players.filter(p => p.selected || p.position),
    });

    // Navigate back to teams screen
    router.back();
  };

  const canCreate = () => {
    const selectedCount = players.filter(p => p.selected || p.position).length;
    return teamName.trim().length > 0 && selectedCount >= teamSize;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleClose}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Team</Text>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
        >
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Team Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Name</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPlaceholder}>Enter team name...</Text>
          </View>
        </View>

        {/* Team Size Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Size</Text>
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
          <Text style={styles.sectionTitle}>Select Players</Text>
          <PlayerBench
            players={players}
            setPlayers={setPlayers}
            teamSize={teamSize}
            tacticsMode={false}
          />
        </View>

        {/* Tactics Formation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formation & Tactics</Text>
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
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleClose}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#1a1d23',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputPlaceholder: {
    color: '#9ca3af',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1d23',
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