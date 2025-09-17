
//app/consumer.tsx
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConsumerDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>👤</Text>
            <Text style={styles.title}>Consumer Dashboard</Text>
            <Text style={styles.subtitle}>Welcome to MessApp!</Text>
          </View>

          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Good to see you!</Text>
            <Text style={styles.welcomeText}>
              Discover the best mess services in your area and enjoy delicious, 
              homemade meals delivered fresh to your doorstep.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity
  style={[styles.actionCard, styles.primaryCard]}
  onPress={() => router.push('/browse-messes')}
>
  <View style={styles.actionIcon}>
    <Text style={styles.actionEmoji}>🍽️</Text>
  </View>
  <View style={styles.actionContent}>
    <Text style={styles.actionTitle}>Browse Mess Options</Text>
    <Text style={styles.actionSubtitle}>Find local mess services near you</Text>
  </View>
  <Text style={styles.actionArrow}>→</Text>
</TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} 
            onPress={() => router.push('/view-menus')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📋</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>View Menus</Text>
                <Text style={styles.actionSubtitle}>Check today's meal options</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} 
              onPress={() => router.push('/my-bookings')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📅</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>My Bookings</Text>
                <Text style={styles.actionSubtitle}>View your meal bookings</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}
            onPress={() => router.push('/reviews-ratings')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>⭐</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Reviews & Ratings</Text>
                <Text style={styles.actionSubtitle}>Rate your meal experience</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/role-selection')}
          >
            <Text style={styles.backButtonText}>← Back to Role Selection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  emoji: {
    fontSize: 70,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  welcomeCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  actionArrow: {
    fontSize: 18,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});