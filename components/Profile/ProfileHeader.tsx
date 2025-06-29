import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

interface ProfileHeaderProps {
  username?: string;
  email?: string;
  location?: string;
  rating?: number;
  matchesPlayed?: number;
  teamRating?: number;
  preferredPosition?: string;
}

export default function ProfileHeader({
  username = 'John Doe',
  email = 'john.doe@email.com',
  location = 'San Francisco, CA',
  rating = 4.8,
  matchesPlayed = 34,
  teamRating = 4.2,
  preferredPosition = 'ST',
}: ProfileHeaderProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={16}
            color="#f59e0b"
            fill="#f59e0b"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            size={16}
            color="#f59e0b"
            fill="#f59e0b"
            style={{ opacity: 0.5 }}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={16}
            color="#374151"
            fill="#374151"
          />
        );
      }
    }
    
    return stars;
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return '#6366f1';
      case 'DEF': 
      case 'LB':
      case 'CB':
      case 'RB': return '#10b981';
      case 'MID':
      case 'CM':
      case 'CDM':
      case 'CAM': return '#f59e0b';
      case 'FWD':
      case 'ST':
      case 'LW':
      case 'RW': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <View style={styles.container}>
      {/* Rating Card - Top Left */}
      <View style={styles.ratingCard}>
        <Text style={styles.ratingTitle}>Rating</Text>
        
        <View style={styles.starsContainer}>
          {renderStars(rating)}
          <Text style={styles.ratingValue}>{rating}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Matches played:</Text>
            <Text style={styles.statValue}>{matchesPlayed}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Team rating:</Text>
            <Text style={styles.statValue}>{teamRating}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Preferred position:</Text>
            <View style={styles.positionContainer}>
              <View style={[
                styles.positionBadge,
                { backgroundColor: getPositionColor(preferredPosition) }
              ]}>
                <Text style={styles.positionText}>{preferredPosition}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* User Info Block - Top Right */}
      <View style={styles.userInfoBlock}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  ratingCard: {
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    minHeight: 170, // Increased from 140 to accommodate new stat
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  statsContainer: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  positionContainer: {
    alignItems: 'flex-end',
  },
  positionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  positionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  userInfoBlock: {
    flex: 0.48,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});