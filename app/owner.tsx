// app/owner/index.tsx - Updated with proper auth integration
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { getUserData, getRole, clearAllData } from '../utils/storage';
import { API } from '../utils/api';

interface OwnerData {
  id: string;
  username: string;
  email: string;
  mobile: string;
  role: string;
  profile?: {
    messName?: string;
    ownerName?: string;
    messAddress?: string;
    isVerified?: boolean;
  };
}

interface MessData {
  _id: string;
  name: string;
  address: {
    city: string;
    state: string;
  };
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
}

export default function OwnerDashboard() {
  const [user, setUser] = useState<OwnerData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [messes, setMesses] = useState<MessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      const userRole = await getRole();
      
      if (!userData || userRole !== 'owner') {
        Alert.alert(
          'Access Error',
          'Please login as a mess owner to access this page.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
        return;
      }

      setUser(userData);
      
      if (userData?.id) {
        try {
          // Load owner statistics and messes
          const [ownerStats, ownerMesses] = await Promise.all([
            API.getOwnerStats(userData.id).catch(() => ({ success: false })),
            API.getMessesByOwner(userData.id).catch(() => ({ success: false, data: [] }))
          ]);
          
          if (ownerStats.success) {
            setStats(ownerStats.data || {
              todayOrders: 0,
              monthlyRevenue: 0,
              activeSubscriptions: 0,
              totalCustomers: 0
            });
          }

          if (ownerMesses.success) {
            setMesses(ownerMesses.data || []);
          }
        } catch (error) {
          console.error('Error loading owner data:', error);
          // Set default values if API calls fail
          setStats({
            todayOrders: 0,
            monthlyRevenue: 0,
            activeSubscriptions: 0,
            totalCustomers: 0
          });
          setMesses([]);
        }
      }
    } catch (error) {
      console.error('Error loading owner data:', error);
      Alert.alert(
        'Error', 
        'Failed to load dashboard data. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => loadData()
          },
          {
            text: 'Logout',
            onPress: async () => {
              await clearAllData();
              router.replace('/');
            }
          }
        ]
      );
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

  const handleMessPress = (mess: MessData) => {
    router.push({
      pathname: '/mess-details',
      params: { messId: mess._id, isOwner: 'true' }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 20, fontSize: 16 }}>
            Loading your business dashboard...
          </Text>
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
            <Text style={styles.emoji}>👨‍🍳</Text>
            <Text style={styles.title}>Business Dashboard</Text>
            <Text style={styles.subtitle}>
              Welcome {user?.profile?.ownerName || user?.username || 'Owner'}!
            </Text>
            {user?.profile?.messName && (
              <Text style={styles.messName}>{user.profile.messName}</Text>
            )}
          </View>

          {/* Business Stats */}
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

          {/* Verification Status */}
          {user?.profile && (
            <View style={styles.verificationCard}>
              <Text style={styles.verificationTitle}>Account Status</Text>
              <View style={styles.verificationStatus}>
                <Text style={styles.verificationText}>
                  {user.profile.isVerified ? '✅ Verified Business' : '⏳ Verification Pending'}
                </Text>
                {!user.profile.isVerified && (
                  <TouchableOpacity style={styles.verifyButton}>
                    <Text style={styles.verifyButtonText}>Complete Verification</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Your Messes */}
          {messes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Messes</Text>
              {messes.map((mess) => (
                <TouchableOpacity 
                  key={mess._id} 
                  style={styles.messCard}
                  onPress={() => handleMessPress(mess)}
                >
                  <View style={styles.messInfo}>
                    <Text style={styles.messCardName}>{mess.name}</Text>
                    <Text style={styles.messLocation}>
                      {mess.address.city}, {mess.address.state}
                    </Text>
                    <Text style={styles.messRating}>
                      ⭐ {mess.rating.average.toFixed(1)} ({mess.rating.count} reviews)
                    </Text>
                    <Text style={[
                      styles.messStatus,
                      { color: mess.isActive ? '#10B981' : '#EF4444' }
                    ]}>
                      {mess.isActive ? '✅ Active' : '❌ Inactive'}
                    </Text>
                  </View>
                  <Text style={styles.actionArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Business Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Management</Text>
            
            <TouchableOpacity 
              style={[styles.actionCard, styles.primaryCard]}
              onPress={() => router.push('./profile')}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🏪</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Mess Profile</Text>
                <Text style={styles.actionSubtitle}>Update your mess information</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/menu-management')}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🍽️</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Menu Management</Text>
                <Text style={styles.actionSubtitle}>Add and update your menu items</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/orders')}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📦</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Orders</Text>
                <Text style={styles.actionSubtitle}>View and manage customer orders</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/analytics')}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📊</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Analytics</Text>
                <Text style={styles.actionSubtitle}>View business insights</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/earnings')}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>💰</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Earnings</Text>
                <Text style={styles.actionSubtitle}>Track your revenue and payments</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/settings')}
            >
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

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('./profile')}
            >
              <Text style={styles.profileButtonText}>View Profile</Text>
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
    marginBottom: 5,
  },
  messName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
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
  verificationCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  verificationStatus: {
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  messCardName: {
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
    gap: 15,
    marginTop: 20,
  },
  profileButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(220, 38, 38, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.9)',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
},
})

// // app/owner(mess-owner).tsx
// import { router } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native';
// import { API, User, Mess } from '../utils/api';
// import { getUserData, clearAllData } from '../utils/storage';

// export default function OwnerDashboard() {
//   const [user, setUser] = useState<User | null>(null);
//   const [stats, setStats] = useState<any>(null);
//   const [messes, setMesses] = useState<Mess[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const userData = await getUserData();
//       setUser(userData);
      
//       if (userData?._id) {
//         const [ownerStats, ownerMesses] = await Promise.all([
//           API.getOwnerStats(userData._id),
//           API.getOwnerMesses(userData._id)
//         ]);
        
//         setStats(ownerStats);
//         setMesses(ownerMesses);
//       }
//     } catch (error) {
//       console.error('Error loading owner data:', error);
//       Alert.alert('Error', 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await clearAllData();
//             router.replace('/');
//           }
//         }
//       ]
//     );
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
//           <ActivityIndicator size="large" color="white" />
//           <Text style={{ color: 'white', marginTop: 20 }}>Loading dashboard...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView 
//         style={styles.scrollView} 
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//       >
//         <View style={styles.content}>
//           <View style={styles.header}>
//             <Text style={styles.emoji}>🏪</Text>
//             <Text style={styles.title}>Mess Owner Dashboard</Text>
//             <Text style={styles.subtitle}>
//               Welcome {user?.username || 'Owner'}!
//             </Text>
//           </View>

//           <View style={styles.statsContainer}>
//             <View style={styles.statCard}>
//               <Text style={styles.statNumber}>{stats?.todayOrders || 0}</Text>
//               <Text style={styles.statLabel}>Today's Orders</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={styles.statNumber}>₹{stats?.monthlyRevenue || 0}</Text>
//               <Text style={styles.statLabel}>Monthly Revenue</Text>
//             </View>
//           </View>

//           <View style={styles.statsContainer}>
//             <View style={styles.statCard}>
//               <Text style={styles.statNumber}>{stats?.activeSubscriptions || 0}</Text>
//               <Text style={styles.statLabel}>Active Customers</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={styles.statNumber}>{messes.length}</Text>
//               <Text style={styles.statLabel}>Your Messes</Text>
//             </View>
//           </View>

//           {messes.length > 0 && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Your Messes</Text>
//               {messes.map((mess) => (
//                 <View key={mess._id} style={styles.messCard}>
//                   <View style={styles.messInfo}>
//                     <Text style={styles.messName}>{mess.name}</Text>
//                     <Text style={styles.messLocation}>{mess.address.city}, {mess.address.state}</Text>
//                     <Text style={styles.messRating}>⭐ {mess.rating.average} ({mess.rating.count} reviews)</Text>
//                     <Text style={styles.messStatus}>
//                       Status: {mess.isActive ? '✅ Active' : '❌ Inactive'}
//                     </Text>
//                   </View>
//                   <Text style={styles.actionArrow}>→</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Business Management</Text>
            
//             <TouchableOpacity style={[styles.actionCard, styles.primaryCard]}
//             onPress={() => router.push('./')}>
//               <View style={styles.actionIcon}>
//                 <Text style={styles.actionEmoji}>🏪</Text>
//               </View>
//               <View style={styles.actionContent}>
//                 <Text style={styles.actionTitle}>Mess Profile</Text>
//                 <Text style={styles.actionSubtitle}>Update your mess information</Text>
//               </View>
//               <Text style={styles.actionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.actionCard}
//             onPress={() => router.push('/#')}>
//               <View style={styles.actionIcon}>
//                 <Text style={styles.actionEmoji}>🍽️</Text>
//               </View>
//               <View style={styles.actionContent}>
//                 <Text style={styles.actionTitle}>Menu Management</Text>
//                 <Text style={styles.actionSubtitle}>Add and update your menu items</Text>
//               </View>
//               <Text style={styles.actionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.actionCard}
//             onPress={() => router.replace('/orders')}>
//               <View style={styles.actionIcon}>
//                 <Text style={styles.actionEmoji}>📦</Text>
//               </View>
//               <View style={styles.actionContent}>
//                 <Text style={styles.actionTitle}>Orders</Text>
//                 <Text style={styles.actionSubtitle}>View and manage customer orders</Text>
//               </View>
//               <Text style={styles.actionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.actionCard}
//             onPress={() => router.replace('./analytics')}>
//               <View style={styles.actionIcon}>
//                 <Text style={styles.actionEmoji}>📊</Text>
//               </View>
//               <View style={styles.actionContent}>
//                 <Text style={styles.actionTitle}>Analytics</Text>
//                 <Text style={styles.actionSubtitle}>View business insights</Text>
//               </View>
//               <Text style={styles.actionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.actionCard}
//             onPress={() => router.replace('./')}>
//               <View style={styles.actionIcon}>
//                 <Text style={styles.actionEmoji}>💰</Text>
//               </View>
//               <View style={styles.actionContent}>
//                 <Text style={styles.actionTitle}>Earnings</Text>
//                 <Text style={styles.actionSubtitle}>Track your revenue and payments</Text>
//               </View>
//               <Text style={styles.actionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.actionCard}
//             onPress={() => router.replace('/')}>
//               <View style={styles.actionIcon}>
//                 <Text style={styles.actionEmoji}>⚙️</Text>
//               </View>
//               <View style={styles.actionContent}>
//                 <Text style={styles.actionTitle}>Settings</Text>
//                 <Text style={styles.actionSubtitle}>Configure business settings</Text>
//               </View>
//               <Text style={styles.actionArrow}>→</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.buttonRow}>
//             <TouchableOpacity 
//               style={styles.backButton}
//               onPress={() => router.replace('/role-selection')}
//             >
//               <Text style={styles.backButtonText}>← Change Role</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.logoutButton}
//               onPress={handleLogout}
//             >
//               <Text style={styles.logoutButtonText}>Logout</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#4F46E5',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//     paddingBottom: 40,
//   },
//   header: {
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 25,
//   },
//   emoji: {
//     fontSize: 70,
//     marginBottom: 20,
//     textShadowColor: 'rgba(0,0,0,0.1)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.8)',
//     textAlign: 'center',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     gap: 15,
//     marginBottom: 25,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 5,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     textAlign: 'center',
//   },
//   section: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 25,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   messCard: {
//     backgroundColor: '#F8FAFC',
//     padding: 18,
//     borderRadius: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   messInfo: {
//     flex: 1,
//   },
//   messName: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   messLocation: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   messRating: {
//     fontSize: 14,
//     color: '#F59E0B',
//     marginBottom: 4,
//   },
//   messStatus: {
//     fontSize: 14,
//     color: '#10B981',
//     fontWeight: '600',
//   },
//   actionCard: {
//     backgroundColor: '#F8FAFC',
//     padding: 18,
//     borderRadius: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   primaryCard: {
//     backgroundColor: '#FEF3C7',
//     borderColor: '#FDE68A',
//   },
//   actionIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 12,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   actionEmoji: {
//     fontSize: 24,
//   },
//   actionContent: {
//     flex: 1,
//   },
//   actionTitle: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   actionSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 18,
//   },
//   actionArrow: {
//     fontSize: 18,
//     color: '#4F46E5',
//     fontWeight: 'bold',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   backButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   backButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   logoutButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 25,
//     backgroundColor: 'rgba(220, 38, 38, 0.8)',
//     borderWidth: 1,
//     borderColor: 'rgba(220, 38, 38, 0.9)',
//   },
//   logoutButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });