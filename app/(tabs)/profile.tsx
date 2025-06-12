import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ProfileHeader from '@/components/Profile/ProfileHeader';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <ProfileHeader
        username="Alex Rodriguez"
        email="alex.rodriguez@email.com"
        location="Los Angeles, CA"
        rating={4.8}
        matchesPlayed={34}
        teamRating={4.2}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Additional profile content will go here</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 50,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  placeholder: {
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});