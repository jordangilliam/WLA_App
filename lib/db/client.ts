/**
 * Supabase Database Client
 * 
 * This file provides a type-safe Supabase client for database operations.
 * Uses environment variables for configuration and provides both
 * server-side (with service role) and client-side access.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

/**
 * Public Supabase client for client-side operations
 * Uses anon key with Row Level Security (RLS) policies
 */
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Admin Supabase client for server-side operations
 * Uses service role key to bypass RLS when needed
 * 
 * ⚠️ WARNING: Only use in server-side code (API routes, server components)
 * Never expose this client to the browser
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

if (!supabaseAdmin) {
  console.warn(
    '⚠️ SUPABASE_SERVICE_ROLE_KEY not set. Admin operations will be limited.'
  );
}

/**
 * Get Supabase client with user session
 * Use this in server components or API routes when you need the user's session
 */
export function getSupabaseWithSession(accessToken?: string) {
  if (!accessToken) {
    return supabase;
  }

  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * Helper to check if database is connected
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch (e) {
    console.error('Database connection check failed:', e);
    return false;
  }
}

/**
 * Helper to execute raw SQL (admin only)
 */
export async function executeSql<T = any>(
  query: string,
  params?: any[]
): Promise<{ data: T[] | null; error: any }> {
  if (!supabaseAdmin) {
    return {
      data: null,
      error: new Error('Admin client not available'),
    };
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      query,
      params,
    });
    return { data: data as T[], error };
  } catch (error) {
    return { data: null, error };
  }
}

