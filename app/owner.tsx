// app/owner.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { API, User, Mess } from '../utils/api';
import { getUserData, clearAllData } from '../utils/storage';

export default function OwnerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
      
      if (userData?._id) {
        const [ownerStats, ownerMesses] = await Promise.all([
          API.getOwnerStats(userData._id),
          API.getOwnerMesses(userData._id)
        ]);
        
        setStats(ownerStats);
        setMesses(ownerMesses);
      }
    } catch (error) {
      console.error('Error loading owner data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 20 }}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🏪</Text>
            <Text style={styles.title}>Mess Owner Dashboard</Text>
            <Text style={styles.subtitle}>
              Welcome {user?.username || 'Owner'}!
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats?.todayOrders || 0}</Text>
              <Text style={styles.statLabel}>Today's Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>₹{stats?.monthlyRevenue || 0}</Text>
              <Text style={styles.statLabel}>Monthly Revenue</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats?.activeSubscriptions || 0}</Text>
              <Text style={styles.statLabel}>Active Customers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{messes.length}</Text>
              <Text style={styles.statLabel}>Your Messes</Text>
            </View>
          </View>

          {messes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Messes</Text>
              {messes.map((mess) => (
                <View key={mess._id} style={styles.messCard}>
                  <View style={styles.messInfo}>
                    <Text style={styles.messName}>{mess.name}</Text>
                    <Text style={styles.messLocation}>{mess.address.city}, {mess.address.state}</Text>
                    <Text style={styles.messRating}>⭐ {mess.rating.average} ({mess.rating.count} reviews)</Text>
                    <Text style={styles.messStatus}>
                      Status: {mess.isActive ? '✅ Active' : '❌ Inactive'}
                    </Text>
                  </View>
                  <Text style={styles.actionArrow}>→</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Management</Text>
            
            <TouchableOpacity style={[styles.actionCard, styles.primaryCard]}
            onPress={() => router.push('./')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🏪</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Mess Profile</Text>
                <Text style={styles.actionSubtitle}>Update your mess information</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}
            onPress={() => router.push('/#')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🍽️</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Menu Management</Text>
                <Text style={styles.actionSubtitle}>Add and update your menu items</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}
            onPress={() => router.replace('/orders')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📦</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Orders</Text>
                <Text style={styles.actionSubtitle}>View and manage customer orders</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}
            onPress={() => router.replace('./analytics')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📊</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Analytics</Text>
                <Text style={styles.actionSubtitle}>View business insights</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}
            onPress={() => router.replace('./')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>💰</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Earnings</Text>
                <Text style={styles.actionSubtitle}>Track your revenue and payments</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}
            onPress={() => router.replace('/')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>⚙️</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Settings</Text>
                <Text style={styles.actionSubtitle}>Configure business settings</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.replace('/role-selection')}
            >
              <Text style={styles.backButtonText}>← Change Role</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 25,
  },
  emoji: {
    fontSize: 70,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 26,
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
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
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
  messCard: {
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messInfo: {
    flex: 1,
  },
  messName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  messLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  messRating: {
    fontSize: 14,
    color: '#F59E0B',
    marginBottom: 4,
  },
  messStatus: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
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
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  backButton: {
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
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(220, 38, 38, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.9)',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});