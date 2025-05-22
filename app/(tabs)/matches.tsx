import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { CalendarDays, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';

type MatchCategory = 'drafts' | 'upcoming' | 'history' | 'awaiting';

interface Match {
  id: string;
  type: string;
  field: string;
  time: string;
  playersConfirmed: number;
  totalPlayers: number;
}

export default function MatchesScreen() {
  const [activeCategory, setActiveCategory] = useState<MatchCategory>('upcoming');
  
  const matchCategories: { id: MatchCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'drafts', label: 'Draft Matches', icon: <Clock size={16} color="#9ca3af" /> },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays size={16} color="#9ca3af" /> },
    { id: 'history', label: 'Match History', icon: <CheckCircle size={16} color="#9ca3af" /> },
    { id: 'awaiting', label: 'Awaiting Approval', icon: <AlertTriangle size={16} color="#9ca3af" /> },
  ];
  
  // Mock match data
  const matches: Record<MatchCategory, Match[]> = {
    drafts: [
      { id: 'd1', type: '5v5', field: 'Central Park Field', time: 'Not scheduled yet', playersConfirmed: 3, totalPlayers: 10 },
      { id: 'd2', type: '7v7', field: 'Not selected yet', time: 'Not scheduled yet', playersConfirmed: 0, totalPlayers: 14 },
    ],
    upcoming: [
      { id: 'u1', type: '5v5', field: 'Central Park Field', time: 'Today, 6:00 PM', playersConfirmed: 8, totalPlayers: 10 },
      { id: 'u2', type: '7v7', field: 'Riverside Stadium', time: 'Tomorrow, 7:30 PM', playersConfirmed: 10, totalPlayers: 14 },
      { id: 'u3', type: '11v11', field: 'Olympic Sports Center', time: 'Saturday, 10:00 AM', playersConfirmed: 15, totalPlayers: 22 },
    ],
    history: [
      { id: 'h1', type: '5v5', field: 'Community Center', time: 'Yesterday, 8:00 PM', playersConfirmed: 10, totalPlayers: 10 },
      { id: 'h2', type: '7v7', field: 'University Field', time: 'Last Week, 5:30 PM', playersConfirmed: 14, totalPlayers: 14 },
    ],
    awaiting: [
      { id: 'a1', type: '11v11', field: 'Olympic Sports Center', time: 'Sunday, 3:00 PM', playersConfirmed: 18, totalPlayers: 22 },
    ],
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>
      
      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {matchCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              activeCategory === category.id && styles.activeCategoryTab
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            {category.icon}
            <Text
              style={[
                styles.categoryLabel,
                activeCategory === category.id && styles.activeCategoryLabel
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Match List */}
      <ScrollView style={styles.matchesContainer}>
        {matches[activeCategory].length > 0 ? (
          matches[activeCategory].map((match) => (
            <TouchableOpacity
              key={match.id}
              style={styles.matchCard}
            >
              <View style={styles.matchHeader}>
                <Text style={styles.matchType}>{match.type}</Text>
                {activeCategory === 'awaiting' && (
                  <View style={styles.awaitingBadge}>
                    <Text style={styles.awaitingText}>Pending</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.fieldName}>{match.field}</Text>
              <Text style={styles.matchTime}>{match.time}</Text>
              
              <View style={styles.playersContainer}>
                <View style={styles.playersProgressContainer}>
                  <View 
                    style={[
                      styles.playersProgress,
                      { width: `${(match.playersConfirmed / match.totalPlayers) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.playersText}>
                  {match.playersConfirmed}/{match.totalPlayers} players
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No matches found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 50,
    marginBottom: 24,
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#1a1d23',
  },
  activeCategoryTab: {
    backgroundColor: '#374151',
  },
  categoryLabel: {
    color: '#9ca3af',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  matchesContainer: {
    flex: 1,
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
  awaitingBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  awaitingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  matchTime: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 16,
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playersProgressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginRight: 12,
  },
  playersProgress: {
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  playersText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});