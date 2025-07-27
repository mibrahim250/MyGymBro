import { supabase } from './supabase';

export const workoutService = {
  // Save workout
  saveWorkout: async (workoutData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workouts')
        .insert([{
          user_id: user.id,
          exercise_name: workoutData.exercise_name,
          sets: workoutData.sets,
          reps: workoutData.reps,
          weight: workoutData.weight || null,
          duration: workoutData.duration || null,
          notes: workoutData.notes || null,
          date: workoutData.date || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user workouts - THIS IS THE METHOD THAT WAS MISSING
  getUserWorkouts: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return []; // Return empty array instead of undefined
      }

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workouts:', error);
        return []; // Return empty array on error
      }

      return data || []; // Always return array
    } catch (error) {
      console.error('Error in getUserWorkouts:', error);
      return []; // Return empty array on exception
    }
  },

  // Get workouts by date
  getWorkoutsByDate: async (date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workouts by date:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getWorkoutsByDate:', error);
      return [];
    }
  },

  // Delete workout
  deleteWorkout: async (workoutId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get exercises from exercises table
  getExercises: async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  },
};