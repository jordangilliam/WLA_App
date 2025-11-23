import { supabaseAdmin } from '@/lib/db/client';

/**
 * Database helpers for testing
 */

export async function createTestUser(userData: {
  email: string;
  name: string;
  role: string;
}): Promise<string | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      email: userData.email,
      name: userData.name,
      role: userData.role,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating test user:', error);
    return null;
  }

  return data?.id || null;
}

export async function deleteTestUser(userId: string): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  await supabaseAdmin.from('users').delete().eq('id', userId);
}

export async function resetUserPoints(userId: string): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  await supabaseAdmin.from('user_points').delete().eq('user_id', userId);
}

export async function getTestUserPoints(userId: string): Promise<number> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data } = await supabaseAdmin
    .from('user_points')
    .select('points')
    .eq('user_id', userId);

  return data?.reduce((sum, record) => sum + (record.points || 0), 0) || 0;
}

