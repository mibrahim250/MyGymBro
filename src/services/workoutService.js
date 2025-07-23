import { supabase } from './supabase';

export const nutritionService = {
  // Save calorie entry
  saveCalorieEntry: async (calorieData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calorie_entries')
        .insert([{
          user_id: user.id,
          ...calorieData,
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get today's calories
  getTodayCalories: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get calorie entries by date range
  getCalorieEntries: async (startDate, endDate) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete calorie entry
  deleteCalorieEntry: async (entryId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calorie_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update calorie entry
  updateCalorieEntry: async (entryId, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calorie_entries')
        .update(updates)
        .eq('id', entryId)
        .eq('user_id', user.id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get weekly nutrition summary
  getWeeklyNutritionSummary: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by day and calculate totals
      const dailyTotals = data.reduce((acc, entry) => {
        const date = new Date(entry.created_at).toDateString();
        if (!acc[date]) {
          acc[date] = { calories: 0, entries: 0 };
        }
        acc[date].calories += entry.calories || 0;
        acc[date].entries += 1;
        return acc;
      }, {});

      return { data: dailyTotals, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};