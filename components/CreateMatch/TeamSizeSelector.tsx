import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Users, Shield } from 'lucide-react-native';
import OpposingTeamModal from './OpposingTeamModal';
import YourTeamModal from './YourTeamModal';

interface TeamSizeSelectorProps {
  teamSize: number;
  setTeamSize: (size: number) => void;
  isCustomSize: boolean;
  setIsCustomSize: (isCustom: boolean) => void;
  customSize: string;
  setCustomSize: (size: string) => void;
  showTeamSelection?: boolean; // New prop to control team selection visibility
  onTeamDataUpdate?: (teamData: any) => void; // Callback for team data updates
}

interface SelectedTeam {
  id: string;
  name: string;
  avatar: string;
  color: string;
  teamSize?: number;
  formation?: any;
  players?: any[];
}

export default function TeamSizeSelector({
  teamSize,
  setTeamSize,
  isCustomSize,
  setIsCustomSize,
  customSize,
  setCustomSize,
  showTeamSelection = false, // Default to false (hidden)
  onTeamDataUpdate
}: TeamSizeSelectorProps) {
  
  const [selectedYourTeam, setSelectedYourTeam] = useState<SelectedTeam | null>(null);
  const [selectedOpposingTeam, setSelectedOpposingTeam] = useState<SelectedTeam | null>(null);
  const [yourTeamModalVisible, setYourTeamModalVisible] = useState(false);
  const [opposingTeamModalVisible, setOpposingTeamModalVisible] = useState(false);
  
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
    setYourTeamModalVisible(true);
  };

  const handleOpposingTeamPress = () => {
    setOpposingTeamModalVisible(true);
  };

  const handleYourTeamSelect = (team: SelectedTeam) => {
    setSelectedYourTeam(team);
    setYourTeamModalVisible(false);
    
    // Autofill team data
    if (team.teamSize) {
      setTeamSize(team.teamSize);
      setIsCustomSize(![5, 7, 11].includes(team.teamSize));
      if (![5, 7, 11].includes(team.teamSize)) {
        setCustomSize(team.teamSize.toString());
      }
    }
    
    // Pass team data to parent component for autofilling
    if (onTeamDataUpdate) {
      onTeamDataUpdate({
        teamSize: team.teamSize,
        formation: team.formation,
        players: team.players,
      });
    }
  };

  const handleOpposingTeamSelect = (team: SelectedTeam) => {
    setSelectedOpposingTeam(team);
    setOpposingTeamModalVisible(false);
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
            style={[
              styles.teamButton,
              selectedYourTeam && styles.selectedTeamButton
            ]}
            onPress={handleYourTeamPress}
            activeOpacity={0.7}
          >
            <View style={styles.teamButtonContent}>
              {selectedYourTeam ? (
                <>
                  <View style={[
                    styles.selectedTeamAvatar,
                    { backgroundColor: selectedYourTeam.color }
                  ]}>
                    <Text style={styles.selectedTeamAvatarText}>
                      {selectedYourTeam.avatar}
                    </Text>
                  </View>
                  <Text style={styles.teamButtonText}>
                    {selectedYourTeam.name}
                  </Text>
                </>
              ) : (
                <>
                  <Users size={20} color="#3b82f6" />
                  <Text style={styles.teamButtonText}>Select Your Team</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          
          {/* VS Text */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>vs</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.teamButton,
              selectedOpposingTeam && styles.selectedTeamButton
            ]}
            onPress={handleOpposingTeamPress}
            activeOpacity={0.7}
          >
            <View style={styles.teamButtonContent}>
              {selectedOpposingTeam ? (
                <>
                  <View style={[
                    styles.selectedTeamAvatar,
                    { backgroundColor: selectedOpposingTeam.color }
                  ]}>
                    <Text style={styles.selectedTeamAvatarText}>
                      {selectedOpposingTeam.avatar}
                    </Text>
                  </View>
                  <Text style={styles.teamButtonText}>
                    {selectedOpposingTeam.name}
                  </Text>
                </>
              ) : (
                <>
                  <Shield size={20} color="#ef4444" />
                  <Text style={styles.teamButtonText}>Select Opposing Team</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Invite Later Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.inviteLaterNote}>You can invite later</Text>
          </View>
        </View>
      )}

      {/* Your Team Selection Modal */}
      <YourTeamModal
        visible={yourTeamModalVisible}
        onClose={() => setYourTeamModalVisible(false)}
        onSelectTeam={handleYourTeamSelect}
      />

      {/* Opposing Team Selection Modal */}
      <OpposingTeamModal
        visible={opposingTeamModalVisible}
        onClose={() => setOpposingTeamModalVisible(false)}
        onSelectTeam={handleOpposingTeamSelect}
      />
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
  selectedTeamButton: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
  selectedTeamAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTeamAvatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
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