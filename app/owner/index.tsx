import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { signOutUser } from '../../utils/auth';
import { clearRole } from '../../utils/storage';

export default function OwnerDashboard() {
  const handleSignOut = async () => {
    await signOutUser();
    await clearRole();
    router.replace('/');
  };

  const handleGoBack = () => {
    router.back(); // 👈 This takes user back to previous screen
  };

  const todayStats = {
    orders: 45,
    revenue: 5400,
    pendingOrders: 12,
    activeCustomers: 156,
  };

  const recentOrders = [
    { id: 1, customer: 'Suraj Kokate', items: 'Lunch + Dinner', amount: 240, status: 'Delivered' },
    { id: 2, customer: 'Ashok kamble', items: 'Lunch Only', amount: 120, status: 'Preparing' },
    { id: 3, customer: 'Mahesh Makane', items: 'Dinner Only', amount: 140, status: 'Pending' },
    { id: 4, customer: 'Shraddha Nevase', items: 'Lunch + Dinner', amount: 240, status: 'Delivered' },
    { id: 5, customer: 'Ketan Sir', items: 'Lunch Only', amount: 120, status: 'Preparing' },
    { id: 6, customer: 'Ajit Sir', items: 'Dinner Only', amount: 140, status: 'Pending' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        {/* Title and Greeting */}
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome Back! 👋</Text>
          <Text style={styles.title}>Mess Dashboard</Text>
        </View>

        {/* Sign Out */}
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={[styles.statNumber, { color: '#059669' }]}>{todayStats.orders}</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>₹{todayStats.revenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.statIcon}>⏰</Text>
            <Text style={[styles.statNumber, { color: '#2563EB' }]}>{todayStats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={[styles.statNumber, { color: '#7C3AED' }]}>{todayStats.activeCustomers}</Text>
            <Text style={styles.statLabel}>Active Customers</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>View Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={styles.actionText}>Update Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Customers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📈</Text>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.customerName}>{order.customer}</Text>
                <Text style={styles.orderAmount}>₹{order.amount}</Text>
              </View>
              <Text style={styles.orderItems}>{order.items}</Text>
              <View style={styles.orderFooter}>
                <Text
                  style={[
                    styles.orderStatus,
                    order.status === 'Delivered' && styles.statusDelivered,
                    order.status === 'Preparing' && styles.statusPreparing,
                    order.status === 'Pending' && styles.statusPending,
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  signOutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signOutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionCard: {
    width: '47%',
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
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  orderItems: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  orderFooter: {
    alignItems: 'flex-start',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDelivered: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusPreparing: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  statusPending: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
});
