import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

interface ChatButtonProps {
  onPress: () => void;
}

export default function ChatButton({ onPress }: ChatButtonProps) {
  return (
    <TouchableOpacity
      style={styles.chatButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MessageCircle size={24} color="#ffffff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1d23',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
});