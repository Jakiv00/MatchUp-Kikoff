import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

interface TeamSizeSelectorProps {
  teamSize: number;
  setTeamSize: (size: number) => void;
  isCustomSize: boolean;
  setIsCustomSize: (isCustom: boolean) => void;
  customSize: string;
  setCustomSize: (size: string) => void;
}

export default function TeamSizeSelector({
  teamSize,
  setTeamSize,
  isCustomSize,
  setIsCustomSize,
  customSize,
  setCustomSize
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
});