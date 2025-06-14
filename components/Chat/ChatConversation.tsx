import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Send, ArrowLeft } from 'lucide-react-native';
import MessageBubble from './MessageBubble';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  read?: boolean;
}

interface ChatConversationProps {
  chatId: string;
  onBack: () => void;
}

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: 'Hey! Are you ready for tomorrow\'s match?',
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: '2',
      text: 'Absolutely! I\'ve been practicing all week',
      timestamp: '10:32 AM',
      isOwn: true,
      read: true,
    },
    {
      id: '3',
      text: 'That\'s great to hear! What position are you playing?',
      timestamp: '10:33 AM',
      isOwn: false,
    },
    {
      id: '4',
      text: 'I\'ll be playing midfielder. Really excited!',
      timestamp: '10:35 AM',
      isOwn: true,
      read: true,
    },
    {
      id: '5',
      text: 'See you at the match tomorrow!',
      timestamp: '10:36 AM',
      isOwn: false,
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Amazing game today! You played really well',
      timestamp: '6:45 PM',
      isOwn: false,
    },
    {
      id: '2',
      text: 'Thanks! You too! That goal was incredible 🔥',
      timestamp: '6:47 PM',
      isOwn: true,
      read: true,
    },
  ],
};

const playerNames: Record<string, string> = {
  '1': 'Jaki Valansi',
  '2': 'Taha Çelik',
  '3': 'Hasan Erdem',
  '4': 'Kerim Dereli',
  '5': 'Jeymi Moşe',
};

export default function ChatConversation({ chatId, onBack }: ChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages[chatId] || []);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const translateX = useSharedValue(0);

  const playerName = playerNames[chatId] || 'Player';

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      if (event.translationX > 0) {
        translateX.value = context.startX + event.translationX * 0.5;
      }
    },
    onEnd: (event) => {
      if (event.translationX > 100 || event.velocityX > 500) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 });
        runOnJS(onBack)();
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    },
  });

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        read: false,
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{playerName}</Text>
            <Text style={styles.playerStatus}>Online</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 235 : 205}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Send size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d23',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  playerStatus: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a1d23',
    backgroundColor: '#0f1115',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a1d23',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    color: '#ffffff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sendButtonInactive: {
    backgroundColor: '#374151',
  },
});