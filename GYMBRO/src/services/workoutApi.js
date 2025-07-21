
import { supabase } from './supabase';

export async function fetchWorkouts(userId) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function logWorkout(workout) {
  const { data, error } = await supabase
    .from('workouts')
    .insert([workout]);

  if (error) throw error;
  return data;
}
