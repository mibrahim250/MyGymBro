// screens/OverviewScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Color constants
const colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  successDark: '#059669',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8faff',
  cardBackground: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  progressBg: '#f3f4f6',
};

const OverviewScreen = ({ navigation }) => {
  // Mock data - replace with real data from your database
  const weeklyStats = {
    workouts: 12,
    avgCalories: 2450,
    workoutsCompleted: 5,
    totalWorkouts: 7,
  };

  const recentWorkouts = [
    { name: 'Push Day - Upper Body', daysAgo: 1, duration: 45 },
    { name: 'Leg Day - Lower Body', daysAgo: 2, duration: 60 },
    { name: 'Pull Day - Back & Biceps', daysAgo: 3, duration: 50 },
    { name: 'Cardio & Core', daysAgo: 4, duration: 30 },
  ];

  const weeklyProgress = Math.round((weeklyStats.workoutsCompleted / weeklyStats.totalWorkouts) * 100);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Overview</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Weekly Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient 
              colors={[colors.primary, colors.secondary]} 
              style={styles.statGradient}
            >
              <Ionicons name="barbell" size={28} color="#fff" style={styles.statIcon} />
              <Text style={styles.statNumber}>{weeklyStats.workouts}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient 
              colors={[colors.success, colors.successDark]} 
              style={styles.statGradient}
            >
              <Ionicons name="flame" size={28} color="#fff" style={styles.statIcon} />
              <Text style={styles.statNumber}>{weeklyStats.avgCalories.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Avg Calories</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Progress</Text>
            <Text style={styles.progressPercentage}>{weeklyProgress}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${weeklyProgress}%` }]} />
            </View>
          </View>
          
          <Text style={styles.progressText}>
            {weeklyStats.workoutsCompleted} of {weeklyStats.totalWorkouts} workout days completed
          </Text>
          
          {/* Weekly Goal Visual */}
          <View style={styles.weeklyGoals}>
            <Text style={styles.goalsTitle}>This Week's Goals</Text>
            <View style={styles.goalItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.goalText}>Complete 5 workouts</Text>
              <Text style={styles.goalStatus}>5/5</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="nutrition" size={20} color={colors.warning} />
              <Text style={styles.goalText}>Track calories daily</Text>
              <Text style={styles.goalStatus}>4/7</Text>
            </View>
          </View>
        </View>

        {/* Recent Workouts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Workouts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentWorkouts.map((workout, index) => (
            <TouchableOpacity key={index} style={styles.workoutItem}>
              <View style={styles.workoutLeft}>
                <View style={styles.workoutIcon}>
                  <Ionicons 
                    name={workout.name.includes('Cardio') ? 'heart' : 'barbell'} 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutTime}>
                    {workout.daysAgo === 1 ? 'Yesterday' : `${workout.daysAgo} days ago`} • {workout.duration} min
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Stats</Text>
          
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatItem}>
              <Ionicons name="trophy" size={24} color={colors.warning} />
              <Text style={styles.quickStatNumber}>156</Text>
              <Text style={styles.quickStatLabel}>Total Workouts</Text>
            </View>
            
            <View style={styles.quickStatItem}>
              <Ionicons name="flame" size={24} color={colors.error} />
              <Text style={styles.quickStatNumber}>12.5k</Text>
              <Text style={styles.quickStatLabel}>Calories Burned</Text>
            </View>
            
            <View style={styles.quickStatItem}>
              <Ionicons name="time" size={24} color={colors.success} />
              <Text style={styles.quickStatNumber}>42</Text>
              <Text style={styles.quickStatLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.quickStatItem}>
              <Ionicons name="trending-up" size={24} color={colors.primary} />
              <Text style={styles.quickStatNumber}>85%</Text>
              <Text style={styles.quickStatLabel}>Goal Rate</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Achievements</Text>
          
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Ionicons name="medal" size={24} color={colors.warning} />
            </View>
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDescription}>Completed 5 workouts this week</Text>
            </View>
            <Text style={styles.achievementDate}>Today</Text>
          </View>
          
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Ionicons name="flame" size={24} color={colors.error} />
            </View>
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementTitle}>Calorie Crusher</Text>
              <Text style={styles.achievementDescription}>Burned 500+ calories in one session</Text>
            </View>
            <Text style={styles.achievementDate}>2d ago</Text>
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

  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },

  // Progress styles
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.progressBg,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Weekly goals styles
  weeklyGoals: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  goalStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Workout item styles
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  workoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  workoutTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Quick stats styles
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.progressBg,
    borderRadius: 12,
    marginBottom: 12,
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Achievement styles
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.warning}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  achievementDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default OverviewScreen;