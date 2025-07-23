import { supabase } from './supabase';

export const profileService = {
  // Create user profile after signup
  createProfile: async (profileData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          ...profileData,
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user profile
  updateProfile: async (updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (fileUri, fileName) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Convert file to blob for upload
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const filePath = `profiles/${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, blob);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update profile with picture URL
      await profileService.updateProfile({ 
        profile_picture: urlData.publicUrl 
      });

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};