import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CreditCard as Edit, Users, Trophy, Target, Crown } from 'lucide-react-native';
import EditTeamModal from '@/components/CreateTeam/EditTeamModal';
import { getDynamicTeams } from '@/app/(tabs)/teams';
import { getPublicTeamsData } from '@/app/view-teams';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock team data with team leader information
const mockTeamData = {
  '1': {
    id: '1',
    name: 'Thunder Bolts',
    members: 12,
    wins: 8,
    losses: 2,
    avatar: 'TB',
    color: '#3b82f6',
    isLeader: true, // User is the leader of this team
    teamLeader: {
      id: 'user1',
      name: 'Alex Rodriguez', // Current user
      initials: 'AR',
      isCurrentUser: true,
    },
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
  '2': {
    id: '2',
    name: 'Fire Dragons',
    members: 10,
    wins: 6,
    losses: 4,
    avatar: 'FD',
    color: '#ef4444',
    isLeader: false, // User is NOT the leader of this team
    teamLeader: {
      id: 'leader2',
      name: 'Marcus Thompson', // Different user is the leader
      initials: 'MT',
      isCurrentUser: false,
    },
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
  '3': {
    id: '3',
    name: 'Storm Eagles',
    members: 14,
    wins: 9,
    losses: 1,
    avatar: 'SE',
    color: '#10b981',
    isLeader: true, // User is the leader of this team
    teamLeader: {
      id: 'user1',
      name: 'Alex Rodriguez', // Current user
      initials: 'AR',
      isCurrentUser: true,
    },
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
      { id: '9', initials: 'KM', name: 'Kylian Mbappé', selected: true, preferredPosition: 'ST' },
      { id: '16', initials: 'EL', name: 'Emma Lopez', selected: true, preferredPosition: 'CAM' },
    ]
  },
  '4': {
    id: '4',
    name: 'Lightning Wolves',
    members: 11,
    wins: 5,
    losses: 5,
    avatar: 'LW',
    color: '#f59e0b',
    isLeader: false, // User is NOT the leader of this team
    teamLeader: {
      id: 'leader4',
      name: 'Sarah Chen', // Different user is the leader
      initials: 'SC',
      isCurrentUser: false,
    },
    teamSize: 7,
    formation: {
      id: '7-2',
      name: '4-2-1',
      positions: [
        { id: 'gk', name: 'GK', x: 50, y: 95, filled: true, playerId: '2', isGoalkeeper: true },
        { id: 'lb', name: 'LB', x: 20, y: 70, filled: true, playerId: '13' },
        { id: 'lcb', name: 'LCB', x: 40, y: 70, filled: true, playerId: '3' },
        { id: 'rcb', name: 'RCB', x: 60, y: 70, filled: true, playerId: '11' },
        { id: 'rb', name: 'RB', x: 80, y: 70, filled: true, playerId: '14' },
        { id: 'lm', name: 'LM', x: 30, y: 50, filled: true, playerId: '5' },
        { id: 'rm', name: 'RM', x: 70, y: 50, filled: true, playerId: '7' },
        { id: 'st', name: 'ST', x: 50, y: 30, filled: true, playerId: '6' },
      ]
    },
    players: [
      { id: '2', initials: 'JD', name: 'John Doe', selected: true, preferredPosition: 'GK', position: 'GK' },
      { id: '3', initials: 'JS', name: 'Jane Smith', selected: true, preferredPosition: 'CB', position: 'LCB' },
      { id: '5', initials: 'LJ', name: 'LeBron James', selected: true, preferredPosition: 'LW', position: 'LM' },
      { id: '6', initials: 'CR', name: 'Cristiano Ronaldo', selected: true, preferredPosition: 'ST', position: 'ST' },
      { id: '7', initials: 'LM', name: 'Lionel Messi', selected: true, preferredPosition: 'RW', position: 'RM' },
      { id: '11', initials: 'VM', name: 'Virgil van Dijk', selected: true, preferredPosition: 'CB', position: 'RCB' },
      { id: '13', initials: 'MR', name: 'Marcus Rodriguez', selected: true, preferredPosition: 'LB', position: 'LB' },
      { id: '14', initials: 'SJ', name: 'Sarah Johnson', selected: true, preferredPosition: 'RB', position: 'RB' },
      { id: '1', initials: 'AE', name: 'Ahmet Eren', selected: true, preferredPosition: 'ST' },
      { id: '4', initials: 'MJ', name: 'Michael Jackson', selected: true, preferredPosition: 'CM' },
      { id: '9', initials: 'KM', name: 'Kylian Mbappé', selected: true, preferredPosition: 'ST' },
    ]
  },
  '5': {
    id: '5',
    name: 'Ice Panthers',
    members: 13,
    wins: 7,
    losses: 3,
    avatar: 'IP',
    color: '#6366f1',
    isLeader: false, // User is NOT the leader of this team
    teamLeader: {
      id: 'leader5',
      name: 'David Kim', // Different user is the leader
      initials: 'DK',
      isCurrentUser: false,
    },
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
    ]
  },
};

