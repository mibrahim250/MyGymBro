// App.js  – working logic, new colors
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, StyleSheet, StatusBar
} from 'react-native';

import { authService }     from './src/services/authService';
import { workoutService }  from './src/services/workoutService';
import { nutritionService } from './src/services/nutritionService';

export default function App() {
  const [user, setUser]               = useState(null);
  const [email, setEmail]             = useState('test@mygymbro.com');
  const [password, setPassword]       = useState('password123');
  const [calories, setCalories]       = useState('');
  const [foodName, setFoodName]       = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets]               = useState('3');
  const [reps, setReps]               = useState('10');
  const [todayCalories, setTodayCalories] = useState([]);
  const [workouts, setWorkouts]       = useState([]);

  // ---------- auth listener ----------
  useEffect(() => {
    checkUser();
    const { data: listener } = authService.onAuthStateChange((_evt, session) => {
      session?.user ? (setUser(session.user), loadUserData()) : setUser(null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      setUser(user);
      if (user) loadUserData();
    } catch (e) { console.error(e); }
  };
  const loadUserData = async () => { await getTodayCalories(); await getWorkouts(); };

  // ---------- actions ----------
  const handleSignUp = async () => {
    try {
      const { error } = await authService.signUp(email, password, { firstName: 'Test', lastName: 'User' });
      error ? Alert.alert('Sign-Up Error', error.message)
            : Alert.alert('Success', 'Account created! Check email.');
    } catch (e) { Alert.alert('Error', e.message); }
  };
  const handleSignIn  = async () => {
    try {
      const { data, error } = await authService.signIn(email, password);
      error ? Alert.alert('Sign-In Error', error.message)
            : (setUser(data.user), loadUserData());
    } catch (e) { Alert.alert('Error', e.message); }
  };
  const handleSignOut = async () => {
    try {
      const { error } = await authService.signOut();
      error ? Alert.alert('Sign-Out Error', error.message)
            : (setUser(null), setTodayCalories([]), setWorkouts([]));
    } catch (e) { Alert.alert('Error', e.message); }
  };

  // ---------- nutrition ----------
  const addCalories = async () => {
    if (!calories || !foodName) return Alert.alert('Error', 'Enter food & calories');
    try {
      const { error } = await nutritionService.saveCalorieEntry({ food_name: foodName, calories: +calories });
      error ? Alert.alert('Error', error.message)
            : (setCalories(''), setFoodName(''), getTodayCalories());
    } catch (e) { Alert.alert('Error', e.message); }
  };
  const getTodayCalories = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      setTodayCalories(await nutritionService.getNutritionByDate(today));
    } catch (e) { console.error(e); }
  };

  // ---------- workouts ----------
  const addWorkout = async () => {
    if (!exerciseName || !sets || !reps) return Alert.alert('Error', 'Enter exercise, sets, reps');
    try {
      const { error } = await workoutService.saveWorkout({
        exercise_name: exerciseName,
        sets: +sets,
        reps: +reps,
        date: new Date().toISOString().split('T')[0],
      });
      error ? Alert.alert('Error', error.message)
            : (setExerciseName(''), setSets('3'), setReps('10'), getWorkouts());
    } catch (e) { Alert.alert('Error', e.message); }
  };
  const getWorkouts = async () => {
    try { setWorkouts(await workoutService.getUserWorkouts()); }
    catch (e) { console.error(e); }
  };

  // ---------- UI ----------
  if (!user) {
    return (
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
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={[styles.title, { color: '#FF86C8' }]}>🏋️ MyGymBro Backend Test</Text>

      {/* Logged-in info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Logged in as: {user.email}</Text>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Nutrition */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍎 Nutrition</Text>
        <TextInput
          style={styles.input}
          placeholder="Food"
          placeholderTextColor="#BBBBBB"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={styles.input}
          placeholder="Calories"
          placeholderTextColor="#BBBBBB"
          value={calories}
          onChangeText={setCalories}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.button} onPress={addCalories}>
          <Text style={styles.buttonText}>Add Food Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={getTodayCalories}>
          <Text style={styles.buttonText}>Refresh Today's</Text>
        </TouchableOpacity>
      </View>

      {/* Workout */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💪 Workout</Text>
        <TextInput
          style={styles.input}
          placeholder="Exercise"
          placeholderTextColor="#BBBBBB"
          value={exerciseName}
          onChangeText={setExerciseName}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Sets"
            placeholderTextColor="#BBBBBB"
            value={sets}
            onChangeText={setSets}
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Reps"
            placeholderTextColor="#BBBBBB"
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={addWorkout}>
          <Text style={styles.buttonText}>Save Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={getWorkouts}>
          <Text style={styles.buttonText}>Refresh Workouts</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ------------ Styles (only colors changed) ------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',          // sleek black
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#1F1F1F',          // charcoal card
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    color: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },

  button: {
    backgroundColor: '#FF86C8',          // pink primary
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: { backgroundColor: '#34C759' },  // keep green
  dangerButton:    { backgroundColor: '#FF3B30' },

  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  helperText: { textAlign: 'center', color: '#BBBBBB', fontSize: 12, marginTop: 10 },
});
