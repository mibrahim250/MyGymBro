// App.js - Minimal version with just Bottom Navigation
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, StyleSheet, StatusBar
} from 'react-native';

import { authService } from './src/services/authService';

// Bottom Navigation Component
import BottomNavigation from './src/components/BottomNavigation';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('test@mygymbro.com');
  const [password, setPassword] = useState('password123');
  const [currentTab, setCurrentTab] = useState('Dashboard');

  // ---------- auth listener ----------
  useEffect(() => {
    checkUser();
    const { data: listener } = authService.onAuthStateChange((_evt, session) => {
      session?.user ? setUser(session.user) : setUser(null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      setUser(user);
    } catch (e) { console.error(e); }
  };

  // Handle bottom navigation tab press
  const handleTabPress = (tabId) => {
    console.log('Tab pressed:', tabId);
    setCurrentTab(tabId);
  };

  // ---------- auth actions ----------
  const handleSignUp = async () => {
    try {
      const { error } = await authService.signUp(email, password, { firstName: 'Test', lastName: 'User' });
      error ? Alert.alert('Sign-Up Error', error.message)
            : Alert.alert('Success', 'Account created! Check email.');
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await authService.signIn(email, password);
      error ? Alert.alert('Sign-In Error', error.message)
            : setUser(data.user);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await authService.signOut();
      error ? Alert.alert('Sign-Out Error', error.message)
            : setUser(null);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  // ---------- Login Screen ----------
  if (!user) {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <StatusBar barStyle="light-content" />
          <Text style={[styles.title, { color: '#FF86C8' }]}>🏋️ MyGymBro Backend Test</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#FF86C8' }]}>🔐 Authentication</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#BBBBBB"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#BBBBBB"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.helperText}>Test: test@mygymbro.com / password123</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------- Main App (Logged In) ----------
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <StatusBar barStyle="light-content" />
        
        {/* Simple logged in content */}
        <View style={styles.centerContent}>
          <Text style={[styles.title, { color: '#FF86C8' }]}>🏋️ MyGymBro</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Logged in as:</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <Text style={styles.currentTabText}>Current Tab: {currentTab}</Text>
            
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleSignOut}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation onTabPress={handleTabPress} />
    </View>
  );
}

/* ------------ Styles ------------ */
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 50,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 50,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },

  section: {
    backgroundColor: '#1F1F1F',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: '90%',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  userEmail: {
    fontSize: 16,
    color: '#FF86C8',
    marginBottom: 20,
    textAlign: 'center',
  },

  currentTabText: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#444',
    color: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
  },

  button: {
    backgroundColor: '#FF86C8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    minWidth: 200,
  },

  secondaryButton: { 
    backgroundColor: '#34C759' 
  },

  dangerButton: { 
    backgroundColor: '#FF3B30' 
  },

  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  helperText: { 
    textAlign: 'center', 
    color: '#BBBBBB', 
    fontSize: 12, 
    marginTop: 10 
  },
});