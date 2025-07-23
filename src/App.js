import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { authService } from './src/services/authService';
import { workoutService } from './src/services/workoutService';
import { nutritionService } from './src/services/nutritionService';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [calories, setCalories] = useState('');
  const [foodName, setFoodName] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [todayCalories, setTodayCalories] = useState([]);

  // Check if user is logged in on app start
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { user } = await authService.getCurrentUser();
    setUser(user);
  };

  const handleSignUp = async () => {
    const { data, error } = await authService.signUp(email, password);
    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email to confirm your account!');
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await authService.signIn(email, password);
    if (error) {
      Alert.alert('Sign In Error', error.message);
    } else {
      Alert.alert('Success', 'Signed in successfully!');
      setUser(data.user);
    }
  };

  const handleSignOut = async () => {
    const { error } = await authService.signOut();
    if (error) {
      Alert.alert('Sign Out Error', error.message);
    } else {
      setUser(null);
      Alert.alert('Success', 'Signed out successfully!');
    }
  };

  const addCalories = async () => {
    if (!calories || !foodName) {
      Alert.alert('Error', 'Please enter both food name and calories');
      return;
    }

    const { data, error } = await nutritionService.saveCalorieEntry({
      food_name: foodName,
      calories: parseInt(calories),
      meal_type: 'snack',
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Calories added!');
      setCalories('');
      setFoodName('');
      getTodayCalories();
    }
  };

  const getTodayCalories = async () => {
    const { data, error } = await nutritionService.getTodayCalories();
    if (!error && data) {
      setTodayCalories(data);
    }
  };

  const addWorkout = async () => {
    if (!workoutName) {
      Alert.alert('Error', 'Please enter workout name');
      return;
    }

    const { data, error } = await workoutService.saveWorkout({
      name: workoutName,
      duration_minutes: 30,
      exercises: ['Push ups', 'Squats'],
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Workout saved!');
      setWorkoutName('');
    }
  };

  const getExercises = async () => {
    const { data, error } = await workoutService.getExercises();
    if (!error && data) {
      setExercises(data);
    } else if (error) {
      Alert.alert('Info', 'No exercises found or table not created yet');
    }
  };

  if (!user) {
    // Auth Screen
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>🏋️ GYMBRO Auth Test</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
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
        </View>
      </ScrollView>
    );
  }

  // Main App Screen (when logged in)
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏋️ GYMBRO Dashboard</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Welcome, {user.email}!</Text>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Nutrition Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍎 Nutrition Tracker</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Food name"
          value={foodName}
          onChangeText={setFoodName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="number-pad"
        />
        
        <TouchableOpacity style={styles.button} onPress={addCalories}>
          <Text style={styles.buttonText}>Add Calories</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={getTodayCalories}>
          <Text style={styles.buttonText}>Get Today's Calories</Text>
        </TouchableOpacity>
        
        {todayCalories.length > 0 && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Today's Entries:</Text>
            {todayCalories.map((entry, index) => (
              <Text key={index} style={styles.dataText}>
                {entry.food_name}: {entry.calories} cal
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Workout Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💪 Workout Tracker</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Workout name"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        
        <TouchableOpacity style={styles.button} onPress={addWorkout}>
          <Text style={styles.buttonText}>Save Workout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={getExercises}>
          <Text style={styles.buttonText}>Get Exercises</Text>
        </TouchableOpacity>
        
        {exercises.length > 0 && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Available Exercises:</Text>
            {exercises.map((exercise, index) => (
              <Text key={index} style={styles.dataText}>
                {exercise.name}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  dataTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  dataText: {
    color: '#666',
    marginBottom: 2,
  },
});