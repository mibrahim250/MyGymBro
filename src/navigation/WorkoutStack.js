import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WorkoutListScreen from '../screens/workouts/WorkoutListScreen';
import AddWorkoutScreen from '../screens/workouts/AddWorkoutScreen';
import WorkoutDetailScreen from '../screens/workouts/WorkoutDetailScreen';

const Stack = createStackNavigator();

const WorkoutStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    </Stack.Navigator>
  );
};

export default WorkoutStack;
