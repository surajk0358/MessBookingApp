import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { API, Mess } from '../utils/api';
import MessCard from '../components/MessCard';

export default function BrowseMessesScreen() {
  const [messes, setMesses] = useState<Mess[]>([]);
  const [filteredMesses, setFilteredMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'veg' | 'non-veg' | 'both'>('all');

  useEffect(() => {
    loadMesses();
  }, []);

  useEffect(() => {
    filterMesses();
  }, [searchQuery, selectedFilter, messes]);

  const loadMesses = async () => {
    try {
      const response = await API.getMesses();
      if (response.success) {
        setMesses(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch messes');
      }
    } catch (error: any) {
      console.error('Error loading messes:', error.message);
      Alert.alert('Error', error.message || 'Failed to load messes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMesses();
    setRefreshing(false);
  };

  const filterMesses = () => {
    let filtered = messes;

    if (searchQuery.trim()) {
      filtered = filtered.filter(mess =>
        mess.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mess.address.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(mess => mess.foodType === selectedFilter);
    }

    setFilteredMesses(filtered);
  };

  const handleMessPress = (mess: Mess) => {
    router.push({ pathname: '../messDetails', params: { messId: mess._id } });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading messes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/consumer')} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Browse Messes</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messes by name or city..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'veg', 'non-veg', 'both'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, selectedFilter === filter && styles.activeFilterChip]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
                  {filter === 'all' ? 'All' : filter === 'non-veg' ? 'Non-Veg' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.messesContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <Text style={styles.resultsText}>{filteredMesses.length} messes found</Text>

          {filteredMesses.map((mess) => (
            <MessCard key={mess._id} mess={mess} onPress={() => handleMessPress(mess)} />
          ))}

          {filteredMesses.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No messes found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
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
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginRight: 40,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: 'white',
  },
  filterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#4F46E5',
  },
  messesContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  resultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
  },
});