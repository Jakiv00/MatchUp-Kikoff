import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';

// Mock public teams data (teams that other users have made public)
const mockPublicTeams = [
  {
    id: 'pub1',
    name: 'Golden Eagles',
    members: 15,
    wins: 12,
    losses: 3,
    avatar: 'GE',
    color: '#f59e0b',
    isLeader: false, // User is not the leader
    isPublic: true,
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
    id: 'pub2',
    name: 'Crimson Sharks',
    members: 13,
    wins: 8,
    losses: 6,
    avatar: 'CS',
    color: '#dc2626',
    isLeader: false,
    isPublic: true,
    teamSize: 7,
    formation: {
      id: '7-1',
      name: '3-2-2',
      positions: [
        { id: 'gk', name: 'GK', x: 50, y: 95, filled: true, playerId: '2', isGoalkeeper: true },
        { id: 'lb', name: 'LB', x: 20, y: 70, filled: true, playerId: '13' },
        { id: 'cb', name: 'CB', x: 50, y: 70, filled: true, playerId: '3' },
        { id: 'rb', name: 'RB', x: 80, y: 70, filled: true, playerId: '14' },
        { id: 'lm', name: 'LM', x: 30, y: 50, filled: true, playerId: '5' },
        { id: 'rm', name: 'RM', x: 70, y: 50, filled: true, playerId: '7' },
        { id: 'ls', name: 'LS', x: 35, y: 30, filled: true, playerId: '6' },
        { id: 'rs', name: 'RS', x: 65, y: 30, filled: true, playerId: '9' },
      ]
    },
    players: [
      { id: '2', initials: 'JD', name: 'John Doe', selected: true, preferredPosition: 'GK', position: 'GK' },
      { id: '3', initials: 'JS', name: 'Jane Smith', selected: true, preferredPosition: 'CB', position: 'CB' },
      { id: '5', initials: 'LJ', name: 'LeBron James', selected: true, preferredPosition: 'LW', position: 'LM' },
      { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: true, preferredPosition: 'ST', position: 'LS' },
      { id: '7', initials: 'LM', name: 'Lionel Messi', selected: true, preferredPosition: 'RW', position: 'RM' },
      { id: '9', initials: 'KM', name: 'Kylian Mbappé', selected: true, preferredPosition: 'ST', position: 'RS' },
      { id: '13', initials: 'MR', name: 'Marcus Rodriguez', selected: true, preferredPosition: 'LB', position: 'LB' },
      { id: '14', initials: 'SJ', name: 'Sarah Johnson', selected: true, preferredPosition: 'RB', position: 'RB' },
      { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: true, preferredPosition: 'ST' },
      { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: true, preferredPosition: 'CM' },
    ]
  },
  {
    id: 'pub3',
    name: 'Azure Wolves',
    members: 11,
    wins: 15,
    losses: 2,
    avatar: 'AW',
    color: '#2563eb',
    isLeader: false,
    isPublic: true,
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
    ]
  },
  {
    id: 'pub4',
    name: 'Emerald Tigers',
    members: 9,
    wins: 4,
    losses: 8,
    avatar: 'ET',
    color: '#059669',
    isLeader: false,
    isPublic: true,
    teamSize: 5,
    formation: {
      id: '5-1',
      name: '3-1-1',
      positions: [
        { id: 'gk', name: 'GK', x: 50, y: 95, filled: true, playerId: '2', isGoalkeeper: true },
        { id: 'lb', name: 'LB', x: 20, y: 70, filled: true, playerId: '13' },
        { id: 'cb', name: 'CB', x: 50, y: 70, filled: true, playerId: '3' },
        { id: 'rb', name: 'RB', x: 80, y: 70, filled: true, playerId: '14' },
        { id: 'cm', name: 'CM', x: 50, y: 50, filled: true, playerId: '4' },
        { id: 'st', name: 'ST', x: 50, y: 30, filled: true, playerId: '6' },
      ]
    },
    players: [
      { id: '2', initials: 'JD', name: 'John Doe', selected: true, preferredPosition: 'GK', position: 'GK' },
      { id: '3', initials: 'JS', name: 'Jane Smith', selected: true, preferredPosition: 'CB', position: 'CB' },
      { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: true, preferredPosition: 'CM', position: 'CM' },
      { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: true, preferredPosition: 'ST', position: 'ST' },
      { id: '13', initials: 'MR', name: 'Marcus Rodriguez', selected: true, preferredPosition: 'LB', position: 'LB' },
      { id: '14', initials: 'SJ', name: 'Sarah Johnson', selected: true, preferredPosition: 'RB', position: 'RB' },
      { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: true, preferredPosition: 'ST' },
      { id: '5', initials: 'LJ', name: 'LeBron James', selected: true, preferredPosition: 'LW' },
      { id: '7', initials: 'LM', name: 'Lionel Messi', selected: true, preferredPosition: 'RW' },
    ]
  },
  {
    id: 'pub5',
    name: 'Violet Phoenixes',
    members: 16,
    wins: 11,
    losses: 4,
    avatar: 'VP',
    color: '#7c3aed',
    isLeader: false,
    isPublic: true,
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
      { id: '16', initials: 'EL', name: 'Emma Lopez', selected: true, preferredPosition: 'CAM' },
      { id: '17', initials: 'RT', name: 'Ryan Thompson', selected: true, preferredPosition: 'GK' },
      { id: '18', initials: 'AL', name: 'Alex Lee', selected: true, preferredPosition: 'CB' },
      { id: '19', initials: 'MG', name: 'Maria Garcia', selected: true, preferredPosition: 'CM' },
    ]
  },
];

// Global storage to add public teams data for team details
let publicTeamsData: any[] = [...mockPublicTeams];

export default function ViewTeamsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState(mockPublicTeams);

  // Filter teams based on search query
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    team.isPublic === true
  );

  const handleBack = () => {
    router.back();
  };

  const handleTeamPress = (teamId: string) => {
    router.push(`/team-details?id=${teamId}`);
  };

  const renderTeamCard = (team: typeof mockPublicTeams[0]) => (
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
          <Text style={styles.teamName}>{team.name}</Text>
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Browse Teams</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search teams..."
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Teams List */}
      <ScrollView
        style={styles.teamsContainer}
        contentContainerStyle={styles.teamsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTeams.length > 0 ? (
          filteredTeams.map(renderTeamCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery ? `No teams found matching "${searchQuery}"` : 'No public teams available'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Export function to get public teams data for team details
export const getPublicTeamsData = () => publicTeamsData;

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
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a1d23',
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
  teamsContainer: {
    flex: 1,
  },
  teamsContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});