import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, LogIn, MoveVertical as MoreVertical } from 'lucide-react-native';
import CustomToast from '@/components/CustomToast';
import ChatButton from '@/components/Chat/ChatButton';
import ChatOverlay from '@/components/Chat/ChatOverlay';
import TeamRatingPopup from '@/components/Rating/TeamRatingPopup';
import RateTeammatesScreen from '@/components/Rating/RateTeammatesScreen';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

export default function HomeScreen() {
  const [availableMatches, setAvailableMatches] = useState([
    {
      id: '1',
      type: '5v5',
      field: 'Central Park Field',
      time: '6:00 PM Today',
      distance: '1.2 miles',
      playersNeeded: 3,
    },
    {
      id: '2',
      type: '7v7',
      field: 'Riverside Stadium',
      time: '7:30 PM Tomorrow',
      distance: '2.5 miles',
      playersNeeded: 5,
    },
    {
      id: '3',
      type: '11v11',
      field: 'Olympic Sports Center',
      time: 'Saturday, 10:00 AM',
      distance: '3.7 miles',
      playersNeeded: 7,
    },
  ]);

  const params = useLocalSearchParams();
  const router = useRouter();
  const [toastVisible, setToastVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [ratingPopupVisible, setRatingPopupVisible] = useState(false);
  const [rateTeammatesVisible, setRateTeammatesVisible] = useState(false);

  // Show rating popup when app loads (simulate after match completion)
  useEffect(() => {
    // Simulate showing rating popup after a delay (as if user just finished a match)
    const timer = setTimeout(() => {
      setRatingPopupVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (params.showToast === '1') {
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          router.replace('/(tabs)');
        }, 3300);
      }
    }, [params.showToast])
  );

  const handleCreateMatch = () => {
    router.push('/create-match');
  };

  const handleJoinMatch = () => {
    // Navigate to join match flow
    console.log('Join match pressed');
  };

  const handleJoinSpecificMatch = (matchId: string) => {
    // Join specific match
    console.log(`Join match ${matchId} pressed`);
  };

  const handleMoreOptions = (matchId: string) => {
    // Show more options for a match
    console.log(`More options for match ${matchId} pressed`);
  };

  const handleChatPress = () => {
    setChatVisible(true);
  };

  const handleChatClose = () => {
    setChatVisible(false);
  };

  const handleRatingSubmit = (teamRating: number, fieldRating: number, rateAllPlayers: boolean, teammateRatings?: Record<string, number>) => {
    console.log('Rating submitted:', { teamRating, fieldRating, rateAllPlayers, teammateRatings });
    
    // Only show teammates rating screen if we haven't rated any teammates yet
    if (!rateAllPlayers && teamRating > 0 && (!teammateRatings || Object.keys(teammateRatings).length === 0)) {
      setRateTeammatesVisible(true);
    } else {
      // If we have teammate ratings or rateAllPlayers is true, we're done
      setRateTeammatesVisible(false);
    }
    
    setRatingPopupVisible(false);
  };

  const handleTeammateRatingsSubmit = (ratings: Record<string, number>) => {
    console.log('Teammate ratings submitted:', ratings);
    setRateTeammatesVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MatchUp</Text>
      
      <ChatButton onPress={handleChatPress} />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.createButton]} 
          onPress={handleCreateMatch}
        >
          <Plus color="#ffffff" size={20} />
          <Text style={styles.buttonText}>Create a Match</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.joinButton]} 
          onPress={handleJoinMatch}
        >
          <LogIn color="#ffffff" size={20} />
          <Text style={styles.buttonText}>Join a Match</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Available Matches</Text>
      
      <ScrollView 
        style={styles.matchesContainer}
        contentContainerStyle={styles.matchesContent}
        showsVerticalScrollIndicator={false}
      >
        {availableMatches.map((match) => (
          <View key={match.id} style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <Text style={styles.matchType}>{match.type}</Text>
              <TouchableOpacity 
                onPress={() => handleMoreOptions(match.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MoreVertical color="#9ca3af" size={20} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.fieldName}>{match.field}</Text>
            
            <View style={styles.matchDetails}>
              <Text style={styles.matchInfo}>{match.time}</Text>
              <Text style={styles.matchInfo}>{match.distance}</Text>
            </View>
            
            <View style={styles.matchFooter}>
              <Text style={styles.playersNeeded}>
                {match.playersNeeded} {match.playersNeeded === 1 ? 'player' : 'players'} needed
              </Text>
              
              <TouchableOpacity 
                style={styles.joinMatchButton}
                onPress={() => handleJoinSpecificMatch(match.id)}
              >
                <Text style={styles.joinMatchButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <CustomToast
        visible={toastVisible}
        message="Request sent. Waiting for team approval."
        onHide={() => setToastVisible(false)}
      />
      
      <ChatOverlay
        visible={chatVisible}
        onClose={handleChatClose}
      />

      <TeamRatingPopup
        visible={ratingPopupVisible}
        onClose={() => setRatingPopupVisible(false)}
        onSubmit={handleRatingSubmit}
      />

      <RateTeammatesScreen
        visible={rateTeammatesVisible}
        onClose={() => setRateTeammatesVisible(false)}
        onSubmit={handleTeammateRatingsSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0f1115',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 0.48,
  },
  createButton: {
    backgroundColor: '#3b82f6',
  },
  joinButton: {
    backgroundColor: '#4b5563',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  matchesContainer: {
    flex: 1,
    marginBottom: 0,
  },
  matchesContent: {
    paddingBottom: 16,
  },
  matchCard: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchType: {
    backgroundColor: '#374151',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  matchDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  matchInfo: {
    color: '#9ca3af',
    fontSize: 14,
    marginRight: 16,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playersNeeded: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '500',
  },
  joinMatchButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  joinMatchButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});