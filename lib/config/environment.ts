/**
 * Environment Configuration
 * 
 * Centralized environment variable validation and type-safe access.
 * Fails fast at startup if required variables are missing.
 */

import { z } from 'zod';

/**
 * Environment variable schema
 * Add new environment variables here with their validation rules
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase (Database)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  AZURE_AD_CLIENT_ID: z.string().optional(),
  AZURE_AD_CLIENT_SECRET: z.string().optional(),
  AZURE_AD_TENANT_ID: z.string().optional(),

  // Mapbox
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),

  // Stripe (Payments)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // External APIs
  OPENAI_API_KEY: z.string().optional(),
  PFBC_API_KEY: z.string().optional(),

  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Monitoring & Analytics
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_FIREBASE_CONFIG: z.string().optional(),

  // Feature Flags
  ENABLE_PAYMENTS: z.string().transform(val => val === 'true').default('false'),
  ENABLE_AI_FEATURES: z.string().transform(val => val === 'true').default('true'),
  ENABLE_ADMIN_DASHBOARD: z.string().transform(val => val === 'true').default('true'),
});

/**
 * Parsed and validated environment variables
 */
export type Environment = z.infer<typeof envSchema>;

let _env: Environment | null = null;

/**
 * Get validated environment configuration
 * Throws an error if validation fails
 */
export function getEnv(): Environment {
  if (_env) {
    return _env;
  }

  try {
    _env = envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
      AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
      AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
      NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      PFBC_API_KEY: process.env.PFBC_API_KEY,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      SENTRY_DSN: process.env.SENTRY_DSN,
      NEXT_PUBLIC_FIREBASE_CONFIG: process.env.NEXT_PUBLIC_FIREBASE_CONFIG,
      ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS,
      ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES,
      ENABLE_ADMIN_DASHBOARD: process.env.ENABLE_ADMIN_DASHBOARD,
    });

    return _env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors
        .filter((e) => e.message === 'Required')
        .map((e) => e.path.join('.'));

      const invalid = error.errors
        .filter((e) => e.message !== 'Required')
        .map((e) => `${e.path.join('.')}: ${e.message}`);

      let errorMessage = '❌ Environment Configuration Error:\n\n';

      if (missing.length > 0) {
        errorMessage += `Missing required variables:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\n`;
      }

      if (invalid.length > 0) {
        errorMessage += `Invalid variables:\n${invalid.map((v) => `  - ${v}`).join('\n')}\n\n`;
      }

      errorMessage += 'Please check your .env.local file and env.template for reference.';

      throw new Error(errorMessage);
    }
    throw error;
  }
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production';
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === 'development';
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: 'payments' | 'ai' | 'admin'): boolean {
  const env = getEnv();
  switch (feature) {
    case 'payments':
      return env.ENABLE_PAYMENTS;
    case 'ai':
      return env.ENABLE_AI_FEATURES;
    case 'admin':
      return env.ENABLE_ADMIN_DASHBOARD;
    default:
      return false;
  }
}

/**
 * Get public environment variables safe for client-side
 * Only returns variables prefixed with NEXT_PUBLIC_
 */
export function getPublicEnv() {
  const env = getEnv();
  return {
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    mapboxToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
    firebaseConfig: env.NEXT_PUBLIC_FIREBASE_CONFIG,
    nodeEnv: env.NODE_ENV,
  };
}

