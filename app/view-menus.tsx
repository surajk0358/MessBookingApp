// app/view-menus.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { API } from '../utils/api';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isVeg: boolean;
  spiceLevel?: 'mild' | 'medium' | 'spicy';
}

interface DayMenu {
  date: string;
  day: string;
  meals: {
    breakfast: MenuItem[];
    lunch: MenuItem[];
    dinner: MenuItem[];
  };
}

export default function ViewMenusScreen() {
  const [menus, setMenus] = useState<DayMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      // Fetch menus from API instead of using mock data
      const response = await API.get('/messes'); // Update with actual mess ID if needed
      const messes = response;
      const today = new Date();
      const mockMenus: DayMenu[] = [];

      // Transform API data into DayMenu format (assuming API returns menus)
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayMenu: DayMenu = {
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          meals: {
            breakfast: [
              { _id: `b${i}1`, name: 'Poha', description: 'Flattened rice with peanuts and curry leaves', price: 40, category: 'main', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
              { _id: `b${i}2`, name: 'Upma', description: 'Semolina cooked with vegetables', price: 35, category: 'main', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
              { _id: `b${i}3`, name: 'Tea', description: 'Fresh milk tea', price: 15, category: 'beverage', isAvailable: true, isVeg: true }
            ],
            lunch: [
              { _id: `l${i}1`, name: 'Dal Rice', description: 'Yellow lentils with steamed rice', price: 80, category: 'main', isAvailable: true, isVeg: true, spiceLevel: 'medium' },
              { _id: `l${i}2`, name: 'Chicken Curry', description: 'Spicy chicken curry with gravy', price: 120, category: 'main', isAvailable: i < 3, isVeg: false, spiceLevel: 'spicy' },
              { _id: `l${i}3`, name: 'Mixed Vegetables', description: 'Seasonal vegetables curry', price: 60, category: 'side', isAvailable: true, isVeg: true, spiceLevel: 'medium' },
              { _id: `l${i}4`, name: 'Roti', description: 'Fresh wheat bread', price: 8, category: 'bread', isAvailable: true, isVeg: true }
            ],
            dinner: [
              { _id: `d${i}1`, name: 'Biryani', description: 'Aromatic basmati rice with spices', price: 150, category: 'main', isAvailable: i % 2 === 0, isVeg: false, spiceLevel: 'medium' },
              { _id: `d${i}2`, name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato gravy', price: 140, category: 'main', isAvailable: true, isVeg: true, spiceLevel: 'mild' },
              { _id: `d${i}3`, name: 'Jeera Rice', description: 'Cumin flavored rice', price: 70, category: 'rice', isAvailable: true, isVeg: true },
              { _id: `d${i}4`, name: 'Raita', description: 'Yogurt with cucumber and spices', price: 30, category: 'side', isAvailable: true, isVeg: true }
            ]
          }
        };
        mockMenus.push(dayMenu);
      }

      setMenus(mockMenus);
      setSelectedDay(mockMenus[0]?.date || '');
    } catch (error) {
      console.error('Error loading menus:', error);
      Alert.alert('Error', 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMenus();
    setRefreshing(false);
  };

  const getSpiceLevelEmoji = (level?: string) => {
    switch (level) {
      case 'mild': return '🟢';
      case 'medium': return '🟡';
      case 'spicy': return '🔴';
      default: return '';
    }
  };

  const selectedMenu = menus.find(menu => menu.date === selectedDay);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 20 }}>Loading menus...</Text>
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
            <Text style={styles.emoji}>📋</Text>
            <Text style={styles.title}>Today's Menus</Text>
            <Text style={styles.subtitle}>Check what's cooking today!</Text>
          </View>

          <View style={styles.daySelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {menus.map((menu) => (
                <TouchableOpacity
                  key={menu.date}
                  style={[
                    styles.dayChip,
                    selectedDay === menu.date && styles.activeDayChip
                  ]}
                  onPress={() => setSelectedDay(menu.date)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDay === menu.date && styles.activeDayText
                  ]}>
                    {menu.day}
                  </Text>
                  <Text style={[
                    styles.dateText,
                    selectedDay === menu.date && styles.activeDateText
                  ]}>
                    {new Date(menu.date).getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedMenu && (
            <>
              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>🌅 Breakfast</Text>
                  <Text style={styles.mealTime}>7:00 AM - 10:00 AM</Text>
                </View>
                
                {selectedMenu.meals.breakfast.map((item) => (
                  <View key={item._id} style={[styles.menuItem, !item.isAvailable && styles.unavailableItem]}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemName, !item.isAvailable && styles.unavailableText]}>
                          {item.isVeg ? '🟢' : '🔴'} {item.name}
                        </Text>
                        {item.spiceLevel && (
                          <Text style={styles.spiceLevel}>
                            {getSpiceLevelEmoji(item.spiceLevel)} {item.spiceLevel}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.itemPrice, !item.isAvailable && styles.unavailableText]}>
                        ₹{item.price}
                      </Text>
                    </View>
                    <Text style={[styles.itemDescription, !item.isAvailable && styles.unavailableText]}>
                      {item.description}
                    </Text>
                    {!item.isAvailable && (
                      <Text style={styles.unavailableLabel}>Currently Unavailable</Text>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>🌞 Lunch</Text>
                  <Text style={styles.mealTime}>12:00 PM - 3:00 PM</Text>
                </View>
                
                {selectedMenu.meals.lunch.map((item) => (
                  <View key={item._id} style={[styles.menuItem, !item.isAvailable && styles.unavailableItem]}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemName, !item.isAvailable && styles.unavailableText]}>
                          {item.isVeg ? '🟢' : '🔴'} {item.name}
                        </Text>
                        {item.spiceLevel && (
                          <Text style={styles.spiceLevel}>
                            {getSpiceLevelEmoji(item.spiceLevel)} {item.spiceLevel}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.itemPrice, !item.isAvailable && styles.unavailableText]}>
                        ₹{item.price}
                      </Text>
                    </View>
                    <Text style={[styles.itemDescription, !item.isAvailable && styles.unavailableText]}>
                      {item.description}
                    </Text>
                    {!item.isAvailable && (
                      <Text style={styles.unavailableLabel}>Currently Unavailable</Text>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>🌙 Dinner</Text>
                  <Text style={styles.mealTime}>7:00 PM - 10:00 PM</Text>
                </View>
                
                {selectedMenu.meals.dinner.map((item) => (
                  <View key={item._id} style={[styles.menuItem, !item.isAvailable && styles.unavailableItem]}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemName, !item.isAvailable && styles.unavailableText]}>
                          {item.isVeg ? '🟢' : '🔴'} {item.name}
                        </Text>
                        {item.spiceLevel && (
                          <Text style={styles.spiceLevel}>
                            {getSpiceLevelEmoji(item.spiceLevel)} {item.spiceLevel}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.itemPrice, !item.isAvailable && styles.unavailableText]}>
                        ₹{item.price}
                      </Text>
                    </View>
                    <Text style={[styles.itemDescription, !item.isAvailable && styles.unavailableText]}>
                      {item.description}
                    </Text>
                    {!item.isAvailable && (
                      <Text style={styles.unavailableLabel}>Currently Unavailable</Text>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
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
  daySelector: {
    marginBottom: 20,
  },
  dayChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeDayChip: {
    backgroundColor: 'white',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  activeDayText: {
    color: '#4F46E5',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  activeDateText: {
    color: '#4F46E5',
  },
  mealSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unavailableItem: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  spiceLevel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  unavailableText: {
    color: '#999',
  },
  unavailableLabel: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 8,
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});