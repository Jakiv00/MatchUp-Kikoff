import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { X, Search } from 'lucide-react-native';
import ChatList from './ChatList';
import ChatConversation from './ChatConversation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? 100 : 80;

interface ChatOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChatOverlay({ visible, onClose }: ChatOverlayProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
      setActiveChat(null);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (event.translationY > 0) {
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: (event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    },
  });

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };

  const handleClose = () => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
    setTimeout(onClose, 300);
  };

  if (!visible) return null;

  return (
    <GestureHandlerRootView style={styles.overlay}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.gestureArea}>
            <View style={styles.dragIndicator} />
          </Animated.View>
        </PanGestureHandler>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={activeChat ? handleBackToList : handleClose}
          >
            <X size={24} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {activeChat ? 'Chat' : 'MatchUp Chat'}
          </Text>

          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeChat ? (
            <ChatConversation
              chatId={activeChat}
              onBack={handleBackToList}
            />
          ) : (
            <ChatList onChatSelect={handleChatSelect} />
          )}
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
  },
  gestureArea: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d23',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
});