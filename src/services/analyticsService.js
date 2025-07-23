import { supabase } from './supabase';

export const analyticsService = {
  // Get workout statistics
  getWorkoutStats: async (timeframe = '30days') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const days = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Calculate stats
      const totalWorkouts = data.length;
      const totalSets = data.reduce((sum, workout) => sum + (workout.sets || 0), 0);
      const totalWeight = data.reduce((sum, workout) => sum + (workout.weight || 0) * (workout.sets || 0), 0);
      const avgWorkoutsPerWeek = totalWorkouts / (days / 7);

      // Group by date for chart data
      const workoutsByDate = data.reduce((acc, workout) => {
        const date = new Date(workout.created_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return {
        data: {
          totalWorkouts,
          totalSets,
          totalWeight,
          avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10,
          workoutsByDate,
          timeframe
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get nutrition statistics
  getNutritionStats: async (timeframe = '7days') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const days = timeframe === '7days' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const totalCalories = data.reduce((sum, entry) => sum + (entry.calories || 0), 0);
      const avgCaloriesPerDay = totalCalories / days;

      // Group by date
      const caloriesByDate = data.reduce((acc, entry) => {
        const date = new Date(entry.created_at).toDateString();
        acc[date] = (acc[date] || 0) + (entry.calories || 0);
        return acc;
      }, {});

      return {
        data: {
          totalCalories,
          avgCaloriesPerDay: Math.round(avgCaloriesPerDay),
          caloriesByDate,
          timeframe
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user progress (weight, measurements, etc.)
  getProgressStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};