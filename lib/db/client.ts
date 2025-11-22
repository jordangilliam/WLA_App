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

// Helper function to get validated URL
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  return url;
}

// Helper function to get validated anon key
function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  return key;
}

/**
 * Public Supabase client for client-side operations
 * Uses anon key with Row Level Security (RLS) policies
 */
let _supabase: any | null = null;

function getSupabaseClient() {
  if (!_supabase && supabaseUrl && supabaseAnonKey) {
    _supabase = createClient<Database>(
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
  }
  return _supabase;
}

export const supabase = new Proxy({} as any, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      // During build time, return a no-op function
      return () => Promise.resolve({ data: null, error: null });
    }
    return client[prop];
  }
});

/**
 * Admin Supabase client for server-side operations
 * Uses service role key to bypass RLS when needed
 * 
 * ⚠️ WARNING: Only use in server-side code (API routes, server components)
 * Never expose this client to the browser
 */
let _supabaseAdmin: any | null = null;

function getSupabaseAdminClient() {
  if (!_supabaseAdmin && supabaseUrl && supabaseServiceKey) {
    _supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({} as any, {
  get(_target, prop) {
    const client = getSupabaseAdminClient();
    if (!client) {
      if (typeof window === 'undefined' && supabaseServiceKey === undefined) {
        console.warn(
          '⚠️ SUPABASE_SERVICE_ROLE_KEY not set. Admin operations will be limited.'
        );
      }
      // During build time, return a no-op function
      return () => Promise.resolve({ data: null, error: null });
    }
    return client[prop];
  }
});

/**
 * Get Supabase client with user session
 * Use this in server components or API routes when you need the user's session
 */
export function getSupabaseWithSession(accessToken?: string) {
  if (!accessToken) {
    return supabase;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  return createClient<Database>(url, key, {
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
    const { data, error } = await supabaseAdmin.rpc(
      'exec_sql',
      {
        query,
        params,
      } as never
    );
    return { data: (data as T[] | null) ?? null, error };
  } catch (error) {
    return { data: null, error };
  }
}

