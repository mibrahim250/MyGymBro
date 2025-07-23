// testServices.mjs
import { createClient } from '@supabase/supabase-js';

// Create a Node.js compatible client (without AsyncStorage)
const supabaseUrl = 'https://btdwbywylxyympacnben.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZHdieXd5bHh5eW1wYWNuYmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjA1MjksImV4cCI6MjA2ODYzNjUyOX0.hl545tyBW2hb9rxbswcpJ4zNEoDyOvGdR38FB-I7Bg4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🧪 Testing Supabase connection...\n');

  // Test each table from your database
  const tables = [
    'user_stats',
    'workouts', 
    'exercises',
    'calorie_entries',
    'workout_templates',
    'profiles'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Connected (${data?.length || 0} records found)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  console.log('\n🔍 Testing auth (without login)...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && error.message.includes('session')) {
      console.log('✅ Auth: Working (no active session, as expected)');
    } else if (user) {
      console.log('✅ Auth: User found:', user.email);
    }
  } catch (err) {
    console.log('❌ Auth error:', err.message);
  }
}

testConnection();