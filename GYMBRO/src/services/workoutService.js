import { supabase } from './supabaseClient';

export const workoutService = {
  // Save a workout exercise
  saveWorkout: async (exerciseData) => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Save workout to database
      const { data, error } = await supabase
        .from('workouts')
        .insert([{
          user_id: user.id,
          name: exerciseData.name,
          type: exerciseData.type,
          sets: exerciseData.sets || null,
          reps: exerciseData.reps || null,
          weight: exerciseData.weight || null,
          duration: exerciseData.duration || null,
          notes: exerciseData.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };

    } catch (error) {
      console.error('Error saving workout:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's workouts
  getUserWorkouts: async (limit = 50) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };

    } catch (error) {
      console.error('Error fetching workouts:', error);
      return { success: false, error: error.message };
    }
  },

  // Save calorie entry
  saveCalorieEntry: async (calorieData) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('calorie_entries')
        .insert([{
          user_id: user.id,
          food_item: calorieData.food,
          calories: calorieData.calories,
          meal_time: calorieData.time,
          notes: calorieData.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };

    } catch (error) {
      console.error('Error saving calorie entry:', error);
      return { success: false, error: error.message };
    }
  },

  // Get today's calorie entries
  getTodayCalories: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };

    } catch (error) {
      console.error('Error fetching calorie entries:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete workout
  deleteWorkout: async (workoutId) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };

    } catch (error) {
      console.error('Error deleting workout:', error);
      return { success: false, error: error.message };
    }
  },
};

// For backward compatibility with your existing code
export const saveWorkout = workoutService.saveWorkout;