import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { signOutUser } from '../../utils/auth';
import { clearRole } from '../../utils/storage';

export default function ConsumerDashboard() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      await clearRole();
      router.replace('/'); // Ensure this matches your login/home route
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const messServices = [
    { id: 1, name: 'Famous Mess', price: 120, rating: 4.5, distance: 0.5, location: 'Katraj Chowk' },
    { id: 2, name: 'Kokate Tiffin', price: 100, rating: 4.2, distance: 1.2, location: 'Sighgad Campus' },
    { id: 3, name: 'Home Food', price: 140, rating: 4.8, distance: 0.8, location: 'Swargate' },
    { id: 4, name: 'Tiger Dabba', price: 130, rating: 4.3, distance: 1.5, location: 'Hadapsar' },
    { id: 5, name: 'Home Made Meals', price: 140, rating: 4.8, distance: 0.8, location: 'Narhe' },
    { id: 6, name: 'Student Special Meass', price: 130, rating: 4.3, distance: 1.5, location: 'Ambegao Pathar' },
    { id: 7, name: 'Makane veg-nonveg', price: 140, rating: 4.8, distance: 0.8, location: 'Hinjewadi' },
    { id: 8, name: 'Ashok Misal', price: 130, rating: 4.3, distance: 1.5, location: 'Yewalewadi' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        {/* Header Text */}
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.title}>Find Your Perfect Mess</Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>25+</Text>
            <Text style={styles.statLabel}>Mess Services</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.6⭐</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Mess Services</Text>

        {messServices.map((mess) => (
          <TouchableOpacity key={mess.id} style={styles.messCard}>
            <View style={styles.messHeader}>
              <Text style={styles.messName}>🍛 {mess.name}</Text>
              <Text style={styles.messPrice}>₹{mess.price}/day</Text>
            </View>
            <Text style={styles.messCuisine}>{mess.location}</Text>
            <View style={styles.messFooter}>
              <Text style={styles.messRating}>{mess.rating}⭐</Text>
              <Text style={styles.messDistance}>{mess.distance} km away</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4F46E5',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: { paddingRight: 10 },
  backText: { fontSize: 24, color: 'white', fontWeight: '600' },
  headerCenter: { flex: 1, alignItems: 'center' },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  title: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  signOutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  signOutText: { color: 'white', fontSize: 14, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  statsContainer: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#4F46E5' },
  statLabel: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  messCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  messName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  messPrice: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
  messCuisine: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  messFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  messRating: { fontSize: 14, color: '#F59E0B', fontWeight: '600' },
  messDistance: { fontSize: 14, color: '#6B7280' },
});
