import supabase from './supabaseClient';

export const saveWorkout = async (workout) => {
  const { data, error } = await supabase
    .from('workouts')
    .insert([workout]);
  if (error) throw error;
  return data;
};
