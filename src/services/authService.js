// ==============================================
// ENHANCED AUTHENTICATION SERVICE
// Replace your existing authService.js with this
// ==============================================

import { supabase } from './supabase';

export const authService = {
  // Enhanced sign up with profile creation
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
          },
        },
      });

      if (error) throw error;

      // If signup successful and user is confirmed, create profile
      if (data.user && !data.user.email_confirmed_at) {
        // User needs to confirm email
        return { 
          data, 
          error: null, 
          message: 'Please check your email to confirm your account' 
        };
      } else if (data.user) {
        // Auto-create profile for confirmed users
        await authService.createUserProfile(data.user.id, {
          email: data.user.email,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          age: userData.age || null,
          height: userData.height || null,
          weight: userData.weight || null,
          fitness_level: userData.fitnessLevel || 'beginner',
          goals: userData.goals || [],
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign in with profile check
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if profile exists, create if not
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          await authService.createUserProfile(data.user.id, {
            email: data.user.email,
            first_name: data.user.user_metadata?.first_name || '',
            last_name: data.user.user_metadata?.last_name || '',
          });
        }
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Get current user with profile
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { user: null, profile: null, error };
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return { 
        user, 
        profile: profileError ? null : profile, 
        error: null 
      };
    } catch (error) {
      return { user: null, profile: null, error };
    }
  },

  // Create user profile
  createUserProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'mygymbro://reset-password',
      });
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Check if user email is verified
  isEmailVerified: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return false;
      return !!user.email_confirmed_at;
    } catch (error) {
      return false;
    }
  },

  // Resend email confirmation
  resendConfirmation: async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  },
};