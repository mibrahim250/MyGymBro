// screens/WorkoutScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Color constants
const colors = {
  primary: '#6366f1',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  background: '#f8faff',
  cardBackground: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  inputBackground: '#f9fafb',
  border: '#e5e7eb',
};

const darkColors = {
  primary: '#6366f1',
  success: '#10b981',
  error: '#ef4444',
  warning: '#fbbf24',
  background: '#111827',
  cardBackground: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  inputBackground: '#374151',
  border: '#4b5563',
};

// Mock services for testing
const mockWorkoutService = {
  saveWorkout: (data) => Promise.resolve({ 
    success: true, 
    data: { id: Date.now(), ...data } 
  }),
  getUserWorkouts: () => Promise.resolve({ 
    success: true, 
    data: [] 
  }),
  saveCalorieEntry: (data) => Promise.resolve({ 
    success: true, 
    data: { id: Date.now(), ...data } 
  }),
  getTodayCalories: () => Promise.resolve({ 
    success: true, 
    data: [] 
  }),
  deleteWorkout: () => Promise.resolve({ success: true }),
  deleteCalorieEntry: () => Promise.resolve({ success: true })
};

const WorkoutScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Exercise form state
  const [currentExercise, setCurrentExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [exerciseType, setExerciseType] = useState('strength');
  
  // Data state
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [calorieEntries, setCalorieEntries] = useState([]);
  
  // Calorie form state
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [mealTime, setMealTime] = useState('');

  const theme = darkMode ? darkColors : colors;

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      const workoutsResult = await mockWorkoutService.getUserWorkouts(20);
      const caloriesResult = await mockWorkoutService.getTodayCalories();
      
      if (workoutsResult.success) {
        setWorkoutExercises([]);
      }
      if (caloriesResult.success) {
        setCalorieEntries([]);
      }
    } catch (error) {
      console.error('Error loading today data:', error);
    }
  };

  const addExercise = async () => {
    if (!currentExercise.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }
    
    setLoading(true);
    try {
      const exerciseData = {
        name: currentExercise,
        type: exerciseType,
        sets: exerciseType === 'strength' ? sets : null,
        reps: exerciseType === 'strength' ? reps : null,
        weight: exerciseType === 'strength' ? weight : null,
        duration: exerciseType === 'cardio' ? duration : null,
      };

      const result = await mockWorkoutService.saveWorkout(exerciseData);
      
      if (result.success) {
        const newExercise = {
          id: result.data.id,
          name: currentExercise,
          type: exerciseType,
          sets: exerciseType === 'strength' ? sets : '',
          reps: exerciseType === 'strength' ? reps : '',
          weight: exerciseType === 'strength' ? weight : '',
          duration: exerciseType === 'cardio' ? duration : '',
          timestamp: new Date().toLocaleTimeString()
        };
        
        setWorkoutExercises([newExercise, ...workoutExercises]);
        
        // Clear inputs
        setCurrentExercise('');
        setSets('');
        setReps('');
        setWeight('');
        setDuration('');
        
        Alert.alert('Success', 'Exercise added successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to save exercise');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save exercise');
      console.error('Error adding exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCalorieEntry = async () => {
    if (!foodItem.trim() || !calories) {
      Alert.alert('Error', 'Please enter food item and calories');
      return;
    }
    
    setLoading(true);
    try {
      const calorieData = {
        food: foodItem,
        calories: parseInt(calories),
        time: mealTime || new Date().toLocaleTimeString(),
      };

      const result = await mockWorkoutService.saveCalorieEntry(calorieData);
      
      if (result.success) {
        const newEntry = {
          id: result.data.id,
          food: foodItem,
          calories: parseInt(calories),
          time: mealTime || new Date().toLocaleTimeString(),
          timestamp: new Date().toLocaleString()
        };
        
        setCalorieEntries([newEntry, ...calorieEntries]);
        
        // Clear inputs
        setFoodItem('');
        setCalories('');
        setMealTime('');
        
        Alert.alert('Success', 'Food entry added successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to save calorie entry');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save calorie entry');
      console.error('Error adding calorie entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeExercise = async (id) => {
    try {
      const result = await mockWorkoutService.deleteWorkout(id);
      if (result.success) {
        setWorkoutExercises(workoutExercises.filter(ex => ex.id !== id));
      } else {
        Alert.alert('Error', 'Failed to delete exercise');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete exercise');
    }
  };

  const removeCalorieEntry = async (id) => {
    try {
      const result = await mockWorkoutService.deleteCalorieEntry(id);
      if (result.success) {
        setCalorieEntries(calorieEntries.filter(entry => entry.id !== id));
      } else {
        Alert.alert('Error', 'Failed to delete calorie entry');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete calorie entry');
    }
  };

  const todayCalories = calorieEntries.reduce((total, entry) => total + entry.calories, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Current Workout</Text>
          <TouchableOpacity
            onPress={() => setDarkMode(!darkMode)}
            style={[styles.themeButton, { backgroundColor: theme.cardBackground }]}
          >
            <Ionicons
              name={darkMode ? 'sunny' : 'moon'}
              size={24}
              color={darkMode ? colors.warning : colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Exercise Type Toggle */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.toggleContainer, { backgroundColor: darkMode ? theme.inputBackground : '#f3f4f6' }]}>
            <TouchableOpacity
              onPress={() => setExerciseType('strength')}
              style={[
                styles.toggleButton,
                exerciseType === 'strength' && styles.activeToggle,
              ]}
            >
              <Text style={[
                styles.toggleText,
                { color: exerciseType === 'strength' ? '#fff' : theme.text }
              ]}>
                Strength
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setExerciseType('cardio')}
              style={[
                styles.toggleButton,
                exerciseType === 'cardio' && styles.activeToggle,
              ]}
            >
              <Text style={[
                styles.toggleText,
                { color: exerciseType === 'cardio' ? '#fff' : theme.text }
              ]}>
                Cardio
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.inputBackground, 
              color: theme.text,
              borderColor: theme.border 
            }]}
            placeholder="Exercise name"
            placeholderTextColor={theme.textSecondary}
            value={currentExercise}
            onChangeText={setCurrentExercise}
          />

          {exerciseType === 'strength' ? (
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.smallInput, { 
                  backgroundColor: theme.inputBackground, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                placeholder="Sets"
                placeholderTextColor={theme.textSecondary}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.smallInput, { 
                  backgroundColor: theme.inputBackground, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                placeholder="Reps"
                placeholderTextColor={theme.textSecondary}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.smallInput, { 
                  backgroundColor: theme.inputBackground, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                placeholder="Weight (lbs)"
                placeholderTextColor={theme.textSecondary}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
          ) : (
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="Duration (e.g., 30 min)"
              placeholderTextColor={theme.textSecondary}
              value={duration}
              onChangeText={setDuration}
            />
          )}

          <TouchableOpacity
            onPress={addExercise}
            disabled={loading}
            style={styles.addButton}
          >
            <LinearGradient
              colors={[colors.primary, '#8b5cf6']}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Add Exercise</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Today's Exercises */}
        {workoutExercises.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Exercises</Text>
            {workoutExercises.map((exercise) => (
              <View key={exercise.id} style={[styles.exerciseItem, { backgroundColor: theme.inputBackground }]}>
                <View style={styles.exerciseDetails}>
                  <Text style={[styles.exerciseName, { color: theme.text }]}>{exercise.name}</Text>
                  <Text style={[styles.exerciseInfo, { color: theme.textSecondary }]}>
                    {exercise.type === 'strength'
                      ? `${exercise.sets} sets × ${exercise.reps} reps ${exercise.weight ? `@ ${exercise.weight}lbs` : ''}`
                      : `${exercise.duration}`
                    }
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeExercise(exercise.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Calorie Tracking */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Track Calories</Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.inputBackground, 
              color: theme.text,
              borderColor: theme.border 
            }]}
            placeholder="Food item"
            placeholderTextColor={theme.textSecondary}
            value={foodItem}
            onChangeText={setFoodItem}
          />
          
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.halfInput, { 
                backgroundColor: theme.inputBackground, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="Calories"
              placeholderTextColor={theme.textSecondary}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.halfInput, { 
                backgroundColor: theme.inputBackground, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="Time (optional)"
              placeholderTextColor={theme.textSecondary}
              value={mealTime}
              onChangeText={setMealTime}
            />
          </View>

          <TouchableOpacity
            onPress={addCalorieEntry}
            disabled={loading}
            style={styles.addButton}
          >
            <LinearGradient
              colors={[colors.success, '#059669']}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Add Food</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Today's Calories */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.calorieHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Calories</Text>
            <Text style={[styles.calorieCount, { color: colors.success }]}>{todayCalories}</Text>
          </View>
          
          {calorieEntries.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No calories logged today
            </Text>
          ) : (
            calorieEntries.slice(0, 5).map((entry) => (
              <View key={entry.id} style={[styles.calorieItem, { backgroundColor: theme.inputBackground }]}>
                <View style={styles.calorieDetails}>
                  <Text style={[styles.foodName, { color: theme.text }]}>{entry.food}</Text>
                  <Text style={[styles.foodCalories, { color: theme.textSecondary }]}>
                    {entry.calories} cal • {entry.time}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeCalorieEntry(entry.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={14} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  
  // Text styles
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },

  // Button styles
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },

  // Card styles
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Toggle styles
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#6366f1',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Input styles
  input: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  smallInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  halfInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },

  // Exercise item styles
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseInfo: {
    fontSize: 14,
    opacity: 0.7,
  },

  // Calorie styles
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calorieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  calorieDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodCalories: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default WorkoutScreen;