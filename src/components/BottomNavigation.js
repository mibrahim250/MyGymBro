import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

const BottomNavigation = ({ onTabPress }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = [
    { id: 'Dashboard', label: 'Home', icon: '📊' },
    { id: 'Workouts', label: 'Workouts', icon: '💪' },
    { id: 'Nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'Profile', label: 'Profile', icon: '👤' }
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (onTabPress) {
      onTabPress(tabId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.icon,
              activeTab === tab.id && styles.activeIcon
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.label,
              activeTab === tab.id && styles.activeLabel
            ]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 20,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 75 : 60,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 55,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transform: [{ scale: 1.05 }],
  },
  icon: {
    fontSize: 20,
    marginBottom: 3,
    opacity: 0.65,
  },
  activeIcon: {
    opacity: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  label: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 1,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
});

export default BottomNavigation;