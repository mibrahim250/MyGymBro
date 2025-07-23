import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../../styles/colors';
import { authService } from '../../services/authService';
import { workoutService } from '../../services/workoutService';
import { nutritionService } from '../../services/nutritionService';

const DashboardScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [todayStats, setTodayStats] = useState({
    workouts: 0,
    calories: 0,
    targetCalories: 2000,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get current user with profile
      const { user, profile } = await authService.getCurrentUser();
      setUserProfile(profile);

      if (user) {
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's workouts
        const workouts = await workoutService.getWorkoutsByDate(today);
        
        // Get today's calories
        const calories = await nutritionService.getTodayCalories();

        setTodayStats({
          workouts: workouts.length,
          calories: calories || 0,
          targetCalories: profile?.daily_calorie_goal || 2000,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const calorieProgress = todayStats.targetCalories > 0 
    ? (todayStats.calories / todayStats.targetCalories) * 100 
    : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>
            {userProfile?.first_name || userProfile?.name || 'User'}!
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayStats.workouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {todayStats.calories}/{todayStats.targetCalories}
            </Text>
            <Text style={styles.statLabel}>Calories</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(calorieProgress, 100)}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={() => navigation.navigate('Workouts', { screen: 'WorkoutList' })}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Workouts</Text>
            <Text style={styles.actionSubtitle}>Track your exercises</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={() => navigation.navigate('Nutrition', { screen: 'NutritionMain' })}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Nutrition</Text>
            <Text style={styles.actionSubtitle}>Log your meals</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Profile</Text>
            <Text style={styles.actionSubtitle}>Update your info</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: colors.surface,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;