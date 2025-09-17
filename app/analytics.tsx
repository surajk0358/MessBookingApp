// app/analytics.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { API, User } from '../utils/api';
import { getUserData } from '../utils/storage';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  orderTrends: {
    daily: number[];
    weekly: number[];
    labels: string[];
  };
  topItems: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  customerInsights: {
    newCustomers: number;
    returningCustomers: number;
    averageOrderValue: number;
    customerSatisfaction: number;
  };
  performanceMetrics: {
    orderFulfillmentRate: number;
    averagePreparationTime: number;
    cancelationRate: number;
  };
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
      
      if (userData?._id) {
        // Mock data - replace with actual API call
        const analyticsData: AnalyticsData = {
          orderTrends: {
            daily: [12, 19, 8, 25, 22, 18, 15],
            weekly: [85, 120, 95, 140, 110, 98, 125],
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          topItems: [
            { name: 'Chicken Curry', orders: 45, revenue: 13500 },
            { name: 'Dal Rice', orders: 38, revenue: 7600 },
            { name: 'Biryani', orders: 32, revenue: 12800 },
            { name: 'Roti Set', orders: 28, revenue: 5600 }
          ],
          customerInsights: {
            newCustomers: 24,
            returningCustomers: 156,
            averageOrderValue: 285,
            customerSatisfaction: 4.3
          },
          performanceMetrics: {
            orderFulfillmentRate: 94.5,
            averagePreparationTime: 28,
            cancelationRate: 3.2
          }
        };
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 20 }}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentData = selectedPeriod === 'daily' ? analytics?.orderTrends.daily : analytics?.orderTrends.weekly;
  const maxValue = Math.max(...(currentData || [0]));

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
              onPress={() => router.push('/owner')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>📊 Analytics</Text>
            <Text style={styles.subtitle}>Business insights and performance</Text>
          </View>

          {/* Order Trends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Trends</Text>
            
            <View style={styles.periodSelector}>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'daily' && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod('daily')}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === 'daily' && styles.periodButtonTextActive]}>
                  Daily
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'weekly' && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod('weekly')}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === 'weekly' && styles.periodButtonTextActive]}>
                  Weekly
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.chart}>
                {currentData?.map((value, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { height: (value / maxValue) * 120 }
                      ]} 
                    />
                    <Text style={styles.barValue}>{value}</Text>
                    <Text style={styles.barLabel}>{analytics?.orderTrends.labels[index]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Top Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Selling Items</Text>
            
            {analytics?.topItems.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStats}>{item.orders} orders • ₹{item.revenue}</Text>
                </View>
                <View style={styles.itemProgress}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${(item.orders / analytics.topItems[0].orders) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Customer Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Insights</Text>
            
            <View style={styles.insightGrid}>
              <View style={styles.insightCard}>
                <Text style={styles.insightNumber}>{analytics?.customerInsights.newCustomers}</Text>
                <Text style={styles.insightLabel}>New Customers</Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightNumber}>{analytics?.customerInsights.returningCustomers}</Text>
                <Text style={styles.insightLabel}>Returning</Text>
              </View>
            </View>

            <View style={styles.insightGrid}>
              <View style={styles.insightCard}>
                <Text style={styles.insightNumber}>₹{analytics?.customerInsights.averageOrderValue}</Text>
                <Text style={styles.insightLabel}>Avg Order Value</Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightNumber}>⭐ {analytics?.customerInsights.customerSatisfaction}</Text>
                <Text style={styles.insightLabel}>Satisfaction</Text>
              </View>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Order Fulfillment Rate</Text>
              <View style={styles.metricRow}>
                <View style={[styles.metricBar, { width: `${analytics?.performanceMetrics.orderFulfillmentRate}%` }]} />
                <Text style={styles.metricValue}>{analytics?.performanceMetrics.orderFulfillmentRate}%</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Average Preparation Time</Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricValue}>{analytics?.performanceMetrics.averagePreparationTime} mins</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Cancelation Rate</Text>
              <View style={styles.metricRow}>
                <View style={[styles.metricBar, styles.metricBarDanger, { width: `${analytics?.performanceMetrics.cancelationRate * 10}%` }]} />
                <Text style={styles.metricValue}>{analytics?.performanceMetrics.cancelationRate}%</Text>
              </View>
            </View>
          </View>

          {/* Export Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Export Reports</Text>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📄</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Download PDF Report</Text>
                <Text style={styles.actionSubtitle}>Get detailed analytics report</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📊</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Export to Excel</Text>
                <Text style={styles.actionSubtitle}>Raw data for analysis</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#4F46E5',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: 160,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    backgroundColor: '#4F46E5',
    width: 20,
    borderRadius: 4,
    marginBottom: 5,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemStats: {
    fontSize: 14,
    color: '#64748B',
  },
  itemProgress: {
    width: 60,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginLeft: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  insightGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  insightNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  insightLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  metricCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricBar: {
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
    flex: 1,
    marginRight: 10,
  },
  metricBarDanger: {
    backgroundColor: '#EF4444',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 60,
    textAlign: 'right',
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
});