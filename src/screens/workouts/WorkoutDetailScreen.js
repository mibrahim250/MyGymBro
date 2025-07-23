import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../../styles/colors';
import { workoutService } from '../../services/workoutService';

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { workout } = route.params;

  const handleDeleteWorkout = async () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutService.deleteWorkout(workout.id);
              Alert.alert(
                'Success',
                'Workout deleted successfully',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Not recorded';
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const calculateVolume = () => {
    if (workout.weight && workout.sets && workout.reps) {
      const volume = workout.weight * workout.sets * workout.reps;
      return `${volume} kg`;
    }
    return null;
  };

  const volume = calculateVolume();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteWorkout}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.exerciseName}>{workout.exercise_name}</Text>
        <Text style={styles.date}>{formatDate(workout.date)}</Text>
        <Text style={styles.time}>Logged at {formatTime(workout.created_at)}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{workout.sets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{workout.reps}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
          
          {workout.weight && (
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{workout.weight}</Text>
              <Text style={styles.statLabel}>Weight (kg)</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Workout Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Exercise</Text>
            <Text style={styles.detailValue}>{workout.exercise_name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sets × Reps</Text>
            <Text style={styles.detailValue}>{workout.sets} × {workout.reps}</Text>
          </View>
          
          {workout.weight && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailValue}>{workout.weight} kg</Text>
            </View>
          )}
          
          {volume && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Volume</Text>
              <Text style={styles.detailValue}>{volume}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{formatDuration(workout.duration)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Workout Date</Text>
            <Text style={styles.detailValue}>{formatDate(workout.date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Logged On</Text>
            <Text style={styles.detailValue}>
              {new Date(workout.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {workout.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}

        {/* Quick Stats Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Workout Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Reps</Text>
              <Text style={styles.summaryValue}>{workout.sets * workout.reps}</Text>
            </View>
            
            {workout.weight && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Avg Weight/Rep</Text>
                <Text style={styles.summaryValue}>{workout.weight} kg</Text>
              </View>
            )}
            
            {workout.duration && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Time per Set</Text>
                <Text style={styles.summaryValue}>
                  {Math.round(workout.duration / workout.sets)} min
                </Text>
              </View>
            )}
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Intensity</Text>
              <Text style={styles.summaryValue}>
                {workout.weight ? 'High' : 'Moderate'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  deleteButton: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  notesContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
});

export default WorkoutDetailScreen;