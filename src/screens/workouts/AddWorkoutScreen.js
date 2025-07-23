import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../styles/colors';
import { workoutService } from '../../services/workoutService';

const AddWorkoutScreen = ({ navigation }) => {
  const [workoutData, setWorkoutData] = useState({
    exercise_name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const updateWorkoutData = (field, value) => {
    setWorkoutData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!workoutData.exercise_name) {
      Alert.alert('Error', 'Please enter an exercise name');
      return false;
    }
    if (!workoutData.sets || !workoutData.reps) {
      Alert.alert('Error', 'Please enter sets and reps');
      return false;
    }
    return true;
  };

  const handleSaveWorkout = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const workoutToSave = {
        exercise_name: workoutData.exercise_name,
        sets: parseInt(workoutData.sets),
        reps: parseInt(workoutData.reps),
        date: workoutData.date,
        ...(workoutData.weight && { weight: parseFloat(workoutData.weight) }),
        ...(workoutData.duration && { duration: parseInt(workoutData.duration) }),
        ...(workoutData.notes && { notes: workoutData.notes }),
      };

      await workoutService.saveWorkout(workoutToSave);
      
      Alert.alert(
        'Success',
        'Workout saved successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Workout</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exercise Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Push-ups, Bench Press"
              placeholderTextColor={colors.textSecondary}
              value={workoutData.exercise_name}
              onChangeText={(value) => updateWorkoutData('exercise_name', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Sets *</Text>
              <TextInput
                style={styles.input}
                placeholder="3"
                placeholderTextColor={colors.textSecondary}
                value={workoutData.sets}
                onChangeText={(value) => updateWorkoutData('sets', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Reps *</Text>
              <TextInput
                style={styles.input}
                placeholder="10"
                placeholderTextColor={colors.textSecondary}
                value={workoutData.reps}
                onChangeText={(value) => updateWorkoutData('reps', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                placeholderTextColor={colors.textSecondary}
                value={workoutData.weight}
                onChangeText={(value) => updateWorkoutData('weight', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Duration (min)</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                placeholderTextColor={colors.textSecondary}
                value={workoutData.duration}
                onChangeText={(value) => updateWorkoutData('duration', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
              value={workoutData.date}
              onChangeText={(value) => updateWorkoutData('date', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any additional notes about this workout..."
              placeholderTextColor={colors.textSecondary}
              value={workoutData.notes}
              onChangeText={(value) => updateWorkoutData('notes', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveWorkout}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Workout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 50,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddWorkoutScreen;