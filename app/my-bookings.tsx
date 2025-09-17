// app/my-bookings.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { API, Order } from '../utils/api';
import { getUserData } from '../utils/storage';

export default function MyBookingsScreen() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions'>('orders');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);

      if (userData?._id) {
        const [ordersData, subscriptionsData] = await Promise.all([
          API.getOrders({ customerId: userData._id }),
          API.getUserSubscriptions(userData._id),
        ]);

        setOrders(ordersData.orders || []);
        setSubscriptions(subscriptionsData || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'preparing': return '#8B5CF6';
      case 'ready': return '#10B981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#EF4444';
      case 'active': return '#10B981';
      case 'expired': return '#9CA3AF';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={{ marginTop: 20 }}>Loading your bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders ({orders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'subscriptions' && styles.activeTab]}
          onPress={() => setActiveTab('subscriptions')}
        >
          <Text style={[styles.tabText, activeTab === 'subscriptions' && styles.activeTabText]}>
            Subscriptions ({subscriptions.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'orders' && (
          <View>
            {orders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No orders yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Start by placing your first order!
                </Text>
                <TouchableOpacity
                  style={styles.browseMesses}
                  onPress={() => router.push('/browse-messes')}
                >
                  <Text style={styles.browseMessesText}>Browse Messes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              orders.map((order) => (
                <View key={order._id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderMeal}>
                      {order.mealType.charAt(0).toUpperCase() + order.mealType.slice(1)}
                    </Text>
                    <Text
                      style={[
                        styles.orderStatus,
                        { color: getStatusColor(order.status) }
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                  <Text style={styles.orderItems}>
                    {Array.isArray(order.items) ? order.items.join(', ') : order.items}
                  </Text>
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderAmount}>₹{order.amount}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.paymentStatus}>
                    Payment: {order.paymentStatus}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'subscriptions' && (
          <View>
            {subscriptions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No subscriptions yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Subscribe to a mess for regular meals!
                </Text>
                <TouchableOpacity
                  style={styles.browseMesses}
                  onPress={() => router.push('/browse-messes')}
                >
                  <Text style={styles.browseMessesText}>Browse Messes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              subscriptions.map((subscription) => (
                <View key={subscription._id} style={styles.subscriptionCard}>
                  <View style={styles.subscriptionHeader}>
                    <Text style={styles.subscriptionMess}>
                      {subscription.messId?.name || 'Mess'}
                    </Text>
                    <Text
                      style={[
                        styles.subscriptionStatus,
                        { color: getStatusColor(subscription.status) }
                      ]}
                    >
                      {subscription.status}
                    </Text>
                  </View>

                  <Text style={styles.subscriptionPlan}>
                    Plan: {subscription.planId?.name || 'N/A'}
                  </Text>

                  <View style={styles.subscriptionDates}>
                    <Text style={styles.dateText}>
                      From: {new Date(subscription.startDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.dateText}>
                      To: {new Date(subscription.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginRight: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  browseMesses: {
    marginTop: 16,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  browseMessesText: {
    color: 'white',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderMeal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderItems: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  paymentStatus: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 8,
  },
  subscriptionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  subscriptionMess: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subscriptionStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  subscriptionPlan: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  subscriptionDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
