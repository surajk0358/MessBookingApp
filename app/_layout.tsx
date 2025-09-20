
// app/_layout.tsx - 
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Simulate initialization delay
    setTimeout(() => {
      setInitializing(false);
    }, 2000);
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🍽</Text>
        <Text style={styles.loadingTitle}>MessApp</Text>
        <Text style={styles.loadingSubtitle}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#4F46E5" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="consumer" />
        <Stack.Screen name="owner" />
        <Stack.Screen name="browse-messes" />
        <Stack.Screen name="messDetails" />
        <Stack.Screen name="place-order" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="my-bookings" />
        <Stack.Screen name="owner-orders" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#4F46E5' 
  },
  loadingText: { fontSize: 60, marginBottom: 20 },
  loadingTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 10 
  },
  loadingSubtitle: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.8)' 
  },
});
