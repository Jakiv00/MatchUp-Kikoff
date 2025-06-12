import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react-native';

// Import components
import TeamSizeSelector from '@/components/CreateMatch/TeamSizeSelector';
import FieldSelector from '@/components/CreateMatch/FieldSelector';
import DateTimePicker from '@/components/CreateMatch/DateTimePicker';
import TacticsMenu from '@/components/CreateMatch/TacticsMenu';
import PlayerBench from '@/components/CreateMatch/PlayerBench';
import CustomToast from '@/components/CustomToast';

// Types
interface Field {
  id: string;
  name: string;
  distance: string;
  rating: number;
  surface: string;
  capacity: string;
  price: string;
  hasStands: boolean;
}

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

export default function CreateMatchScreen() {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Step 1 - Team Size
  const [teamSize, setTeamSize] = useState(5);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState('');
  
  // Step 2 - Field Selection
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  
  // Step 3 - Date & Time
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Step 4 - Tactics
  const [isTacticsMenuOpen, setIsTacticsMenuOpen] = useState(true);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [tacticMode, setTacticMode] = useState(false);
  
  // Players
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: false },
    { id: '2', initials: 'JD', name: 'John Doe', selected: false },
    { id: '3', initials: 'JS', name: 'Jane Smith', selected: false },
    { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: false },
    { id: '5', initials: 'LJ', name: 'LeBron James', selected: false },
    { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: false },
    { id: '7', initials: 'LM', name: 'Lionel Messi', selected: false },
  ]);
  
  // Save draft or close - Navigate directly to home
  const handleClose = () => {
    // Navigate directly to home screen without showing alert
    router.replace('/(tabs)');
  };
  
  // Alternative close handler with save draft option
  const handleCloseWithSaveOption = () => {
    Alert.alert(
      'Save Draft?',
      'Do you want to save your match as a draft?',
      [
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => router.replace('/(tabs)'),
        },
        {
          text: 'Save Draft',
          onPress: () => {
            // Save draft logic would go here
            console.log('Saving draft...');
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };
  
  // Handle next/previous step
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submit
      createMatch();
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Create match
  const createMatch = () => {
    // Here we would send the data to a backend
    console.log('Creating match with:', {
      teamSize,
      field: selectedField,
      date: selectedDate,
      time: selectedTime,
      formation: selectedFormation,
      players: players.filter(p => p.selected || p.position),
    });

    // Navigate to home and signal to show toast
    router.replace({ pathname: '/(tabs)', params: { showToast: '1' } });
  };
  
  // Check if the current step is valid and we can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return teamSize > 0 && teamSize <= 11;
      case 2:
        return !!selectedField;
      case 3:
        return !!selectedDate && !!selectedTime;
      case 4:
        // Allow proceeding if enough players are selected, regardless of formation assignments
        const selectedCount = players.filter(p => p.selected || p.position).length;
        return selectedCount >= teamSize;
      default:
        return false;
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TeamSizeSelector
            teamSize={teamSize}
            setTeamSize={setTeamSize}
            isCustomSize={isCustomSize}
            setIsCustomSize={setIsCustomSize}
            customSize={customSize}
            setCustomSize={setCustomSize}
          />
        );
      case 2:
        return (
          <FieldSelector
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        );
      case 3:
        return (
          <DateTimePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        );
      case 4:
        return (
          <>
            <TacticsMenu
              teamSize={teamSize}
              isOpen={isTacticsMenuOpen}
              setIsOpen={setIsTacticsMenuOpen}
              selectedFormation={selectedFormation}
              setSelectedFormation={setSelectedFormation}
              players={players}
              setPlayers={setPlayers}
            />
            <PlayerBench
              players={players}
              setPlayers={setPlayers}
              teamSize={teamSize}
              tacticsMode={tacticMode}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goToPreviousStep}
          disabled={currentStep === 1}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={24}
            color={currentStep === 1 ? '#6b7280' : '#ffffff'}
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Match</Text>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              currentStep > index + 1 && styles.completedStep,
              currentStep === index + 1 && styles.activeStep,
            ]}
          />
        ))}
      </View>
      
      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footer}>
        {currentStep === totalSteps ? (
          <TouchableOpacity
            style={[styles.button, styles.createButton, !canProceed() && styles.disabledButton]}
            onPress={createMatch}
            disabled={!canProceed()}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Create Match</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleCloseWithSaveOption}
              activeOpacity={0.7}
            >
              <Save size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Save Draft</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.nextButton, !canProceed() && styles.disabledButton]}
              onPress={goToNextStep}
              disabled={!canProceed()}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Next</Text>
              <ArrowRight size={20} color="#ffffff" />
            </TouchableOpacity>
          </>
        )}
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
  },
  backButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // Fix for Bolt preview - ensure proper touch handling
    ...(typeof window !== 'undefined' && {
      cursor: 'pointer',
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // Fix for Bolt preview - ensure proper touch handling
    ...(typeof window !== 'undefined' && {
      cursor: 'pointer',
    }),
  },
  progressContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1d23',
    justifyContent: 'center',
  },
  progressStep: {
    height: 4,
    width: 60,
    backgroundColor: '#374151',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  completedStep: {
    backgroundColor: '#3b82f6',
  },
  activeStep: {
    backgroundColor: '#60a5fa',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  footer: {
    padding: 16,
    backgroundColor: '#1a1d23',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    // Fix for Bolt preview - ensure proper touch handling
    ...(typeof window !== 'undefined' && {
      cursor: 'pointer',
    }),
  },
  saveButton: {
    backgroundColor: '#4b5563',
    flex: 0.48,
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    flex: 0.48,
  },
  createButton: {
    backgroundColor: '#3b82f6',
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#6b7280',
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginHorizontal: 8,
    // Fix for Bolt preview - prevent text selection
    ...(typeof window !== 'undefined' && {
      userSelect: 'none',
      pointerEvents: 'none',
    }),
  },
});