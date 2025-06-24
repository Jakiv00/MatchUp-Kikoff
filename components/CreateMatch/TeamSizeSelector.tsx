import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Users, Shield } from 'lucide-react-native';

interface TeamSizeSelectorProps {
  teamSize: number;
  setTeamSize: (size: number) => void;
  isCustomSize: boolean;
  setIsCustomSize: (isCustom: boolean) => void;
  customSize: string;
  setCustomSize: (size: string) => void;
  showTeamSelection?: boolean; // New prop to control team selection visibility
}

export default function TeamSizeSelector({
  teamSize,
  setTeamSize,
  isCustomSize,
  setIsCustomSize,
  customSize,
  setCustomSize,
  showTeamSelection = false // Default to false (hidden)
}: TeamSizeSelectorProps) {
  
  const handleSizeSelection = (size: number) => {
    setTeamSize(size);
    setIsCustomSize(false);
  };
  
  const handleCustomSize = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setCustomSize('');
      return;
    }
    
    const size = parseInt(numericValue, 10);
    
    // Limit to maximum of 11 players per team
    if (size > 11) {
      setCustomSize('11');
      setTeamSize(11);
    } else {
      setCustomSize(numericValue);
      setTeamSize(size);
    }
  };
  
  const handleCustomPress = () => {
    setIsCustomSize(true);
    setCustomSize(teamSize.toString());
  };

  const handleYourTeamPress = () => {
    // Handle your team selection
    console.log('Your team pressed');
  };

  const handleOpposingTeamPress = () => {
    // Handle opposing team selection
    console.log('Opposing team pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Team Size</Text>
      <Text style={styles.subtitle}>How many players on each team?</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.sizeButton,
            teamSize === 5 && !isCustomSize && styles.selectedButton
          ]}
          onPress={() => handleSizeSelection(5)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            teamSize === 5 && !isCustomSize && styles.selectedButtonText
          ]}>5v5</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sizeButton,
            teamSize === 7 && !isCustomSize && styles.selectedButton
          ]}
          onPress={() => handleSizeSelection(7)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            teamSize === 7 && !isCustomSize && styles.selectedButtonText
          ]}>7v7</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sizeButton,
            teamSize === 11 && !isCustomSize && styles.selectedButton
          ]}
          onPress={() => handleSizeSelection(11)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            teamSize === 11 && !isCustomSize && styles.selectedButtonText
          ]}>11v11</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sizeButton,
            isCustomSize && styles.selectedButton
          ]}
          onPress={handleCustomPress}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            isCustomSize && styles.selectedButtonText
          ]}>Custom</Text>
        </TouchableOpacity>
      </View>
      
      {isCustomSize && (
        <View style={styles.customSizeContainer}>
          <Text style={styles.customSizeLabel}>Players per team (max 11):</Text>
          <TextInput
            style={styles.customSizeInput}
            value={customSize}
            onChangeText={handleCustomSize}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="1-11"
            placeholderTextColor="#9ca3af"
          />
          <Text style={styles.formatText}>{customSize}v{customSize}</Text>
        </View>
      )}

      {/* Team Selection Buttons - Only show when showTeamSelection is true */}
      {showTeamSelection && (
        <View style={styles.teamSelectionContainer}>
          {/* Fast Track Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.fastTrackNote}>Fast track</Text>
          </View>
          
          <TouchableOpacity
            style={styles.teamButton}
            onPress={handleYourTeamPress}
            activeOpacity={0.7}
          >
            <View style={styles.teamButtonContent}>
              <Users size={20} color="#3b82f6" />
              <Text style={styles.teamButtonText}>Your Team</Text>
            </View>
          </TouchableOpacity>
          
          {/* VS Text */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>vs</Text>
          </View>
          
          <TouchableOpacity
            style={styles.teamButton}
            onPress={handleOpposingTeamPress}
            activeOpacity={0.7}
          >
            <View style={styles.teamButtonContent}>
              <Shield size={20} color="#ef4444" />
              <Text style={styles.teamButtonText}>Opposing Team</Text>
            </View>
          </TouchableOpacity>
          
          {/* Invite Later Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.inviteLaterNote}>You can invite later</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sizeButton: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingVertical: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    // Fix for Bolt preview - ensure proper touch handling
    ...(typeof window !== 'undefined' && {
      cursor: 'pointer',
    }),
  },
  selectedButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    // Fix for Bolt preview - prevent text selection
    ...(typeof window !== 'undefined' && {
      userSelect: 'none',
      pointerEvents: 'none',
    }),
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  customSizeContainer: {
    marginTop: 8,
    backgroundColor: '#1a1d23',
    padding: 16,
    borderRadius: 8,
  },
  customSizeLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  customSizeInput: {
    backgroundColor: '#374151',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  formatText: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
  },
  teamSelectionContainer: {
    marginTop: 24,
    gap: 12,
  },
  noteContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  fastTrackNote: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  inviteLaterNote: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  teamButton: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  teamButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  teamButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  vsText: {
    color: '#9ca3af',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});