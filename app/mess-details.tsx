// app/mess-details.tsx
import { router, useLocalSearchParams } from 'expo-router';
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
import { API, Mess } from '../utils/api';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  isVeg: boolean;
  category: string;
}

interface Menu {
  _id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  items: MenuItem[];
}

export default function ViewMenusScreen() {
  const { messId } = useLocalSearchParams<{ messId: string }>();
  const [mess, setMess] = useState<Mess | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');

  useEffect(() => {
    if (messId) {
      loadData();
    }
  }, [messId]);

  const loadData = async () => {
    try {
      if (!messId) return;

      const [messData, menusData] = await Promise.all([
        API.getMess(messId),
        API.getMenus(messId, selectedDate)
      ]);

      setMess(messData);
      setMenus(menusData || []);
    } catch (error) {
      console.error('Error loading menu data:', error);
      Alert.alert('Error', 'Failed to load menu information');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCurrentMenu = () => {
    return menus.find(menu => 
      menu.date === selectedDate && menu.mealType === selectedMealType
    );
  };

  const handleOrderMeal = (menu: Menu) => {
    Alert.alert(
      'Order Meal',
      `Would you like to order ${selectedMealType} for ${new Date(selectedDate).toLocaleDateString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Order Now', 
          onPress: () => {
            // Navigate to order placement or handle order logic
            router.push({
              pathname: '/place-order',
              params: {
                messId,
                menuId: menu._id,
                mealType: selectedMealType,
                date: selectedDate
              }
            });
          }
        }
      ]
    );
  };

  const getNextDates = (days: number = 7) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    return dates;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={{ marginTop: 20 }}>Loading menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentMenu = getCurrentMenu();
  const dates = getNextDates();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>View Menus</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {mess && (
          <View style={styles.messInfo}>
            <Text style={styles.messName}>{mess.name}</Text>
            <Text style={styles.messAddress}>{mess.address.city}</Text>
            <View style={styles.messTags}>
              <View style={[styles.tag, { backgroundColor: mess.foodType === 'veg' ? '#10B981' : mess.foodType === 'non-veg' ? '#EF4444' : '#8B5CF6' }]}>
                <Text style={styles.tagText}>{mess.foodType}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>⭐ {mess.rating}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date.value}
                style={[
                  styles.dateChip,
                  selectedDate === date.value && styles.activeDateChip
                ]}
                onPress={() => setSelectedDate(date.value)}
              >
                <Text style={[
                  styles.dateText,
                  selectedDate === date.value && styles.activeDateText
                ]}>
                  {date.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeContainer}>
            {['breakfast', 'lunch', 'dinner'].map((mealType) => (
              <TouchableOpacity
                key={mealType}
                style={[
                  styles.mealTypeChip,
                  selectedMealType === mealType && styles.activeMealTypeChip
                ]}
                onPress={() => setSelectedMealType(mealType as any)}
              >
                <Text style={[
                  styles.mealTypeText,
                  selectedMealType === mealType && styles.activeMealTypeText
                ]}>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>
              {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Menu
            </Text>
            <Text style={styles.menuDate}>
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {currentMenu ? (
            <View>
              {currentMenu.items.map((item) => (
                <View key={item._id} style={styles.menuItem}>
                  <View style={styles.itemInfo}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <View style={[styles.vegIndicator, { backgroundColor: item.isVeg ? '#10B981' : '#EF4444' }]} />
                    </View>
                    {item.description && (
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    )}
                    <Text style={styles.itemCategory}>{item.category}</Text>
                  </View>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => handleOrderMeal(currentMenu)}
              >
                <Text style={styles.orderButtonText}>
                  Order {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noMenuContainer}>
              <Text style={styles.noMenuText}>No menu available</Text>
              <Text style={styles.noMenuSubtext}>
                Menu for {selectedMealType} on {new Date(selectedDate).toLocaleDateString()} is not available yet.
              </Text>
            </View>
          )}
        </View>
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
  messInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  messName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  messAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  messTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  dateScroll: {
    marginBottom: 8,
  },
  dateChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeDateChip: {
    backgroundColor: '#4F46E5',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeDateText: {
    color: 'white',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTypeChip: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeMealTypeChip: {
    backgroundColor: '#4F46E5',
  },
  mealTypeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeMealTypeText: {
    color: 'white',
  },
  menuSection: {
    padding: 20,
  },
  menuHeader: {
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  menuDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  vegIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  orderButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMenuContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noMenuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  noMenuSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});