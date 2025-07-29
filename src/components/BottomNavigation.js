import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Vibration,
} from 'react-native';

const { useState, useRef } = React;
const { width, height } = Dimensions.get('window');

// Dynamic sizing based on screen size
const getResponsiveSize = () => {
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;
  const isLargeScreen = width >= 414;
  
  return {
    navHeight: isSmallScreen ? 65 : isMediumScreen ? 70 : 75,
    navWidth: Math.min(width * 0.85, 320),
    bottomPadding: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    topPadding: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    iconSize: isSmallScreen ? 22 : isMediumScreen ? 24 : 26,
    fontSize: isSmallScreen ? 9 : isMediumScreen ? 10 : 11,
    buttonSize: isSmallScreen ? 50 : isMediumScreen ? 55 : 60,
    borderRadius: 25,
    horizontalPadding: isSmallScreen ? 18 : isMediumScreen ? 22 : 25,
  };
};

const BottomNavigation = ({ onTabPress }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const responsiveSize = getResponsiveSize();

  // Animation values for each tab (simplified)
  const tabAnimations = useRef({
    Home: new Animated.Value(1),
    Calendar: new Animated.Value(1),
    Tracker: new Animated.Value(1),
    Profile: new Animated.Value(1),
  }).current;

  const tabs = [
    { id: 'Home', label: 'Home', icon: '⌂' },
    { id: 'Calendar', label: 'Calendar', icon: '◫' },
    { id: 'Tracker', label: 'Tracker', icon: '□' },
    { id: 'Profile', label: 'Profile', icon: '○' }
  ];

  // Haptic feedback function
  const triggerHaptic = (type = 'light') => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(type === 'light' ? 10 : type === 'medium' ? 20 : 50);
    } else {
      Vibration.vibrate(type === 'light' ? 25 : type === 'medium' ? 50 : 100);
    }
  };

  const handleTabPress = (tabId) => {
    // Haptic feedback
    triggerHaptic(activeTab === tabId ? 'medium' : 'light');
    
    // Set active tab
    setActiveTab(tabId);
    
    if (onTabPress) {
      onTabPress(tabId);
    }
  };

  // Long press handler
  const handleLongPress = (tabId) => {
    triggerHaptic('heavy');
    console.log(`🔥 Long pressed: ${tabId} - Add special action here!`);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.navBar, 
        {
          width: responsiveSize.navWidth,
          height: responsiveSize.navHeight,
          paddingTop: responsiveSize.topPadding,
          paddingBottom: responsiveSize.bottomPadding,
          paddingHorizontal: responsiveSize.horizontalPadding,
          borderRadius: responsiveSize.borderRadius,
        }
      ]}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                {
                  width: responsiveSize.buttonSize,
                  height: responsiveSize.buttonSize,
                  borderRadius: responsiveSize.borderRadius * 0.6,
                },
                isActive && styles.activeTab,
              ]}
              onPress={() => handleTabPress(tab.id)}
              onLongPress={() => handleLongPress(tab.id)}
              activeOpacity={0.7}
              delayLongPress={500}
            >
              {/* Main button content */}
              <View style={styles.buttonContent}>
                <Text
                  style={[
                    styles.icon,
                    {
                      fontSize: responsiveSize.iconSize,
                    },
                    isActive && styles.activeIcon,
                  ]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: responsiveSize.fontSize,
                    },
                    isActive && styles.activeLabel,
                  ]}
                >
                  {tab.label}
                </Text>
                
                {/* Active indicator dot */}
                {isActive && <View style={styles.activeIndicator} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    left: 15,
    right: 15,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(25px)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  icon: {
    marginBottom: 3,
    opacity: 0.8,
  },
  activeIcon: {
    opacity: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});

export default BottomNavigation;