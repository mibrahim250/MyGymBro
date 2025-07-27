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
  const [activeTab, setActiveTab] = useState('Dashboard');
  const responsiveSize = getResponsiveSize();

  // Animation values for each tab
  const tabAnimations = useRef({
    Dashboard: new Animated.Value(1),
    Workouts: new Animated.Value(1),
    Nutrition: new Animated.Value(1),
    Profile: new Animated.Value(1),
  }).current;

  // Ripple effect animations
  const rippleAnimations = useRef({
    Dashboard: new Animated.Value(0),
    Workouts: new Animated.Value(0),
    Nutrition: new Animated.Value(0),
    Profile: new Animated.Value(0),
  }).current;

  const tabs = [
    { id: 'Dashboard', label: 'Home', icon: '📊' },
    { id: 'Workouts', label: 'Workouts', icon: '💪' },
    { id: 'Nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'Profile', label: 'Profile', icon: '👤' }
  ];

  // Haptic feedback function
  const triggerHaptic = (type = 'light') => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(type === 'light' ? 10 : type === 'medium' ? 20 : 50);
    } else {
      Vibration.vibrate(type === 'light' ? 25 : type === 'medium' ? 50 : 100);
    }
  };

  // Ripple effect
  const createRipple = (tabId) => {
    rippleAnimations[tabId].setValue(0);
    Animated.timing(rippleAnimations[tabId], {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      rippleAnimations[tabId].setValue(0);
    });
  };

  const handleTabPress = (tabId) => {
    // Haptic feedback
    triggerHaptic(activeTab === tabId ? 'medium' : 'light');
    
    // Create ripple effect
    createRipple(tabId);
    
    // Bouncy animation
    Animated.sequence([
      Animated.timing(tabAnimations[tabId], {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(tabAnimations[tabId], {
        toValue: 1,
        tension: 300,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Set active tab
    setActiveTab(tabId);
    
    if (onTabPress) {
      onTabPress(tabId);
    }
  };

  // Long press handler
  const handleLongPress = (tabId) => {
    triggerHaptic('heavy');
    
    // Pulse animation for long press
    Animated.sequence([
      Animated.timing(tabAnimations[tabId], {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnimations[tabId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    console.log(`🔥 Long pressed: ${tabId} - Add special action here!`);
  };

  // Press in/out handlers for hover effects
  const handlePressIn = (tabId) => {
    Animated.timing(tabAnimations[tabId], {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (tabId) => {
    Animated.timing(tabAnimations[tabId], {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
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
              onPressIn={() => handlePressIn(tab.id)}
              onPressOut={() => handlePressOut(tab.id)}
              activeOpacity={0.7}
              delayLongPress={500}
            >
              {/* Ripple effect */}
              <Animated.View
                style={[
                  styles.rippleEffect,
                  {
                    width: responsiveSize.buttonSize * 2,
                    height: responsiveSize.buttonSize * 2,
                    borderRadius: responsiveSize.buttonSize,
                    opacity: rippleAnimations[tab.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.3],
                    }),
                    transform: [
                      {
                        scale: rippleAnimations[tab.id].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
              
              {/* Main button content */}
              <Animated.View
                style={[
                  styles.buttonContent,
                  {
                    transform: [{ scale: tabAnimations[tab.id] }],
                  },
                ]}
              >
                <Animated.Text
                  style={[
                    styles.icon,
                    {
                      fontSize: responsiveSize.iconSize,
                    },
                    isActive && styles.activeIcon,
                  ]}
                >
                  {tab.icon}
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.label,
                    {
                      fontSize: responsiveSize.fontSize,
                    },
                    isActive && styles.activeLabel,
                  ]}
                >
                  {tab.label}
                </Animated.Text>
                
                {/* Active indicator dot */}
                {isActive && <View style={styles.activeIndicator} />}
              </Animated.View>
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
  rippleEffect: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 2,
    top: -20,
    left: -20,
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