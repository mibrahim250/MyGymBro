import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './src/styles/colors';
import { authService } from './src/services/authService';
import TabNavigator from './src/navigation/TabNavigator';

const theme = {
  colors: {
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('test@mygymbro.com');
  const [password, setPassword] = useState('password123');

  useEffect(() => {
    checkUser();
    const { data: listener } = authService.onAuthStateChange((_event, session) => {
      session?.user ? setUser(session.user) : setUser(null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      setUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) Alert.alert('Sign-In Error', error.message);
      else setUser(data.user);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const { error } = await authService.signUp(email, password, {
        firstName: 'Test',
        lastName: 'User',
      });
      if (error) Alert.alert('Sign-Up Error', error.message);
      else Alert.alert('Success', 'Account created! Check your email.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      Alert.alert('Logout Error', err.message);
    }
  };

  if (!user) {
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <View style={styles.container}>
            <Text style={styles.title}>MyGymBro</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </NavigationContainer>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <TabNavigator onLogout={handleLogout} />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});