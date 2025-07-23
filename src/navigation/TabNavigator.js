import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { colors } from '../styles/colors';

// Import screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import WorkoutListScreen from '../screens/workouts/WorkoutListScreen';
import AddWorkoutScreen from '../screens/workouts/AddWorkoutScreen';
import WorkoutDetailScreen from '../screens/workouts/WorkoutDetailScreen';
import NutritionScreen from '../screens/nutrition/NutritionScreen';
import AddFoodScreen from '../screens/nutrition/AddFoodScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Workout Stack Navigator
const WorkoutStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    </Stack.Navigator>
  );
};

// Nutrition Stack Navigator
const NutritionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NutritionMain" component={NutritionScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
    </Stack.Navigator>
  );
};

// Simple tab icon component (you can replace with actual icons later)
const TabIcon = ({ name, color }) => {
  const getIcon = () => {
    switch (name) {
      case 'dashboard':
        return '📊';
      case 'workouts':
        return '💪';
      case 'nutrition':
        return '🍎';
      case 'profile':
        return '👤';
      default:
        return '📱';
    }
  };

  return (
    <Text style={{ fontSize: 20, color }}>
      {getIcon()}
    </Text>
  );
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <TabIcon name="dashboard" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutStack}
        options={{
          tabBarLabel: 'Workouts',
          tabBarIcon: ({ color }) => (
            <TabIcon name="workouts" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Nutrition" 
        component={NutritionStack}
        options={{
          tabBarLabel: 'Nutrition',
          tabBarIcon: ({ color }) => (
            <TabIcon name="nutrition" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabIcon name="profile" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;