import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* top-level screens – stub the files you haven’t built yet */
import DashboardScreen  from '../screens/dashboard/DashboardScreen';
import NutritionScreen  from '../screens/nutrition/NutritionScreen';
import WorkoutStack     from './WorkoutStack';        // see section 3
import TrackerScreen    from '../screens/workouts/TrackerScreen';
import ProfileScreen    from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

/* quick emoji icons until you plug in vector-icons */
const Icon = ({ route, color }) => {
  const emoji = {
    Dashboard:'🏠', Workouts:'💪', Nutrition:'🍎', Tracker:'📝', Profile:'👤'
  }[route.name] || '❓';
  return <Text style={{ fontSize:22,color }}>{emoji}</Text>;
};

export default function TabNavigator({ onLogout }) {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown:false,
      tabBarShowLabel:false,
      tabBarStyle:{ backgroundColor:'rgba(0,0,0,0.7)', height:70, borderTopWidth:0 },
      tabBarIcon: ({ color }) => <Icon route={route} color={color}/>
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen}/>
      <Tab.Screen name="Workouts"  component={WorkoutStack}/>
      <Tab.Screen name="Nutrition" component={NutritionScreen}/>
      <Tab.Screen name="Tracker"   component={TrackerScreen}/>
      <Tab.Screen name="Profile">
        {() => <ProfileScreen onLogout={onLogout}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
