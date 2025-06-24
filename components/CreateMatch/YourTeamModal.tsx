import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { X, Search, Info } from 'lucide-react-native';
import { getDynamicTeams } from '@/app/(tabs)/teams';
import TeamInfoModal from './TeamInfoModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock user teams data (teams the user is part of)
const mockUserTeams = [
  {
    id: '1',
    name: 'Thunder Bolts',
    members: 12,
    wins: 8,
    losses: 2,
    avatar: 'TB',
    color: '#3b82f6',
    isLeader: true,
    teamSize: 11,
    formation: {
      id: '11-1',
      name: '4-4-2',
      positions: [
        { id: 'gk', name: 'GK', x: 50, y: 95, filled: true, playerId: '2', isGoalkeeper: true },
        { id: 'lb', name: 'LB', x: 20, y: 70, filled: true, playerId: '13' },
        { id: 'lcb', name: 'LCB', x: 40, y: 70, filled: true, playerId: '3' },
        { id: 'rcb', name: 'RCB', x: 60, y: 70, filled: true, playerId: '11' },
        { id: 'rb', name: 'RB', x: 80, y: 70, filled: true, playerId: '14' },
        { id: 'lm', name: 'LM', x: 20, y: 50, filled: true, playerId: '5' },
        { id: 'lcm', name: 'LCM', x: 40, y: 50, filled: true, playerId: '4' },
        { id: 'rcm', name: 'RCM', x: 60, y: 50, filled: true, playerId: '12' },
        { id: 'rm', name: 'RM', x: 80, y: 50, filled: true, playerId: '7' },
        { id: 'ls', name: 'LS', x: 35, y: 30, filled: true, playerId: '6' },
        { id: 'rs', name: 'RS', x: 65, y: 30, filled: true, playerId: '9' },
      ]
    },
    players: [
      { id: '2', initials: 'JD', name: 'John Doe', selected: true, preferredPosition: 'GK', position: 'GK' },
      { id: '3', initials: 'JS', name: 'Jane Smith', selected: true, preferredPosition: 'CB', position: 'LCB' },
      { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: true, preferredPosition: 'CM', position: 'LCM' },
      { id: '5', initials: 'LJ', name: 'LeBron James', selected: true, preferredPosition: 'LW', position: 'LM' },
      { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: true, preferredPosition: 'ST', position: 'LS' },
      { id: '7', initials: 'LM', name: 'Lionel Messi', selected: true, preferredPosition: 'RW', position: 'RM' },
      { id: '9', initials: 'KM', name: 'Kylian Mbappé', selected: true, preferredPosition: 'ST', position: 'RS' },
      { id: '11', initials: 'VM', name: 'Virgil van Dijk', selected: true, preferredPosition: 'CB', position: 'RCB' },
      { id: '12', initials: 'KDB', name: 'Kevin De Bruyne', selected: true, preferredPosition: 'CM', position: 'RCM' },
      { id: '13', initials: 'MR', name: 'Marcus Rodriguez', selected: true, preferredPosition: 'LB', position: 'LB' },
      { id: '14', initials: 'SJ', name: 'Sarah Johnson', selected: true, preferredPosition: 'RB', position: 'RB' },
      { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: true, preferredPosition: 'ST' },
    ]
  },
  {
    id: '3',
    name: 'Storm Eagles',
    members: 14,
    wins: 9,
    losses: 1,
    avatar: 'SE',
    color: '#10b981',
    isLeader: true,
    teamSize: 11,
    formation: {
      id: '11-2',
      name: '4-3-3',
      positions: [
        { id: 'gk', name: 'GK', x: 50, y: 95, filled: true, playerId: '2', isGoalkeeper: true },
        { id: 'lb', name: 'LB', x: 20, y: 70, filled: true, playerId: '13' },
        { id: 'lcb', name: 'LCB', x: 40, y: 70, filled: true, playerId: '3' },
        { id: 'rcb', name: 'RCB', x: 60, y: 70, filled: true, playerId: '11' },
        { id: 'rb', name: 'RB', x: 80, y: 70, filled: true, playerId: '14' },
        { id: 'cdm', name: 'CDM', x: 50, y: 55, filled: true, playerId: '15' },
        { id: 'lcm', name: 'LCM', x: 30, y: 45, filled: true, playerId: '4' },
        { id: 'rcm', name: 'RCM', x: 70, y: 45, filled: true, playerId: '12' },
        { id: 'lw', name: 'LW', x: 20, y: 30, filled: true, playerId: '5' },
        { id: 'st', name: 'ST', x: 50, y: 25, filled: true, playerId: '6' },
        { id: 'rw', name: 'RW', x: 80, y: 30, filled: true, playerId: '7' },
      ]
    },
    players: [
      { id: '2', initials: 'JD', name: 'John Doe', selected: true, preferredPosition: 'GK', position: 'GK' },
      { id: '3', initials: 'JS', name: 'Jane Smith', selected: true, preferredPosition: 'CB', position: 'LCB' },
      { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: true, preferredPosition: 'CM', position: 'LCM' },
      { id: '5', initials: 'LJ', name: 'LeBron James', selected: true, preferredPosition: 'LW', position: 'LW' },
      { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: true, preferredPosition: 'ST', position: 'ST' },
      { id: '7', initials: 'LM', name: 'Lionel Messi', selected: true, preferredPosition: 'RW', position: 'RW' },
      { id: '11', initials: 'VM', name: 'Virgil van Dijk', selected: true, preferredPosition: 'CB', position: 'RCB' },
      { id: '12', initials: 'KDB', name: 'Kevin De Bruyne', selected: true, preferredPosition: 'CM', position: 'RCM' },
      { id: '13', initials: 'MR', name: 'Marcus Rodriguez', selected: true, preferredPosition: 'LB', position: 'LB' },
      { id: '14', initials: 'SJ', name: 'Sarah Johnson', selected: true, preferredPosition: 'RB', position: 'RB' },
      { id: '15', initials: 'DW', name: 'David Wilson', selected: true, preferredPosition: 'CDM', position: 'CDM' },
      { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: true, preferredPosition: 'ST' },
      { id: '16', initials: 'EL', name: 'Emma Lopez', selected: true, preferredPosition: 'CAM' },
      { id: '17', initials: 'RT', name: 'Ryan Thompson', selected: true, preferredPosition: 'GK' },
    ]
  },
];

