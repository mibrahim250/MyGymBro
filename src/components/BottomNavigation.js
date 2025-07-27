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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(20px)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.3,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 15,
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 85 : 65,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    minWidth: 65,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ scale: 1.02 }],
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.7,
  },
  activeIcon: {
    opacity: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
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