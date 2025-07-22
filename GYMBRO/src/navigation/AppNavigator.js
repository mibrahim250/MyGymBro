// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ONLY import LoginScreen for now
import LoginScreen from '../screens/LoginScreen';

// Remove these lines completely:
// import HomeScreen from '../screens/HomeScreen';  ← DELETE
// import GymBroApp from '../screens/GymBroApp';    ← DELETE

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Temporary placeholder screens (until we create the real files)
const WorkoutScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8faff' }}>
    <Ionicons name="barbell" size={48} color="#6366f1" />
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#1f2937' }}>Workout Screen</Text>
    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Main workout tracking goes here</Text>
  </View>
);

const OverviewScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8faff' }}>
    <Ionicons name="stats-chart" size={48} color="#6366f1" />
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#1f2937' }}>Overview Screen</Text>
    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Stats and progress go here</Text>
  </View>
);

const PlansScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8faff' }}>
    <Ionicons name="calendar" size={48} color="#6366f1" />
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#1f2937' }}>Plans Screen</Text>
    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Workout plans go here</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8faff' }}>
    <Ionicons name="person" size={48} color="#6366f1" />
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#1f2937' }}>Profile Screen</Text>
    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>User profile goes here</Text>
  </View>
);

// Main Tab Navigator with Bottom Tabs
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Workout') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Overview') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Plans') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Plans" component={PlansScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true to see tabs immediately
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Home" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;