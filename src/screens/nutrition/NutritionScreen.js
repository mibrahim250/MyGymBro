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
          food_name: calorieData.food_name,
          calories: calorieData.calories,
          notes: calorieData.notes || null,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get today's calories (returns total number)
  getTodayCalories: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('calories')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

      if (error) {
        console.error('Error getting today calories:', error);
        return 0;
      }
      
      return data.reduce((total, entry) => total + (entry.calories || 0), 0);
    } catch (error) {
      console.error('Error in getTodayCalories:', error);
      return 0;
    }
  },

  // Get nutrition entries by date
  getNutritionByDate: async (date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const startOfDay = new Date(date + 'T00:00:00.000Z');
      const endOfDay = new Date(date + 'T23:59:59.999Z');

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching nutrition by date:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNutritionByDate:', error);
      return [];
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
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entryId)
        .eq('user_id', user.id)
        .select()
        .single();

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

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
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

  // Get monthly nutrition stats
  getMonthlyNutritionStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('calories, created_at')
        .eq('user_id', user.id)
        .gte('created_at', monthAgo.toISOString());

      if (error) throw error;

      const totalCalories = data.reduce((sum, entry) => sum + (entry.calories || 0), 0);
      const avgCaloriesPerDay = data.length > 0 ? Math.round(totalCalories / 30) : 0;
      const totalEntries = data.length;

      return { 
        data: { 
          totalCalories, 
          avgCaloriesPerDay, 
          totalEntries,
          period: '30 days'
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Search food entries
  searchFoodEntries: async (searchTerm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .ilike('food_name', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Get favorite foods (most logged)
  getFavoriteFoods: async (limit = 10) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('food_name, calories')
        .eq('user_id', user.id);

      if (error) throw error;

      // Group by food name and count occurrences
      const foodCounts = data.reduce((acc, entry) => {
        const name = entry.food_name.toLowerCase();
        if (!acc[name]) {
          acc[name] = {
            name: entry.food_name,
            count: 0,
            avgCalories: 0,
            totalCalories: 0
          };
        }
        acc[name].count += 1;
        acc[name].totalCalories += entry.calories;
        acc[name].avgCalories = Math.round(acc[name].totalCalories / acc[name].count);
        return acc;
      }, {});

      // Sort by count and return top items
      const favoriteFoods = Object.values(foodCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return { data: favoriteFoods, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Bulk save calorie entries
  bulkSaveCalorieEntries: async (entries) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const entriesWithUserId = entries.map(entry => ({
        user_id: user.id,
        food_name: entry.food_name,
        calories: entry.calories,
        notes: entry.notes || null,
        created_at: entry.created_at || new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('calorie_entries')
        .insert(entriesWithUserId)
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};