// app/subscription.tsx - Subscription management screen
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { API, getUserData } from '../utils/api';

export default function SubscriptionScreen() {
  const { messId } = useLocalSearchParams<{ messId: string }>();
  const [messData, setMessData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, messDetails] = await Promise.all([
        getUserData(),
        API.get(`/messes/${messId}`)
      ]);
      setUser(userData);
      setMessData(messDetails);
      if (messDetails.plans.length > 0) {
        setSelectedPlan(messDetails.plans[0]);
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
      Alert.alert('Error', 'Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user || !selectedPlan) return;

    try {
      setSubscribing(true);
      
      const subscriptionData = {
        messId: messId!,
        planId: selectedPlan._id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + selectedPlan.duration.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentDetails: {
          amount: selectedPlan.pricing.total,
          method: 'wallet'
        }
      };

      await API.createSubscription(user._id, subscriptionData);
      
      Alert.alert(
        'Subscription Created!',
        'Your subscription has been activated successfully. You can now enjoy daily meals.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/consumer')
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      Alert.alert('Subscription Failed', error.message || 'Failed to create subscription. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={{ marginTop: 20 }}>Loading subscription options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!messData?.plans || messData.plans.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.errorText}>No subscription plans available</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Subscribe</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.messInfo}>
          <Text style={styles.messName}>{messData.mess.name}</Text>
          <Text style={styles.messAddress}>
            {messData.mess.address.city}, {messData.mess.address.state}
          </Text>
          <Text style={styles.messRating}>
            ⭐ {messData.mess.rating.average} ({messData.mess.rating.count} reviews)
          </Text>
        </View>

        <View style={styles.planSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          {messData.plans.map((plan: any) => (
            <TouchableOpacity
              key={plan._id}
              style={[
                styles.planCard,
                selectedPlan?._id === plan._id && styles.selectedPlanCard
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>₹{plan.pricing.total}</Text>
              </View>
              
              <Text style={styles.planDescription}>{plan.description}</Text>
              
              <Text style={styles.planDuration}>
                Duration: {plan.duration.days} days ({plan.duration.type})
              </Text>

              <View style={styles.mealsIncluded}>
                <Text style={styles.mealsTitle}>Meals included:</Text>
                <View style={styles.mealsRow}>
                  {plan.mealsIncluded.map((meal: string) => (
                    <Text key={meal} style={styles.mealChip}>
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </Text>
                  ))}
                </View>
              </View>

              {plan.features && plan.features.length > 0 && (
                <View style={styles.featuresSection}>
                  <Text style={styles.featuresTitle}>Features:</Text>
                  {plan.features.map((feature: string, index: number) => (
                    <Text key={index} style={styles.feature}>• {feature}</Text>
                  ))}
                </View>
              )}

              <View style={styles.pricingBreakdown}>
                <Text style={styles.breakdownTitle}>Pricing breakdown:</Text>
                {plan.pricing.breakfast && (
                  <Text style={styles.breakdownItem}>
                    Breakfast: ₹{plan.pricing.breakfast}
                  </Text>
                )}
                {plan.pricing.lunch && (
                  <Text style={styles.breakdownItem}>
                    Lunch: ₹{plan.pricing.lunch}
                  </Text>
                )}
                {plan.pricing.dinner && (
                  <Text style={styles.breakdownItem}>
                    Dinner: ₹{plan.pricing.dinner}
                  </Text>
                )}
              </View>

              {selectedPlan?._id === plan._id && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedText}>✓ Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.sectionTitle}>Subscription Details</Text>
          <Text style={styles.infoText}>Customer: {user.username || user.mobileNumber}</Text>
          <Text style={styles.infoText}>Mobile: {user.mobileNumber}</Text>
          <Text style={styles.infoText}>Current Wallet Balance: ₹{user.walletBalance || 0}</Text>
          {selectedPlan && (
            <>
              <Text style={styles.infoText}>
                Plan Duration: {selectedPlan.duration.days} days
              </Text>
              <Text style={styles.infoText}>
                Start Date: {new Date().toLocaleDateString()}
              </Text>
              <Text style={styles.infoText}>
                End Date: {new Date(Date.now() + selectedPlan.duration.days * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </Text>
            </>
          )}
        </View>

        {selectedPlan && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plan:</Text>
              <Text style={styles.summaryValue}>{selectedPlan.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{selectedPlan.duration.days} days</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Meals:</Text>
              <Text style={styles.summaryValue}>
                {selectedPlan.mealsIncluded.join(', ')}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{selectedPlan.pricing.total}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {selectedPlan && (
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              subscribing && styles.disabledButton
            ]}
            onPress={handleSubscribe}
            disabled={subscribing}
          >
            {subscribing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.subscribeButtonText}>
                Subscribe for ₹{selectedPlan.pricing.total}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  headerBackButton: {
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
  messInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  messName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  messAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  messRating: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  planSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedPlanCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#F8FAFC',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  planDuration: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 12,
  },
  mealsIncluded: {
    marginBottom: 12,
  },
  mealsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  mealsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mealChip: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuresSection: {
    marginBottom: 12,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  feature: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  pricingBreakdown: {
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  breakdownItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  selectedIndicator: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  userInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  actionSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subscribeButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});