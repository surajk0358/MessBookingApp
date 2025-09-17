// app/orders.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { API, User } from '../utils/api';
import { getUserData } from '../utils/storage';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderTime: string;
  deliveryTime?: string;
  customerPhone: string;
  specialInstructions?: string;
}

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
      
      if (userData?._id) {
        // Mock data - replace with actual API call
        const ordersData: Order[] = [
          {
            _id: '1',
            orderNumber: 'ORD001',
            customerName: 'Rahul Sharma',
            items: [
              { name: 'Chicken Curry', quantity: 1, price: 300 },
              { name: 'Rice', quantity: 2, price: 50 }
            ],
            totalAmount: 400,
            status: 'pending',
            orderTime: '2024-01-15T10:30:00Z',
            customerPhone: '+91 9876543210',
            specialInstructions: 'Less spicy please'
          },
          {
            _id: '2',
            orderNumber: 'ORD002',
            customerName: 'Priya Patel',
            items: [
              { name: 'Dal Rice', quantity: 1, price: 200 },
              { name: 'Papad', quantity: 2, price: 20 }
            ],
            totalAmount: 240,
            status: 'preparing',
            orderTime: '2024-01-15T11:00:00Z',
            customerPhone: '+91 9876543211'
          },
          {
            _id: '3',
            orderNumber: 'ORD003',
            customerName: 'Amit Kumar',
            items: [
              { name: 'Biryani', quantity: 2, price: 400 }
            ],
            totalAmount: 800,
            status: 'ready',
            orderTime: '2024-01-15T09:45:00Z',
            customerPhone: '+91 9876543212'
          }
        ];
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error loading orders data:', error);
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
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'preparing': return '#8B5CF6';
      case 'ready': return '#10B981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '🍽️';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    Alert.alert(
      'Update Order Status',
      `Are you sure you want to mark this order as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            setOrders(orders.map(order => 
              order._id === orderId ? { ...order, status: newStatus } : order
            ));
          }
        }
      ]
    );
  };

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 20 }}>Loading orders...</Text>
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>📦 Orders</Text>
            <Text style={styles.subtitle}>Manage customer orders</Text>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('all')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>
                  All ({orders.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'pending' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('pending')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'pending' && styles.filterButtonTextActive]}>
                  Pending ({orders.filter(o => o.status === 'pending').length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'preparing' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('preparing')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'preparing' && styles.filterButtonTextActive]}>
                  Preparing ({orders.filter(o => o.status === 'preparing').length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedFilter === 'ready' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('ready')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'ready' && styles.filterButtonTextActive]}>
                  Ready ({orders.filter(o => o.status === 'ready').length})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Orders List */}
          <View style={styles.section}>
            {filteredOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No orders found</Text>
                <Text style={styles.emptyStateSubtext}>Orders will appear here when customers place them</Text>
              </View>
            ) : (
              filteredOrders.map((order) => (
                <View key={order._id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                      <Text style={styles.customerName}>{order.customerName}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                      <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
                      <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                  </View>

                  <View style={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <Text key={index} style={styles.orderItem}>
                        {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.orderDetails}>
                    <Text style={styles.orderTime}>
                      {new Date(order.orderTime).toLocaleTimeString()}
                    </Text>
                    <Text style={styles.orderTotal}>₹{order.totalAmount}</Text>
                  </View>

                  {order.specialInstructions && (
                    <View style={styles.instructionsContainer}>
                      <Text style={styles.instructionsLabel}>Special Instructions:</Text>
                      <Text style={styles.instructionsText}>{order.specialInstructions}</Text>
                    </View>
                  )}

                  <View style={styles.orderActions}>
                    {order.status === 'pending' && (
                      <>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.confirmButton]}
                          onPress={() => updateOrderStatus(order._id, 'preparing')}
                        >
                          <Text style={styles.actionButtonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.rejectButton]}
                          onPress={() => updateOrderStatus(order._id, 'cancelled')}
                        >
                          <Text style={styles.actionButtonText}>Reject</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.readyButton]}
                        onPress={() => updateOrderStatus(order._id, 'ready')}
                      >
                        <Text style={styles.actionButtonText}>Mark Ready</Text>
                      </TouchableOpacity>
                    )}
                    {order.status === 'ready' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.deliveredButton]}
                        onPress={() => updateOrderStatus(order._id, 'delivered')}
                      >
                        <Text style={styles.actionButtonText}>Mark Delivered</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.actionButton, styles.callButton]}>
                      <Text style={styles.actionButtonText}>📞 Call</Text>
                    </TouchableOpacity>
                   
                  </View>
                </View>
              ))
            )}
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
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterButtonActive: {
    backgroundColor: 'white',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#4F46E5',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    marginRight: 5,
    fontSize: 14,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderTime: {
    fontSize: 12,
    color: '#666',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionsContainer: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  instructionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#A16207',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  readyButton: {
    backgroundColor: '#8B5CF6',
  },
  deliveredButton: {
    backgroundColor: '#059669',
  },
  callButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});