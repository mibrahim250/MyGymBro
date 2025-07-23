// screens/PlansScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Color constants
const colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  tertiary: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8faff',
  cardBackground: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  completed: '#10b981',
  today: '#6366f1',
  planned: '#f3f4f6',
  planedText: '#6b7280',
};

const PlansScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(3); // Thursday is selected (today)

  // Mock data - replace with real data from your database
  const workoutPresets = [
    {
      id: 1,
      name: 'Push-Pull-Legs Split',
      description: '3-4 exercises • 45-60 min',
      exercises: 12,
      difficulty: 'Intermediate',
      icon: 'barbell',
    },
    {
      id: 2,
      name: 'Full Body Workout',
      description: '5-6 exercises • 60-75 min',
      exercises: 18,
      difficulty: 'Beginner',
      icon: 'fitness',
    },
    {
      id: 3,
      name: 'Cardio + Abs',
      description: '4-5 exercises • 30-45 min',
      exercises: 8,
      difficulty: 'All Levels',
      icon: 'heart',
    },
    {
      id: 4,
      name: 'Upper Body Focus',
      description: '6-7 exercises • 50-65 min',
      exercises: 15,
      difficulty: 'Advanced',
      icon: 'body',
    },
  ];

  const weekDays = [
    { day: 'M', name: 'Monday', status: 'completed' },
    { day: 'T', name: 'Tuesday', status: 'completed' },
    { day: 'W', name: 'Wednesday', status: 'completed' },
    { day: 'T', name: 'Thursday', status: 'today' },
    { day: 'F', name: 'Friday', status: 'planned' },
    { day: 'S', name: 'Saturday', status: 'planned' },
    { day: 'S', name: 'Sunday', status: 'planned' },
  ];

  const handleGenerateAI = () => {
    Alert.alert(
      'AI Workout Generator',
      'Generate a personalized workout based on your goals and preferences?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => Alert.alert('Success', 'AI workout generated!') },
      ]
    );
  };

  const handleCreateCustom = () => {
    Alert.alert(
      'Custom Workout',
      'Create your own workout routine from scratch?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: () => Alert.alert('Success', 'Custom workout creator opened!') },
      ]
    );
  };

  const handlePresetPress = (preset) => {
    Alert.alert(
      preset.name,
      `${preset.description}\nDifficulty: ${preset.difficulty}\nExercises: ${preset.exercises}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Workout', onPress: () => Alert.alert('Success', `Starting ${preset.name}!`) },
      ]
    );
  };

  const getDayStyle = (status) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: colors.completed };
      case 'today':
        return { backgroundColor: colors.today };
      default:
        return { backgroundColor: colors.planned };
    }
  };

  const getDayTextStyle = (status) => {
    return status === 'planned' 
      ? { color: colors.planedText } 
      : { color: '#fff' };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return colors.success;
      case 'Intermediate':
        return colors.warning;
      case 'Advanced':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Plans & Presets</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleGenerateAI}
            >
              <LinearGradient 
                colors={[colors.secondary, colors.tertiary]} 
                style={styles.actionGradient}
              >
                <Ionicons name="sparkles" size={24} color="#fff" />
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Generate AI</Text>
                  <Text style={styles.actionSubtitle}>Workout Plan</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleCreateCustom}
            >
              <LinearGradient 
                colors={[colors.primary, '#3b82f6']} 
                style={styles.actionGradient}
              >
                <Ionicons name="create" size={24} color="#fff" />
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Create Custom</Text>
                  <Text style={styles.actionSubtitle}>Preset</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* This Week's Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week's Schedule</Text>
          <View style={styles.weekGrid}>
            {weekDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayCell, getDayStyle(item.status)]}
                onPress={() => setSelectedDay(index)}
              >
                <Text style={[styles.dayText, getDayTextStyle(item.status)]}>
                  {item.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.scheduleInfo}>
            <Text style={styles.selectedDayName}>
              {weekDays[selectedDay]?.name}
            </Text>
            <Text style={styles.selectedDayPlan}>
              {weekDays[selectedDay]?.status === 'completed' ? 'Workout Completed ✅' :
               weekDays[selectedDay]?.status === 'today' ? 'Push Day - Upper Body' :
               'Rest Day'}
            </Text>
          </View>
        </View>

        {/* My Presets */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Presets</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          {workoutPresets.map((preset) => (
            <TouchableOpacity 
              key={preset.id} 
              style={styles.presetItem}
              onPress={() => handlePresetPress(preset)}
            >
              <View style={styles.presetLeft}>
                <View style={[styles.presetIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Ionicons name={preset.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.presetDetails}>
                  <Text style={styles.presetName}>{preset.name}</Text>
                  <Text style={styles.presetDescription}>{preset.description}</Text>
                  <View style={styles.presetMeta}>
                    <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(preset.difficulty)}15` }]}>
                      <Text style={[styles.difficultyText, { color: getDifficultyColor(preset.difficulty) }]}>
                        {preset.difficulty}
                      </Text>
                    </View>
                    <Text style={styles.exerciseCount}>{preset.exercises} exercises</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Workouts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Popular Workouts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Browse All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.popularGrid}>
            <TouchableOpacity style={styles.popularItem}>
              <LinearGradient 
                colors={[colors.success, '#059669']} 
                style={styles.popularGradient}
              >
                <Ionicons name="timer" size={32} color="#fff" />
                <Text style={styles.popularTitle}>HIIT</Text>
                <Text style={styles.popularSubtitle}>15 min</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.popularItem}>
              <LinearGradient 
                colors={[colors.warning, '#d97706']} 
                style={styles.popularGradient}
              >
                <Ionicons name="flame" size={32} color="#fff" />
                <Text style={styles.popularTitle}>Strength</Text>
                <Text style={styles.popularSubtitle}>45 min</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout Tips */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Tip</Text>
          <View style={styles.tipContainer}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={24} color={colors.warning} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Progressive Overload</Text>
              <Text style={styles.tipText}>
                Gradually increase weight, reps, or sets each week to continue making progress and avoid plateaus.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },

  // Text styles
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  // Button styles
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Card styles
  card: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Action button styles
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },

  // Week schedule styles
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleInfo: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedDayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  selectedDayPlan: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Preset styles
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  presetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  presetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  presetDetails: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  presetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Popular workouts styles
  popularGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  popularItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  popularGradient: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 2,
  },
  popularSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },

  // Tip styles
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.warning}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default PlansScreen;