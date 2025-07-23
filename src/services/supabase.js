import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://btdwbywylxyympacnben.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZHdieXd5bHh5eW1wYWNuYmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjA1MjksImV4cCI6MjA2ODYzNjUyOX0.hl545tyBW2hb9rxbswcpJ4zNEoDyOvGdR38FB-I7Bg4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});