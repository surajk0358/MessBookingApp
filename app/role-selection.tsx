import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import RoleCard from '../components/RoleCard';
import { saveRole } from '../utils/storage';

export default function RoleSelection() {
  const handleRoleSelect = async (role: 'consumer' | 'owner') => {
    await saveRole(role);
    router.replace(`/${role}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>How would you like to use Mess?</Text>
        </View>

        <View style={styles.roleContainer}>
          <RoleCard
            icon="👤"
            title="Consumer"
            subtitle="Find and book mess services"
            description="Browse local mess options, view menus, and book meals"
            onPress={() => handleRoleSelect('consumer')}
          />

          <RoleCard
            icon="🏪"
            title="Mess Owner"
            subtitle="Manage your mess business"
            description="Create listings, manage orders, and grow your business"
            onPress={() => handleRoleSelect('owner')}
          />
        </View>
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
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  roleContainer: {
    gap: 20,
  },
});