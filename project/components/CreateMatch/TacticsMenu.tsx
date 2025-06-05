import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
  filled: boolean;
  playerId?: string;
  isGoalkeeper?: boolean;
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

interface TacticsMenuProps {
  teamSize: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedFormation: Formation | null;
  setSelectedFormation: (formation: Formation | null) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

export default function TacticsMenu({
  teamSize,
  isOpen,
  setIsOpen,
  selectedFormation,
  setSelectedFormation,
  players,
  setPlayers,
}: TacticsMenuProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const getFormationsByTeamSize = () => {
    const addGoalkeeper = (positions: Position[]): Position[] => {
      return [
        { id: 'gk', name: 'GK', x: 50, y: 95, filled: false, isGoalkeeper: true },
        ...positions
      ];
    };

    switch (teamSize) {
      case 5:
        return [
          {
            id: '5-1',
            name: '3-1-1',
            positions: addGoalkeeper([
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'cb', name: 'CB', x: 50, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'cm', name: 'CM', x: 50, y: 50, filled: false },
              { id: 'st', name: 'ST', x: 50, y: 30, filled: false },
            ])
          },
          {
            id: '5-2',
            name: '2-2-1',
            positions: addGoalkeeper([
              { id: 'lb', name: 'LB', x: 30, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 70, y: 70, filled: false },
              { id: 'lm', name: 'LM', x: 30, y: 50, filled: false },
              { id: 'rm', name: 'RM', x: 70, y: 50, filled: false },
              { id: 'st', name: 'ST', x: 50, y: 30, filled: false },
            ])
          },
        ];
      case 7:
        return [
          {
            id: '7-1',
            name: '3-2-2',
            positions: addGoalkeeper([
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'cb', name: 'CB', x: 50, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'lm', name: 'LM', x: 30, y: 50, filled: false },
              { id: 'rm', name: 'RM', x: 70, y: 50, filled: false },
              { id: 'ls', name: 'LS', x: 35, y: 30, filled: false },
              { id: 'rs', name: 'RS', x: 65, y: 30, filled: false },
            ])
          },
          {
            id: '7-2',
            name: '4-2-1',
            positions: addGoalkeeper([
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'lcb', name: 'LCB', x: 40, y: 70, filled: false },
              { id: 'rcb', name: 'RCB', x: 60, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'lm', name: 'LM', x: 30, y: 50, filled: false },
              { id: 'rm', name: 'RM', x: 70, y: 50, filled: false },
              { id: 'st', name: 'ST', x: 50, y: 30, filled: false },
            ])
          },
        ];
      case 11:
        return [
          {
            id: '11-1',
            name: '4-4-2',
            positions: addGoalkeeper([
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'lcb', name: 'LCB', x: 40, y: 70, filled: false },
              { id: 'rcb', name: 'RCB', x: 60, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'lm', name: 'LM', x: 20, y: 50, filled: false },
              { id: 'lcm', name: 'LCM', x: 40, y: 50, filled: false },
              { id: 'rcm', name: 'RCM', x: 60, y: 50, filled: false },
              { id: 'rm', name: 'RM', x: 80, y: 50, filled: false },
              { id: 'ls', name: 'LS', x: 35, y: 30, filled: false },
              { id: 'rs', name: 'RS', x: 65, y: 30, filled: false },
            ])
          },
          {
            id: '11-2',
            name: '4-3-3',
            positions: addGoalkeeper([
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'lcb', name: 'LCB', x: 40, y: 70, filled: false },
              { id: 'rcb', name: 'RCB', x: 60, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'cdm', name: 'CDM', x: 50, y: 55, filled: false },
              { id: 'lcm', name: 'LCM', x: 30, y: 45, filled: false },
              { id: 'rcm', name: 'RCM', x: 70, y: 45, filled: false },
              { id: 'lw', name: 'LW', x: 20, y: 30, filled: false },
              { id: 'st', name: 'ST', x: 50, y: 25, filled: false },
              { id: 'rw', name: 'RW', x: 80, y: 30, filled: false },
            ])
          },
        ];
      default:
        return [];
    }
  };
  
  const availableFormations = getFormationsByTeamSize();
  
  const handleFormationSelect = (formation: Formation) => {
    setSelectedFormation(formation);
    setPlayers(players.map(p => ({ ...p, position: undefined })));
  };

  const handlePositionSelect = (position: Position) => {
    const assignedPlayer = players.find(p => p.position === position.name);
    
    if (selectedPlayer?.position) {
      // If a positioned player is selected, swap positions
      const currentPosition = selectedPlayer.position;
      setPlayers(players.map(p => {
        if (p.id === selectedPlayer.id) {
          return { ...p, position: position.name };
        }
        if (p.position === position.name) {
          return { ...p, position: currentPosition };
        }
        return p;
      }));
      setSelectedPlayer(null);
    } else if (assignedPlayer) {
      // If clicking an assigned player, select them for movement
      setSelectedPlayer(assignedPlayer);
    } else if (selectedPlayer && !selectedPlayer.position) {
      // Assign selected player to empty position
      setPlayers(players.map(p => ({
        ...p,
        position: p.id === selectedPlayer.id ? position.name : p.position
      })));
      setSelectedPlayer(null);
    }
  };

  const handleAvailableAreaClick = () => {
    if (selectedPlayer?.position) {
      setPlayers(players.map(p => 
        p.id === selectedPlayer.id ? { ...p, position: undefined } : p
      ));
      setSelectedPlayer(null);
    }
  };

  const handleAvailablePlayerSelect = (player: Player) => {
    if (!player.position) {
      setSelectedPlayer(player);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.toggleButtonText}>
          Tactics Menu {isOpen ? '(Hide)' : '(Show)'}
        </Text>
        {isOpen ? (
          <ChevronUp size={20} color="#ffffff" />
        ) : (
          <ChevronDown size={20} color="#ffffff" />
        )}
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.tacticsContainer}>
          <Text style={styles.sectionTitle}>Formation</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.formationsContainer}
          >
            {availableFormations.map((formation) => (
              <TouchableOpacity
                key={formation.id}
                style={[
                  styles.formationButton,
                  selectedFormation?.id === formation.id && styles.selectedFormationButton
                ]}
                onPress={() => handleFormationSelect(formation)}
              >
                <Text
                  style={[
                    styles.formationButtonText,
                    selectedFormation?.id === formation.id && styles.selectedFormationButtonText
                  ]}
                >
                  {formation.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {selectedFormation && (
            <>
              <View style={styles.soccerField}>
                <View style={styles.fieldCenter}>
                  <View style={styles.centerCircle} />
                </View>
                <View style={styles.goalArea1} />
                <View style={styles.goalArea2} />
                
                {selectedFormation.positions.map((position) => {
                  const assignedPlayer = players.find(p => p.position === position.name);
                  
                  return (
                    <TouchableOpacity
                      key={position.id}
                      style={[
                        styles.positionCircle,
                        {
                          left: `${position.x}%`,
                          top: `${position.y}%`,
                        },
                        !assignedPlayer && styles.emptyPositionCircle,
                        assignedPlayer && styles.filledPositionCircle,
                        assignedPlayer?.id === selectedPlayer?.id && styles.selectedPositionCircle,
                        position.isGoalkeeper && styles.goalkeeperPosition
                      ]}
                      onPress={() => handlePositionSelect(position)}
                    >
                      <View style={[
                        styles.positionInner,
                        position.isGoalkeeper && !assignedPlayer && styles.goalkeeperInner
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
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              <TouchableOpacity
                style={styles.availablePlayersArea}
                onPress={handleAvailableAreaClick}
                activeOpacity={selectedPlayer?.position ? 0.7 : 1}
              >
                <Text style={styles.availablePlayersTitle}>
                  {selectedPlayer?.position 
                    ? 'Tap here to deassign selected player'
                    : 'Available Players'
                  }
                </Text>
                
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.availablePlayersList}
                >
                  {players.filter(p => p.selected && !p.position).map((player) => (
                    <TouchableOpacity
                      key={player.id}
                      style={[
                        styles.availablePlayerCircle,
                        player.id === selectedPlayer?.id && !selectedPlayer.position && styles.selectedAvailablePlayer
                      ]}
                      onPress={() => handleAvailablePlayerSelect(player)}
                    >
                      <Text style={styles.playerInitials}>{player.initials}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1d23',
    padding: 12,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  tacticsContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  formationsContainer: {
    marginBottom: 20,
  },
  formationButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  selectedFormationButton: {
    backgroundColor: '#3b82f6',
  },
  formationButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedFormationButtonText: {
    fontWeight: '700',
  },
  soccerField: {
    width: '100%',
    height: 300,
    backgroundColor: '#1f2a2f',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    top: -25,
    left: '50%',
    marginLeft: -25,
  },
  goalArea1: {
    position: 'absolute',
    width: 100,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 0,
    top: 0,
    left: '50%',
    marginLeft: -50,
  },
  goalArea2: {
    position: 'absolute',
    width: 100,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopWidth: 0,
    bottom: 0,
    left: '50%',
    marginLeft: -50,
  },
  positionCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -22 }, { translateY: -22 }],
  },
  positionInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPositionCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
  },
  filledPositionCircle: {
    backgroundColor: '#3b82f6',
  },
  selectedPositionCircle: {
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderStyle: 'solid',
  },
  goalkeeperPosition: {
    width: 48,
    height: 48,
    borderRadius: 24,
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  goalkeeperInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
  },
  goalkeeperText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  positionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  playerInitials: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  availablePlayersArea: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#1f2937',
    borderRadius: 8,
  },
  availablePlayersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  availablePlayersList: {
    maxHeight: 80,
  },
  availablePlayerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedAvailablePlayer: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});