interface Team {
  id: string;
  name: string;
  members: number;
  wins: number;
  losses: number;
  avatar: string;
  color: string;
  isLeader: boolean;
  teamSize: number;
  formation?: any;
  players?: any[];
}

interface SelectedTeam {
  id: string;
  name: string;
  avatar: string;
  color: string;
  teamSize: number;
  formation?: any;
  players?: any[];
}

interface YourTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTeam: (team: SelectedTeam) => void;
}

export default function YourTeamModal({
  visible,
  onClose,
  onSelectTeam,
}: YourTeamModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamForInfo, setSelectedTeamForInfo] = useState<Team | null>(null);
  const [teamInfoModalVisible, setTeamInfoModalVisible] = useState(false);
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Get user teams (mock teams + dynamic teams)
  const getUserTeams = (): Team[] => {
    const dynamicTeams = getDynamicTeams();
    return [...mockUserTeams, ...dynamicTeams];
  };

  const userTeams = getUserTeams();

  // Filter teams based on search query
  const filteredTeams = userTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    if (visible) {
      setSearchQuery('');
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scale.value, [0, 1], [0.8, 1]),
      },
    ],
    opacity: opacity.value,
  }));

  const handleTeamSelect = (team: Team) => {
    const selectedTeam: SelectedTeam = {
      id: team.id,
      name: team.name,
      avatar: team.avatar,
      color: team.color,
      teamSize: team.teamSize,
      formation: team.formation,
      players: team.players,
    };
    onSelectTeam(selectedTeam);
  };

  const handleTeamInfo = (team: Team) => {
    setSelectedTeamForInfo(team);
    setTeamInfoModalVisible(true);
  };

  const handleClose = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <View style={styles.backdropContainer}>
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Select Your Team</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color="#9ca3af" />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search your teams..."
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Teams List */}
            <ScrollView 
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <View key={team.id} style={styles.teamRow}>
                    <TouchableOpacity
                      style={styles.teamCard}
                      onPress={() => handleTeamSelect(team)}
                      activeOpacity={0.7}
                    >
                      {/* Team Avatar */}
                      <View style={[styles.teamAvatar, { backgroundColor: team.color }]}>
                        <Text style={styles.teamAvatarText}>{team.avatar}</Text>
                      </View>

                      {/* Team Info */}
                      <View style={styles.teamInfo}>
                        <View style={styles.teamNameRow}>
                          <Text style={styles.teamName}>{team.name}</Text>
                          {team.isLeader && (
                            <View style={styles.leaderBadge}>
                              <Text style={styles.leaderBadgeText}>L</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.teamMembers}>{team.members} members</Text>
                        <Text style={styles.teamRecord}>
                          {team.wins}W - {team.losses}L
                        </Text>
                      </View>

                      {/* Team Size Badge */}
                      <View style={styles.teamSizeBadge}>
                        <Text style={styles.teamSizeText}>{team.teamSize}v{team.teamSize}</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Info Button */}
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => handleTeamInfo(team)}
                      activeOpacity={0.7}
                    >
                      <Info size={20} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {searchQuery ? `No teams found matching "${searchQuery}"` : 'You are not part of any teams yet'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Team Info Modal */}
      {selectedTeamForInfo && (
        <TeamInfoModal
          visible={teamInfoModalVisible}
          onClose={() => setTeamInfoModalVisible(false)}
          team={selectedTeamForInfo}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backdropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1d23',
    borderRadius: 20,
    maxWidth: 400,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1115',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
  scrollContent: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  scrollContentContainer: {
    paddingVertical: 8,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  teamCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1115',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  teamAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  teamInfo: {
    flex: 1,
    marginRight: 12,
  },
  teamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  leaderBadge: {
    backgroundColor: '#3b82f6',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  teamMembers: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  teamRecord: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  teamSizeBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  teamSizeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});