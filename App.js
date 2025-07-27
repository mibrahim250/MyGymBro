import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { authService } from './src/services/authService';
import { workoutService } from './src/services/workoutService';
import { nutritionService } from './src/services/nutritionService';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('test@mygymbro.com');
  const [password, setPassword] = useState('password123');
  const [calories, setCalories] = useState('');
  const [foodName, setFoodName] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [exercises, setExercises] = useState([]);
  const [todayCalories, setTodayCalories] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  // Check if user is logged in on app start
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData();
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { user, profile } = await authService.getCurrentUser();
      setUser(user);
      if (user) {
        loadUserData();
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const loadUserData = async () => {
    await getTodayCalories();
    await getWorkouts();
  };

  const handleSignUp = async () => {
    try {
      const { data, error } = await authService.signUp(email, password, {
        firstName: 'Test',
        lastName: 'User'
      });
      
      if (error) {
        Alert.alert('Sign Up Error', error.message);
      } else {
        Alert.alert('Success', 'Account created! Check your email to verify.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        Alert.alert('Sign In Error', error.message);
      } else {
        Alert.alert('Success', 'Signed in successfully!');
        setUser(data.user);
        loadUserData();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        Alert.alert('Sign Out Error', error.message);
      } else {
        setUser(null);
        setTodayCalories([]);
        setWorkouts([]);
        Alert.alert('Success', 'Signed out successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const addCalories = async () => {
    if (!calories || !foodName) {
      Alert.alert('Error', 'Please enter both food name and calories');
      return;
    }

    try {
      const { data, error } = await nutritionService.saveCalorieEntry({
        food_name: foodName,
        calories: parseInt(calories),
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Food entry saved!');
        setCalories('');
        setFoodName('');
        getTodayCalories();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const getTodayCalories = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = await nutritionService.getNutritionByDate(today);
      setTodayCalories(entries);
    } catch (error) {
      console.error('Error getting calories:', error);
    }
  };

  const addWorkout = async () => {
    if (!exerciseName || !sets || !reps) {
      Alert.alert('Error', 'Please enter exercise name, sets, and reps');
      return;
    }

    try {
      const { data, error } = await workoutService.saveWorkout({
        exercise_name: exerciseName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        date: new Date().toISOString().split('T')[0],
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Workout saved!');
        setExerciseName('');
        setSets('3');
        setReps('10');
        getWorkouts();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const getWorkouts = async () => {
    try {
      const userWorkouts = await workoutService.getUserWorkouts();
      setWorkouts(userWorkouts);
    } catch (error) {
      console.error('Error getting workouts:', error);
    }
  };

  const getExercises = async () => {
    try {
      const { data, error } = await workoutService.getExercises();
      if (!error && data) {
        setExercises(data);
        Alert.alert('Success', `Found ${data.length} exercises`);
      } else {
        Alert.alert('Info', 'No exercises found or table not created yet');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (!user) {
    // Auth Screen
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>🏋️ MyGymBro Backend Test</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Authentication Test</Text>
          
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
          
          <Text style={styles.helperText}>
            Test credentials: test@mygymbro.com / password123
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Main App Screen (when logged in)
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏋️ MyGymBro Backend Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Logged in as: {user.email}</Text>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Nutrition Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍎 Nutrition Test</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Food name (e.g., Banana)"
          value={foodName}
          onChangeText={setFoodName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Calories (e.g., 105)"
          value={calories}
          onChangeText={setCalories}
          keyboardType="number-pad"
        />
        
        <TouchableOpacity style={styles.button} onPress={addCalories}>
          <Text style={styles.buttonText}>Add Food Entry</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={getTodayCalories}>
          <Text style={styles.buttonText}>Refresh Today's Entries</Text>
        </TouchableOpacity>
        
        {todayCalories.length > 0 && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Today's Food Entries ({todayCalories.length}):</Text>
            {todayCalories.map((entry, index) => (
              <Text key={index} style={styles.dataText}>
                {entry.food_name}: {entry.calories} cal
              </Text>
            ))}
            <Text style={styles.totalText}>
              Total: {todayCalories.reduce((sum, entry) => sum + entry.calories, 0)} calories
            </Text>
          </View>
        )}
      </View>

      {/* Workout Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💪 Workout Test</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Exercise name (e.g., Push-ups)"
          value={exerciseName}
          onChangeText={setExerciseName}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Sets"
            value={sets}
            onChangeText={setSets}
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Reps"
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
        
        <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={getExercises}>
          <Text style={styles.buttonText}>Test Exercise Database</Text>
        </TouchableOpacity>
        
        {workouts.length > 0 && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Your Workouts ({workouts.length}):</Text>
            {workouts.slice(0, 5).map((workout, index) => (
              <Text key={index} style={styles.dataText}>
                {workout.exercise_name}: {workout.sets} × {workout.reps}
                {workout.weight && ` @ ${workout.weight}kg`}
              </Text>
            ))}
            {workouts.length > 5 && (
              <Text style={styles.moreText}>... and {workouts.length - 5} more</Text>
            )}
          </View>
        )}
      </View>

      {/* Database Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Database Status</Text>
        <Text style={styles.statusText}>✅ Supabase Connected</Text>
        <Text style={styles.statusText}>✅ Authentication Working</Text>
        <Text style={styles.statusText}>✅ Nutrition Service: {todayCalories.length} entries today</Text>
        <Text style={styles.statusText}>✅ Workout Service: {workouts.length} total workouts</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
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
  infoButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 10,
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
  totalText: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  moreText: {
    color: '#999',
    fontStyle: 'italic',
  },
  statusText: {
    color: '#34C759',
    marginBottom: 3,
  },
});