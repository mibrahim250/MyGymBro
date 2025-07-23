import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    todayWorkouts: 0,
    todayCalories: 0,
    weeklyGoal: 0,
  });

  const updateUserStats = (newStats) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const value = {
    userStats,
    updateUserStats,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
