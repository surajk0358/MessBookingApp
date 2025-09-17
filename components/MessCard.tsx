// components/MessCard.tsx - New component for displaying mess information
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Mess } from '../utils/api';

interface MessCardProps {
  mess: Mess;
  onPress: () => void;
}

export default function MessCard({ mess, onPress }: MessCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.name}>{mess.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {mess.rating.average}</Text>
          <Text style={styles.reviewCount}>({mess.rating.count})</Text>
        </View>
      </View>
      
      <Text style={styles.address}>{mess.address.city}, {mess.address.state}</Text>
      
      {mess.description && (
        <Text style={styles.description} numberOfLines={2}>
          {mess.description}
        </Text>
      )}
      
      <View style={styles.pricingContainer}>
        {mess.pricing.breakfast && (
          <Text style={styles.pricing}>Breakfast: ₹{mess.pricing.breakfast}</Text>
        )}
        {mess.pricing.lunch && (
          <Text style={styles.pricing}>Lunch: ₹{mess.pricing.lunch}</Text>
        )}
        {mess.pricing.dinner && (
          <Text style={styles.pricing}>Dinner: ₹{mess.pricing.dinner}</Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.foodType}>{mess.foodType.toUpperCase()}</Text>
        {mess.distance && (
          <Text style={styles.distance}>{mess.distance.toFixed(1)} km away</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  pricingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  pricing: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    marginRight: 16,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distance: {
    fontSize: 12,
    color: '#6B7280',
  },
});