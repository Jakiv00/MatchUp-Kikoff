import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

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

interface TacticsMenuProps {
  teamSize: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedFormation: Formation | null;
  setSelectedFormation: (formation: Formation | null) => void;
}

export default function TacticsMenu({
  teamSize,
  isOpen,
  setIsOpen,
  selectedFormation,
  setSelectedFormation,
}: TacticsMenuProps) {
  const [tacticMode, setTacticMode] = useState(false); // false = tap to assign, true = drag & drop
  
  // Generate formations based on team size
  const getFormationsByTeamSize = () => {
    switch (teamSize) {
      case 5:
        return [
          {
            id: '5-1',
            name: '3-1-1',
            positions: [
              { id: 'gk', name: 'GK', x: 50, y: 90, filled: false },
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'cb', name: 'CB', x: 50, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'cm', name: 'CM', x: 50, y: 50, filled: false },
              { id: 'st', name: 'ST', x: 50, y: 30, filled: false },
            ]
          },
          {
            id: '5-2',
            name: '2-2-1',
            positions: [
              { id: 'gk', name: 'GK', x: 50, y: 90, filled: false },
              { id: 'lb', name: 'LB', x: 30, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 70, y: 70, filled: false },
              { id: 'lm', name: 'LM', x: 30, y: 50, filled: false },
              { id: 'rm', name: 'RM', x: 70, y: 50, filled: false },
              { id: 'st', name: 'ST', x: 50, y: 30, filled: false },
            ]
          },
        ];
      case 7:
        return [
          {
            id: '7-1',
            name: '3-2-2',
            positions: [
              { id: 'gk', name: 'GK', x: 50, y: 90, filled: false },
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'cb', name: 'CB', x: 50, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'lm', name: 'LM', x: 30, y: 50, filled: false },
              { id: 'rm', name: 'RM', x: 70, y: 50, filled: false },
              { id: 'ls', name: 'LS', x: 35, y: 30, filled: false },
              { id: 'rs', name: 'RS', x: 65, y: 30, filled: false },
            ]
          },
          {
            id: '7-2',
            name: '4-2-1',
            positions: [
              { id: 'gk', name: 'GK', x: 50, y: 90, filled: false },
              { id: 'lb', name: 'LB', x: 20, y: 70, filled: false },
              { id: 'lcb', name: 'LCB', x: 40, y: 70, filled: false },
              { id: 'rcb', name: 'RCB', x: 60, y: 70, filled: false },
              { id: 'rb', name: 'RB', x: 80, y: 70, filled: false },
              { id: 'lm', name: 'LM', x: 30, y: 50, filled: false },
              { id: 'rm', name: 'RM', x: 70, y: 50, filled: false },
              { id: 'st', name: 'ST', x: 50, y: 30, filled: false },
            ]
          },
        ];
      case 11:
        return [
          {
            id: '11-1',
            name: '4-4-2',
            positions: [
              { id: 'gk', name: 'GK', x: 50, y: 90, filled: false },
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
            ]
          },
          {
            id: '11-2',
            name: '4-3-3',
            positions: [
              { id: 'gk', name: 'GK', x: 50, y: 90, filled: false },
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
            ]
          },
        ];
      default:
        return [];
    }
  };
  
  const availableFormations = getFormationsByTeamSize();
  
  // Select a formation
  const handleFormationSelect = (formation: Formation) => {
    setSelectedFormation(formation);
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
          {/* Formation Selection */}
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
          
          {/* Soccer Field */}
          {selectedFormation && (
            <>
              <View style={styles.soccerField}>
                {/* Field markings */}
                <View style={styles.fieldCenter}>
                  <View style={styles.centerCircle} />
                </View>
                <View style={styles.goalArea1} />
                <View style={styles.goalArea2} />
                
                {/* Positions */}
                {selectedFormation.positions.map((position) => (
                  <TouchableOpacity
                    key={position.id}
                    style={[
                      styles.positionCircle,
                      {
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                      },
                      position.filled && styles.filledPositionCircle
                    ]}
                  >
                    <Text style={styles.positionText}>{position.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Mode Toggle */}
              <View style={styles.modeToggleContainer}>
                <Text style={styles.modeLabel}>Tactic Mode:</Text>
                <View style={styles.toggleSwitchContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleOption,
                      !tacticMode && styles.activeToggleOption
                    ]}
                    onPress={() => setTacticMode(false)}
                  >
                    <Text
                      style={[
                        styles.toggleOptionText,
                        !tacticMode && styles.activeToggleOptionText
                      ]}
                    >
                      Tap to Assign
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.toggleOption,
                      tacticMode && styles.activeToggleOption
                    ]}
                    onPress={() => setTacticMode(true)}
                  >
                    <Text
                      style={[
                        styles.toggleOptionText,
                        tacticMode && styles.activeToggleOptionText
                      ]}
                    >
                      Drag & Drop
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  filledPositionCircle: {
    backgroundColor: '#3b82f6',
  },
  positionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modeLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  toggleSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#0f1115',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeToggleOption: {
    backgroundColor: '#3b82f6',
  },
  toggleOptionText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  activeToggleOptionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});