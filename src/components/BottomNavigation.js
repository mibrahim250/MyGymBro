import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Dynamic sizing based on screen size
const getResponsiveSize = () => {
  const isSmallScreen = width < 375; // iPhone SE, small phones
  const isMediumScreen = width >= 375 && width < 414; // iPhone 12/13/14
  const isLargeScreen = width >= 414; // iPhone Plus, Pro Max, tablets
  
  return {
    navHeight: isSmallScreen ? 50 : isMediumScreen ? 55 : 60,
    bottomPadding: Platform.OS === 'ios' ? 
      (isSmallScreen ? 15 : isMediumScreen ? 18 : 20) : 
      (isSmallScreen ? 6 : isMediumScreen ? 7 : 8),
    topPadding: isSmallScreen ? 4 : isMediumScreen ? 5 : 6,
    iconSize: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
    fontSize: isSmallScreen ? 8 : isMediumScreen ? 8.5 : 9,
    buttonWidth: isSmallScreen ? 45 : isMediumScreen ? 47 : 50,
    borderRadius: isSmallScreen ? 18 : isMediumScreen ? 19 : 20,
    horizontalPadding: Math.max(10, width * 0.025), // 2.5% of screen width, minimum 10
  };
};

const BottomNavigation = ({ onTabPress }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const responsiveSize = getResponsiveSize();

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
      <View style={[styles.navBar, {
        height: responsiveSize.navHeight,
        paddingTop: responsiveSize.topPadding,
        paddingBottom: responsiveSize.bottomPadding,
        paddingHorizontal: responsiveSize.horizontalPadding,
        borderTopLeftRadius: responsiveSize.borderRadius,
        borderTopRightRadius: responsiveSize.borderRadius,
      }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              {
                minWidth: responsiveSize.buttonWidth,
                borderRadius: responsiveSize.borderRadius * 0.5,
              },
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.icon,
              {
                fontSize: responsiveSize.iconSize,
              },
              activeTab === tab.id && styles.activeIcon
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.label,
              {
                fontSize: responsiveSize.fontSize,
              },
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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ scale: 1.02 }],
  },
  icon: {
    marginBottom: 2,
    opacity: 0.7,
  },
  activeIcon: {
    opacity: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  label: {
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