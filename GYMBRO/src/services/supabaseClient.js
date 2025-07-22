import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings
const supabaseUrl = 'https://btdwbywylxyympacnben.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZHdieXd5bHh5eW1wYWNuYmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjA1MjksImV4cCI6MjA2ODYzNjUyOX0.hl545tyBW2hb9rxbswcpJ4zNEoDyOvGdR38FB-I7Bg4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions for your app
export const dbHelpers = {
  // Create user profile
  createProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...profileData }]);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user profile
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Save workout
  saveWorkout: async (userId, workoutData) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert([{ user_id: userId, ...workoutData }]);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user workouts
  getUserWorkouts: async (userId, limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Save calorie entry
  saveCalorieEntry: async (userId, calorieData) => {
    try {
      const { data, error } = await supabase
        .from('calorie_entries')
        .insert([{ user_id: userId, ...calorieData }]);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get calorie entries
  getCalorieEntries: async (userId, date = null) => {
    try {
      let query = supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', userId);

      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};