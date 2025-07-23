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
          ...workoutData,
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user workouts
  getUserWorkouts: async (limit = 50) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get exercises
  getExercises: async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get workout templates
  getWorkoutTemplates: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workout_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};