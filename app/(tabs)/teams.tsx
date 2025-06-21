import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import CreateTeamModal from '@/components/CreateTeam/CreateTeamModal';

// Mock team data - replace with your actual team data source
const mockTeams = [
  {
    id: '1',
    name: 'Thunder Bolts',
    members: 12,
    wins: 8,
    losses: 2,
    avatar: 'TB',
    color: '#3b82f6',
    isLeader: true, // User is the leader of this team
  },
  {
    id: '2',
    name: 'Fire Dragons',
    members: 10,
    wins: 6,
    losses: 4,
    avatar: 'FD',
    color: '#ef4444',
    isLeader: false, // User is not the leader
  },
  {
    id: '3',
    name: 'Storm Eagles',
    members: 14,
    wins: 9,
    losses: 1,
    avatar: 'SE',
    color: '#10b981',
    isLeader: false,
  },
  {
    id: '4',
    name: 'Lightning Wolves',
    members: 11,
    wins: 5,
    losses: 5,
    avatar: 'LW',
    color: '#f59e0b',
    isLeader: false,
  },
  {
    id: '5',
    name: 'Ice Panthers',
    members: 13,
    wins: 7,
    losses: 3,
    avatar: 'IP',
    color: '#6366f1',
    isLeader: false,
  },
];

export default function TeamsScreen() {
  const [createTeamModalVisible, setCreateTeamModalVisible] = useState(false);
  const [teams, setTeams] = useState(mockTeams);

  const handleCreateTeam = () => {
    setCreateTeamModalVisible(true);
  };

  const handleTeamCreated = (teamData: any) => {
    // Generate a new team based on the created data
    const newTeam = {
      id: Date.now().toString(),
      name: teamData.name,
      members: teamData.players.length,
      wins: 0,
      losses: 0,
      avatar: teamData.name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2),
      color: '#8b5cf6', // Default purple color for new teams
      isLeader: true, // User is always the leader of teams they create
    };

    // Add the new team to the beginning of the list
    setTeams(prev => [newTeam, ...prev]);
    console.log('Team created:', teamData);
  };

  const handleTeamPress = (teamId: string) => {
    // Navigate to team details
    router.push(`/team-details?id=${teamId}`);
  };

  const renderTeamCard = (team: typeof mockTeams[0]) => (
    <TouchableOpacity
      key={team.id}
      style={styles.teamCard}
      onPress={() => handleTeamPress(team.id)}
      activeOpacity={0.7}
    >
      <View style={styles.teamCardContent}>
        {/* Team Avatar */}
        <View style={[styles.teamAvatar, { backgroundColor: team.color }]}>
          <Text style={styles.teamAvatarText}>{team.avatar}</Text>
        </View>

        {/* Team Info */}
        <View style={styles.teamInfo}>
          <View style={styles.teamNameContainer}>
            <Text style={styles.teamName}>{team.name}</Text>
            {team.isLeader && (
              <View style={styles.leaderBadge}>
                <Text style={styles.leaderBadgeText}>Leader</Text>
              </View>
            )}
          </View>
          <Text style={styles.teamMembers}>{team.members} members</Text>
        </View>

        {/* Team Stats */}
        <View style={styles.teamStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{team.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{team.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Teams</Text>
      
      {/* Create Team Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateTeam}
        activeOpacity={0.8}
      >
        <Plus size={20} color="#ffffff" />
        <Text style={styles.createButtonText}>Create a team</Text>
      </TouchableOpacity>
      
      {/* Teams List */}
      <ScrollView
        style={styles.teamsContainer}
        contentContainerStyle={styles.teamsContent}
        showsVerticalScrollIndicator={false}
      >
        {teams.map(renderTeamCard)}
      </ScrollView>

      {/* Create Team Modal */}
      <CreateTeamModal
        visible={createTeamModalVisible}
        onClose={() => setCreateTeamModalVisible(false)}
        onCreateTeam={handleTeamCreated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: 'flex-start',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  teamsContainer: {
    flex: 1,
  },
  teamsContent: {
    paddingBottom: 20,
  },
  teamCard: {
    backgroundColor: '#1a1d23',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  teamCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  teamAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  teamAvatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  teamInfo: {
    flex: 1,
    marginRight: 16,
  },
  teamNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  leaderBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  leaderBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  teamMembers: {
    fontSize: 14,
    color: '#9ca3af',
  },
  teamStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1115',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 40,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#374151',
    marginHorizontal: 12,
  },
});