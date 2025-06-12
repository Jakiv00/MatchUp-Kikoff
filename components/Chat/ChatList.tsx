import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface Chat {
  id: string;
  playerName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar: string;
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
}

const mockChats: Chat[] = [
  {
    id: '1',
    playerName: 'Jaki Valansi',
    lastMessage: 'See you at the match tomorrow!',
    timestamp: '2m ago',
    unread: true,
    avatar: 'JV',
  },
  {
    id: '2',
    playerName: 'Taha Çelik',
    lastMessage: 'Great game today 🔥',
    timestamp: '1h ago',
    unread: false,
    avatar: 'TÇ',
  },
  {
    id: '3',
    playerName: 'Hasan Erdem',
    lastMessage: 'What time is practice?',
    timestamp: '3h ago',
    unread: true,
    avatar: 'HE',
  },
  {
    id: '4',
    playerName: 'Kerim Dereli',
    lastMessage: 'Thanks for the invite!',
    timestamp: '1d ago',
    unread: false,
    avatar: 'KD',
  },
  {
    id: '5',
    playerName: 'Jeymi Moşe',
    lastMessage: 'Can we reschedule?',
    timestamp: '2d ago',
    unread: false,
    avatar: 'JM',
  },
];

export default function ChatList({ onChatSelect }: ChatListProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {mockChats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          style={styles.chatItem}
          onPress={() => onChatSelect(chat.id)}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{chat.avatar}</Text>
          </View>

          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.playerName}>{chat.playerName}</Text>
              <Text style={styles.timestamp}>{chat.timestamp}</Text>
            </View>
            <View style={styles.messageRow}>
              <Text
                style={[
                  styles.lastMessage,
                  chat.unread && styles.unreadMessage,
                ]}
                numberOfLines={1}
              >
                {chat.lastMessage}
              </Text>
              {chat.unread && <View style={styles.unreadDot} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d23',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
  },
  unreadMessage: {
    color: '#ffffff',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
  },
});