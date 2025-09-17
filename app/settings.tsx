//app/settings.tsx
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { useState } from 'react';

export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderReminders, setOrderReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>⚙️</Text>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your preferences</Text>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>👤</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Edit Profile</Text>
                <Text style={styles.settingSubtitle}>Update your personal information</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>📍</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Delivery Address</Text>
                <Text style={styles.settingSubtitle}>Manage your delivery locations</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>💳</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Payment Methods</Text>
                <Text style={styles.settingSubtitle}>Manage cards and payment options</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🔔</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Get app notifications</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#E2E8F0', true: '#4F46E5' }}
                thumbColor={pushNotifications ? '#FFFFFF' : '#CBD5E0'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>📧</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive updates via email</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#E2E8F0', true: '#4F46E5' }}
                thumbColor={emailNotifications ? '#FFFFFF' : '#CBD5E0'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>⏰</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Order Reminders</Text>
                <Text style={styles.settingSubtitle}>Remind me to place orders</Text>
              </View>
              <Switch
                value={orderReminders}
                onValueChange={setOrderReminders}
                trackColor={{ false: '#E2E8F0', true: '#4F46E5' }}
                thumbColor={orderReminders ? '#FFFFFF' : '#CBD5E0'}
              />
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🌙</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingSubtitle}>Switch to dark theme</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E2E8F0', true: '#4F46E5' }}
                thumbColor={darkMode ? '#FFFFFF' : '#CBD5E0'}
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🌐</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingSubtitle}>English (US)</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🥗</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Dietary Preferences</Text>
                <Text style={styles.settingSubtitle}>Set your food preferences</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>💬</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help Center</Text>
                <Text style={styles.settingSubtitle}>Get help and support</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>📞</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Contact Us</Text>
                <Text style={styles.settingSubtitle}>Reach out to our team</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>⭐</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Rate Our App</Text>
                <Text style={styles.settingSubtitle}>Share your feedback</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Legal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>📄</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingSubtitle}>Read our privacy policy</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>📋</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Terms of Service</Text>
                <Text style={styles.settingSubtitle}>View terms and conditions</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Section */}
          <View style={styles.section}>
            <TouchableOpacity style={[styles.settingItem, styles.logoutItem]}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🚪</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.logoutText]}>Logout</Text>
                <Text style={styles.settingSubtitle}>Sign out of your account</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/owner')}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingEmoji: {
    fontSize: 22,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 16,
  },
  settingArrow: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#EF4444',
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