// Quick test to verify Supabase connection works
// Run this with: .\node-portable\node.exe test-db-connection.js

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing Supabase Connection...\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.log('Make sure .env.local has:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL');
  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check organizations table
    console.log('\n📊 Test 1: Reading organizations...');
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('*');
    
    if (orgError) {
      console.error('❌ Organizations query failed:', orgError.message);
      return false;
    }
    
    console.log(`✅ Found ${orgs.length} organization(s)`);
    if (orgs.length > 0) {
      console.log(`   → ${orgs[0].name}`);
    }

    // Test 2: Check users table
    console.log('\n📊 Test 2: Reading users...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('count');
    
    if (userError) {
      console.error('❌ Users query failed:', userError.message);
      return false;
    }
    
    console.log(`✅ Users table accessible`);

    // Test 3: Check classes table
    console.log('\n📊 Test 3: Reading classes...');
    const { data: classes, error: classError } = await supabase
      .from('classes')
      .select('count');
    
    if (classError) {
      console.error('❌ Classes query failed:', classError.message);
      return false;
    }
    
    console.log(`✅ Classes table accessible`);

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n✅ Your database is connected and working!');
    console.log('✅ Ready to start your app with: npm run dev');
    
    return true;

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    return false;
  }
}

testConnection();