export default function TeamDetailsScreen() {
  const params = useLocalSearchParams();
  const teamId = params.id as string;
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Get team data from mock data, dynamic data, or public teams data
  const [teamData, setTeamData] = useState(() => {
    // First check mock data
    const mockTeam = mockTeamData[teamId as keyof typeof mockTeamData];
    if (mockTeam) {
      return mockTeam;
    }
    
    // Then check dynamic teams
    const dynamicTeams = getDynamicTeams();
    const dynamicTeam = dynamicTeams.find(team => team.id === teamId);
    if (dynamicTeam) {
      // Add default team leader info for dynamic teams
      return {
        ...dynamicTeam,
        teamLeader: {
          id: 'user1',
          name: 'Alex Rodriguez', // Current user is always leader of created teams
          initials: 'AR',
          isCurrentUser: true,
        }
      };
    }
    
    // Finally check public teams
    const publicTeams = getPublicTeamsData();
    const publicTeam = publicTeams.find(team => team.id === teamId);
    if (publicTeam) {
      // Add default team leader info for public teams (user is not leader)
      return {
        ...publicTeam,
        teamLeader: {
          id: 'external_leader',
          name: 'Team Captain', // Generic name for external team leaders
          initials: 'TC',
          isCurrentUser: false,
        }
      };
    }
    
    return null;
  });

  if (!teamData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Team Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Team not found</Text>
        </View>
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleTeamUpdated = (updatedTeamData: any) => {
    setTeamData(prev => ({
      ...prev,
      ...updatedTeamData,
    }));
    
    // Update the dynamic data storage if it's a dynamic team
    const dynamicTeams = getDynamicTeams();
    const teamIndex = dynamicTeams.findIndex(team => team.id === teamId);
    if (teamIndex !== -1) {
      dynamicTeams[teamIndex] = { ...dynamicTeams[teamIndex], ...updatedTeamData };
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return '#6366f1';
      case 'LB':
      case 'CB':
      case 'RB':
      case 'LCB':
      case 'RCB': return '#10b981';
      case 'CDM':
      case 'CM':
      case 'CAM':
      case 'LCM':
      case 'RCM':
      case 'LM':
      case 'RM': return '#f59e0b';
      case 'LW':
      case 'ST':
      case 'RW':
      case 'LS':
      case 'RS': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const renderFormationField = () => {
    if (!teamData.formation) {
      return (
        <View style={styles.formationContainer}>
          <Text style={styles.sectionTitle}>Formation: Not Set</Text>
          <View style={styles.noFormationContainer}>
            <Text style={styles.noFormationText}>No formation configured yet</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.formationContainer}>
        <Text style={styles.sectionTitle}>Formation: {teamData.formation.name}</Text>
        
        <View style={styles.soccerField}>
          <View style={styles.fieldCenter}>
            <View style={styles.centerCircle} />
          </View>
          <View style={styles.goalArea1} />
          <View style={styles.goalArea2} />
          
          {teamData.formation.positions.map((position) => {
            const assignedPlayer = teamData.players.find(p => p.position === position.name);
            
            return (
              <View
                key={position.id}
                style={[
                  styles.positionCircle,
                  {
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  },
                  assignedPlayer && styles.filledPositionCircle,
                  position.isGoalkeeper && styles.goalkeeperPosition
                ]}
              >
                <View style={[
                  styles.positionInner,
                  position.isGoalkeeper && styles.goalkeeperInner,
                  { backgroundColor: assignedPlayer ? getPositionColor(position.name) : '#4b5563' }
                ]}>
                  {assignedPlayer ? (
                    <Text style={styles.playerInitials}>{assignedPlayer.initials}</Text>
                  ) : (
                    <Text style={[
                      styles.positionText,
                      position.isGoalkeeper && styles.goalkeeperText
                    ]}>{position.name}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPlayersList = () => {
    if (!teamData.players || teamData.players.length === 0) {
      return (
        <View style={styles.playersContainer}>
          <Text style={styles.sectionTitle}>Squad (0 players)</Text>
          <View style={styles.noPlayersContainer}>
            <Text style={styles.noPlayersText}>No players added yet</Text>
          </View>
        </View>
      );
    }

    const positionedPlayers = teamData.players.filter(p => p.position);
    const benchPlayers = teamData.players.filter(p => !p.position);

    return (
      <View style={styles.playersContainer}>
        <Text style={styles.sectionTitle}>Squad ({teamData.players.length} players)</Text>
        
        {/* Starting XI */}
        {positionedPlayers.length > 0 && (
          <View style={styles.playerGroup}>
            <Text style={styles.playerGroupTitle}>Starting XI</Text>
            <View style={styles.playersGrid}>
              {positionedPlayers.map((player) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={[
                    styles.playerAvatar,
                    { backgroundColor: getPositionColor(player.position || player.preferredPosition) }
                  ]}>
                    <Text style={styles.playerInitials}>{player.initials}</Text>
                  </View>
                  <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                  <Text style={styles.playerPosition}>{player.position}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bench */}
        {benchPlayers.length > 0 && (
          <View style={styles.playerGroup}>
            <Text style={styles.playerGroupTitle}>Bench</Text>
            <View style={styles.playersGrid}>
              {benchPlayers.map((player) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={[
                    styles.playerAvatar,
                    { backgroundColor: getPositionColor(player.preferredPosition) }
                  ]}>
                    <Text style={styles.playerInitials}>{player.initials}</Text>
                  </View>
                  <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                  <Text style={styles.playerPosition}>{player.preferredPosition}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Team Details</Text>
        
        {/* Show edit button only if user is the team leader */}
        {teamData.isLeader ? (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Edit size={24} color="#3b82f6" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Team Info Card */}
        <View style={styles.teamInfoCard}>
          <View style={styles.teamHeader}>
            <View style={[styles.teamAvatar, { backgroundColor: teamData.color }]}>
              <Text style={styles.teamAvatarText}>{teamData.avatar}</Text>
            </View>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{teamData.name}</Text>
              <Text style={styles.teamMembers}>{teamData.members} members</Text>
              {teamData.isLeader && (
                <View style={styles.leaderBadge}>
                  <Text style={styles.leaderBadgeText}>Team Leader</Text>
                </View>
              )}
            </View>
          </View>

          {/* Team Leader Section - Always visible for teams user participates in */}
          {teamData.teamLeader && (
            <View style={styles.teamLeaderSection}>
              <View style={styles.teamLeaderHeader}>
                <Crown size={18} color="#f59e0b" />
                <Text style={styles.teamLeaderTitle}>Team Leader</Text>
              </View>
              <View style={styles.teamLeaderInfo}>
                <View style={styles.teamLeaderAvatar}>
                  <Text style={styles.teamLeaderInitials}>{teamData.teamLeader.initials}</Text>
                </View>
                <View style={styles.teamLeaderDetails}>
                  <Text style={styles.teamLeaderName}>{teamData.teamLeader.name}</Text>
                  {teamData.teamLeader.isCurrentUser && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>You</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Team Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Trophy size={20} color="#f59e0b" />
              <Text style={styles.statValue}>{teamData.wins || 0}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={20} color="#ef4444" />
              <Text style={styles.statValue}>{teamData.losses || 0}</Text>
              <Text style={styles.statLabel}>Losses</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={20} color="#3b82f6" />
              <Text style={styles.statValue}>{teamData.teamSize}v{teamData.teamSize}</Text>
              <Text style={styles.statLabel}>Format</Text>
            </View>
          </View>
        </View>

        {/* Formation */}
        {renderFormationField()}

        {/* Players List */}
        {renderPlayersList()}
      </ScrollView>

      {/* Edit Team Modal - Only show if user is the team leader */}
      {teamData.isLeader && (
        <EditTeamModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onUpdateTeam={handleTeamUpdated}
          teamData={teamData}
        />
      )}
    </View>
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
  editButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
  },
  teamInfoCard: {
    backgroundColor: '#1a1d23',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  teamAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  teamMembers: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 8,
  },
  leaderBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  leaderBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  teamLeaderSection: {
    backgroundColor: '#0f1115',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  teamLeaderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamLeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  teamLeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLeaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamLeaderInitials: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  teamLeaderDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  youBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#0f1115',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  formationContainer: {
    marginBottom: 32,
  },
  noFormationContainer: {
    backgroundColor: '#1a1d23',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFormationText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
  soccerField: {
    width: SCREEN_WIDTH - 64,
    height: 300,
    backgroundColor: '#1f2a2f',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    marginHorizontal: 16,
    marginRight: 32,
  },
  fieldCenter: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: '50%',
  },
  centerCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    top: -25,
    left: '50%',
    marginLeft: -25,
  },
  goalArea1: {
    position: 'absolute',
    width: 100,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 0,
    top: 0,
    left: '50%',
    marginLeft: -50,
  },
  goalArea2: {
    position: 'absolute',
    width: 100,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopWidth: 0,
    bottom: 0,
    left: '50%',
    marginLeft: -50,
  },
  positionCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -22 }, { translateY: -22 }],
  },
  positionInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledPositionCircle: {
    backgroundColor: '#3b82f6',
  },
  goalkeeperPosition: {
    width: 48,
    height: 48,
    borderRadius: 24,
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  goalkeeperInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  goalkeeperText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  positionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  playerInitials: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  playersContainer: {
    marginBottom: 32,
  },
  noPlayersContainer: {
    backgroundColor: '#1a1d23',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPlayersText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
  playerGroup: {
    marginBottom: 24,
  },
  playerGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  playerCard: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 80) / 4,
    marginBottom: 16,
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
  },
});