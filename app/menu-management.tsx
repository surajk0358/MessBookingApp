// app/menu-management.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert, TextInput, Modal } from 'react-native';
import { API, User } from '../utils/api';
import { getUserData } from '../utils/storage';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  isVeg: boolean;
}

interface Category {
  name: string;
  items: MenuItem[];
}

export default function MenuManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    isAvailable: true,
    preparationTime: 15,
    isVeg: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
      
      if (userData?._id) {
        // Mock data - replace with actual API call
        const mockMenuItems: MenuItem[] = [
          {
            _id: '1',
            name: 'Chicken Curry',
            description: 'Spicy chicken curry with aromatic spices',
            price: 300,
            category: 'Main Course',
            isAvailable: true,
            preparationTime: 25,
            isVeg: false
          },
          {
            _id: '2',
            name: 'Dal Rice',
            description: 'Traditional lentil curry with steamed rice',
            price: 200,
            category: 'Main Course',
            isAvailable: true,
            preparationTime: 15,
            isVeg: true
          },
          {
            _id: '3',
            name: 'Masala Chai',
            description: 'Traditional Indian spiced tea',
            price: 25,
            category: 'Beverages',
            isAvailable: true,
            preparationTime: 5,
            isVeg: true
          },
          {
            _id: '4',
            name: 'Gulab Jamun',
            description: 'Sweet milk dumplings in sugar syrup',
            price: 80,
            category: 'Desserts',
            isAvailable: false,
            preparationTime: 10,
            isVeg: true
          }
        ];
        
        setMenuItems(mockMenuItems);
        
        // Group items by category
        const grouped = mockMenuItems.reduce((acc, item) => {
          const existingCategory = acc.find(cat => cat.name === item.category);
          if (existingCategory) {
            existingCategory.items.push(item);
          } else {
            acc.push({ name: item.category, items: [item] });
          }
          return acc;
        }, [] as Category[]);
        
        setCategories(grouped);
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleAvailability = (itemId: string) => {
    setMenuItems(items =>
      items.map(item =>
        item._id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    
    setCategories(cats =>
      cats.map(cat => ({
        ...cat,
        items: cat.items.map(item =>
          item._id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
        )
      }))
    );
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const item: MenuItem = {
      _id: Date.now().toString(),
      name: newItem.name!,
      description: newItem.description || '',
      price: newItem.price!,
      category: newItem.category || 'Main Course',
      isAvailable: newItem.isAvailable ?? true,
      preparationTime: newItem.preparationTime || 15,
      isVeg: newItem.isVeg ?? true
    };

    setMenuItems(prev => [...prev, item]);
    
    // Update categories
    setCategories(prev => {
      const existingCategory = prev.find(cat => cat.name === item.category);
      if (existingCategory) {
        existingCategory.items.push(item);
        return [...prev];
      } else {
        return [...prev, { name: item.category, items: [item] }];
      }
    });

    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      isAvailable: true,
      preparationTime: 15,
      isVeg: true
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Menu item added successfully!');
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddModal(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedItem: MenuItem = {
      ...editingItem,
      name: newItem.name!,
      description: newItem.description || '',
      price: newItem.price!,
      category: newItem.category || 'Main Course',
      isAvailable: newItem.isAvailable ?? true,
      preparationTime: newItem.preparationTime || 15,
      isVeg: newItem.isVeg ?? true
    };

    setMenuItems(prev => 
      prev.map(item => item._id === editingItem._id ? updatedItem : item)
    );
    
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        items: cat.items.map(item =>
          item._id === editingItem._id ? updatedItem : item
        )
      }))
    );

    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      isAvailable: true,
      preparationTime: 15,
      isVeg: true
    });
    setEditingItem(null);
    setShowAddModal(false);
    Alert.alert('Success', 'Menu item updated successfully!');
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(prev => prev.filter(item => item._id !== itemId));
            setCategories(prev =>
              prev.map(cat => ({
                ...cat,
                items: cat.items.filter(item => item._id !== itemId)
              })).filter(cat => cat.items.length > 0)
            );
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
          <Text style={{ color: 'white', marginTop: 20 }}>Loading menu...</Text>
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
              onPress={() => router.push('/owner')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}> 🍽️ Menu </Text>
            <Text style={styles.subtitle}>Add and update your menu items</Text>
          </View>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add New Item</Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <View key={category.name} style={styles.section}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              
              {category.items.map((item) => (
                <View key={item._id} style={styles.menuItemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemType}>{item.isVeg ? '🟢' : '🔴'}</Text>
                      </View>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                      <Text style={styles.itemPrice}>₹{item.price}</Text>
                      <Text style={styles.itemTime}>⏱️ {item.preparationTime} mins</Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={[styles.availabilityButton, item.isAvailable ? styles.availableButton : styles.unavailableButton]}
                        onPress={() => toggleAvailability(item._id)}
                      >
                        <Text style={styles.availabilityText}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.itemButtonRow}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditItem(item)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteItem(item._id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}

          {categories.length === 0 && (
            <View style={styles.section}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No menu items yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your first menu item to get started</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setShowAddModal(false);
              setEditingItem(null);
              setNewItem({
                name: '',
                description: '',
                price: 0,
                category: 'Main Course',
                isAvailable: true,
                preparationTime: 15,
                isVeg: true
              });
            }}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </Text>
            <TouchableOpacity onPress={editingItem ? handleUpdateItem : handleAddItem}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name *</Text>
              <TextInput
                style={styles.textInput}
                value={newItem.name}
                onChangeText={(text) => setNewItem(prev => ({ ...prev, name: text }))}
                placeholder="Enter item name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newItem.description}
                onChangeText={(text) => setNewItem(prev => ({ ...prev, description: text }))}
                placeholder="Enter item description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price (₹) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newItem.price?.toString() || ''}
                  onChangeText={(text) => setNewItem(prev => ({ ...prev, price: parseFloat(text) || 0 }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prep Time (mins)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newItem.preparationTime?.toString() || ''}
                  onChangeText={(text) => setNewItem(prev => ({ ...prev, preparationTime: parseInt(text) || 15 }))}
                  placeholder="15"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categorySelector}>
                {['Main Course', 'Appetizers', 'Beverages', 'Desserts', 'Snacks'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      newItem.category === cat && styles.categoryOptionSelected
                    ]}
                    onPress={() => setNewItem(prev => ({ ...prev, category: cat }))}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      newItem.category === cat && styles.categoryOptionTextSelected
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.switchGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Vegetarian</Text>
                <TouchableOpacity
                  style={[styles.switch, newItem.isVeg && styles.switchActive]}
                  onPress={() => setNewItem(prev => ({ ...prev, isVeg: !prev.isVeg }))}
                >
                  <View style={[styles.switchThumb, newItem.isVeg && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Available</Text>
                <TouchableOpacity
                  style={[styles.switch, newItem.isAvailable && styles.switchActive]}
                  onPress={() => setNewItem(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                >
                  <View style={[styles.switchThumb, newItem.isAvailable && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  addButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: 'bold',
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
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItemCard: {
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  itemInfo: {
    flex: 1,
    marginRight: 15,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemType: {
    fontSize: 16,
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  availabilityButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  availableButton: {
    backgroundColor: '#10B981',
  },
  unavailableButton: {
    backgroundColor: '#EF4444',
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: 'white',
  },
  modalCancelText: {
    color: '#6B7280',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSaveText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryOptionSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#666',
  },
  categoryOptionTextSelected: {
    color: 'white',
  },
  switchGroup: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: '#4F46E5',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
});