import React, { useState, useRef } from 'react';
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

const { width, height } = Dimensions.get('window');

// Dynamic sizing based on screen size
const getResponsiveSize = () => {
  const isSmallScreen = width < 375; // iPhone SE, small phones
  const isMediumScreen = width >= 375 && width < 414; // iPhone 12/13/14
  const isLargeScreen = width >= 414; // iPhone Plus, Pro Max, tablets
  
  return {
    navHeight: isSmallScreen ? 65 : isMediumScreen ? 70 : 75, // Taller like dock
    navWidth: Math.min(width * 0.85, 320), // 85% of screen width, max 320px (wider)
    bottomPadding: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    topPadding: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    iconSize: isSmallScreen ? 22 : isMediumScreen ? 24 : 26, // Bigger icons like dock
    fontSize: isSmallScreen ? 9 : isMediumScreen ? 10 : 11,
    buttonSize: isSmallScreen ? 50 : isMediumScreen ? 55 : 60, // Square buttons like dock
    borderRadius: 25, // More rounded like macOS dock
    horizontalPadding: isSmallScreen ? 18 : isMediumScreen ? 22 : 25,
  };
};

const BottomNavigation = ({ onTabPress }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isVisible, setIsVisible] = useState(false);
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

  // Glow effect animations
  const glowAnimations = useRef({
    Dashboard: new Animated.Value(0),
    Workouts: new Animated.Value(0),
    Nutrition: new Animated.Value(0),
    Profile: new Animated.Value(0),
  }).current;

  // Sliding indicator animation
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const navBarOpacity = useRef(new Animated.Value(0)).current;
  const navBarScale = useRef(new Animated.Value(0.8)).current;

  const tabs = [
    { id: 'Dashboard', label: 'Home', icon: '📊', sound: 'click1' },
    { id: 'Workouts', label: 'Workouts', icon: '💪', sound: 'click2' },
    { id: 'Nutrition', label: 'Nutrition', icon: '🥗', sound: 'click3' },
    { id: 'Profile', label: 'Profile', icon: '👤', sound: 'click4' }
  ];

  // Entrance animation on mount
  useEffect(() => {
    setIsVisible(true);
    Animated.parallel([
      Animated.spring(navBarOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(navBarScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered icon entrance
    tabs.forEach((tab, index) => {
      setTimeout(() => {
        Animated.spring(tabAnimations[tab.id], {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }, 100 + index * 100);
    });
  }, []);

  // Haptic feedback function
  const triggerHaptic = (type = 'light') => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').Haptics || Vibration;
      if (HapticFeedback.trigger) {
        HapticFeedback.trigger(type);
      } else {
        Vibration.vibrate(type === 'light' ? 10 : type === 'medium' ? 20 : 50);
      }
    } else {
      Vibration.vibrate(type === 'light' ? 25 : type === 'medium' ? 50 : 100);
    }
  };

  // Sound effect function (mock - you'd need react-native-sound for real sounds)
  const playSound = (soundType) => {
    // Mock sound - in real app you'd use react-native-sound
    console.log(`🔊 Playing sound: ${soundType}`);
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

  // Glow effect
  const createGlow = (tabId, isActive) => {
    Animated.timing(glowAnimations[tabId], {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Update sliding indicator position
  const updateIndicatorPosition = (tabIndex) => {
    const newPosition = (tabIndex * responsiveSize.navWidth) / tabs.length;
    Animated.spring(indicatorPosition, {
      toValue: newPosition,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleTabPress = (tabId) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const currentTab = tabs.find(tab => tab.id === tabId);
    
    // Haptic feedback
    triggerHaptic(activeTab === tabId ? 'medium' : 'light');
    
    // Sound effect
    playSound(currentTab.sound);
    
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

    // Update glow effects
    Object.keys(glowAnimations).forEach(key => {
      createGlow(key, key === tabId);
    });

    // Update sliding indicator
    updateIndicatorPosition(tabIndex);
    
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
      <Animated.View style={[
        styles.navBar, 
        {
          width: responsiveSize.navWidth,
          height: responsiveSize.navHeight,
          paddingTop: responsiveSize.topPadding,
          paddingBottom: responsiveSize.bottomPadding,
          paddingHorizontal: responsiveSize.horizontalPadding,
          borderRadius: responsiveSize.borderRadius,
          opacity: navBarOpacity,
          transform: [{ scale: navBarScale }],
        }
      ]}>
        {/* Sliding indicator background */}
        <Animated.View
          style={[
            styles.slidingIndicator,
            {
              width: responsiveSize.buttonSize + 8,
              height: responsiveSize.buttonSize + 8,
              borderRadius: responsiveSize.borderRadius * 0.6,
              transform: [
                {
                  translateX: indicatorPosition.interpolate({
                    inputRange: [0, responsiveSize.navWidth],
                    outputRange: [0, responsiveSize.navWidth / tabs.length - responsiveSize.buttonSize / 2],
                  }),
                },
              ],
            },
          ]}
        />
        
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
              
              {/* Glow effect */}
              <Animated.View
                style={[
                  styles.glowEffect,
                  {
                    width: responsiveSize.buttonSize + 20,
                    height: responsiveSize.buttonSize + 20,
                    borderRadius: responsiveSize.buttonSize + 10,
                    opacity: glowAnimations[tab.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.4],
                    }),
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
                      opacity: isActive ? 1 : 0.8,
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
                      opacity: isActive ? 1 : 0.8,
                    },
                    isActive && styles.activeLabel,
                  ]}
                >
                  {tab.label}
                </Animated.Text>
                
                {/* Active indicator dot */}
                {isActive && (
                  <Animated.View 
                    style={[
                      styles.activeIndicator,
                      {
                        opacity: glowAnimations[tab.id],
                      }
                    ]} 
                  />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25, // More space from bottom
    left: 15,   // Less margin for wider nav
    right: 15,  // Less margin for wider nav
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // More transparent like macOS dock
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

  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  slidingIndicator: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
    left: 15,
    top: 12,
  },

  rippleEffect: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 2,
    top: -20,
    left: -20,
  },

  glowEffect: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    zIndex: 1,
    top: -10,
    left: -10,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 1.1 }], // Slight scale up like macOS dock
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