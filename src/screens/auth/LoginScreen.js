// ==============================================
// NAVIGATION FOUNDATION FOR NIKHIL
// ==============================================

// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

// ==============================================
// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import WorkoutListScreen from '../screens/workouts/WorkoutListScreen';
import AddWorkoutScreen from '../screens/workouts/AddWorkoutScreen';
import NutritionScreen from '../screens/nutrition/NutritionScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Workout Stack Navigator
const WorkoutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WorkoutList" 
        component={WorkoutListScreen}
        options={{ title: 'Workouts' }}
      />
      <Stack.Screen 
        name="AddWorkout" 
        component={AddWorkoutScreen}
        options={{ title: 'Add Workout' }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Workouts':
              iconName = 'fitness-center';
              break;
            case 'Nutrition':
              iconName = 'restaurant';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workouts" component={WorkoutStack} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

// ==============================================
// FOLDER STRUCTURE FOR NIKHIL TO CREATE:
// ==============================================

/*
Create these folders and files in your src directory:

src/
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   └── RegisterScreen.js
│   ├── dashboard/
│   │   └── DashboardScreen.js
│   ├── workouts/
│   │   ├── WorkoutListScreen.js
│   │   └── AddWorkoutScreen.js
│   ├── nutrition/
│   │   └── NutritionScreen.js
│   ├── profile/
│   │   └── ProfileScreen.js
│   └── LoadingScreen.js
├── navigation/
│   ├── AuthNavigator.js
│   └── TabNavigator.js
└── components/
    ├── common/
    ├── workouts/
    ├── nutrition/
    └── profile/

NIKHIL'S TASKS:
1. Create all the screen files with the foundation code above
2. Build out the UI components for each screen
3. Add forms, buttons, lists, and user interactions
4. Connect to the Supabase services that are already set up
5. Add proper navigation between screens
6. Style everything according to the design system

The services (authService, workoutService, nutritionService) are already built and ready to use!
*/