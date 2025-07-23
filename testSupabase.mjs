// testSupabase.mjs
import { createClient } from '@supabase/supabase-js';

// Use the same credentials as your supabase.js file
const supabaseUrl = 'https://btdwbywylxyympacnben.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZHdieXd5bHh5eW1wYWNuYmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjA1MjksImV4cCI6MjA2ODYzNjUyOX0.hl545tyBW2hb9rxbswcpJ4zNEoDyOvGdR38FB-I7Bg4';

// Create client without AsyncStorage for Node.js testing
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing Supabase connection...');

try {
  // Test with a table that exists - I can see 'user_stats' in your screenshot
  const { data, error } = await supabase.from('user_stats').select('*').limit(1);
  
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Supabase connected successfully!');
    console.log('Data:', data);
  }
} catch (err) {
  console.error('❌ Connection failed:', err.message);
}