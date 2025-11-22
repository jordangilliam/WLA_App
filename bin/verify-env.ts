#!/usr/bin/env tsx
/**
 * Environment verification script
 * Ensures all required secrets are present before local builds or deployments.
 */

import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

type Requirement = {
  scope: string
  keys: string[]
  optionalKeys?: string[]
  notes?: string
}

const projectRoot = process.cwd()

const envFiles = [
  { label: '.env.local', path: path.join(projectRoot, '.env.local') },
  { label: '.env', path: path.join(projectRoot, '.env') },
  { label: 'FieldQuest/.env.local', path: path.join(projectRoot, 'FieldQuest/.env.local') },
  { label: 'FieldQuest/.env', path: path.join(projectRoot, 'FieldQuest/.env') },
]

const loadedSources: string[] = []

envFiles.forEach(({ label, path: filePath }) => {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: false })
    loadedSources.push(label)
  }
})

const requirements: Requirement[] = [
  {
    scope: 'Supabase (Web)',
    keys: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  },
  {
    scope: 'Supabase (FieldQuest)',
    keys: ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'],
  },
  {
    scope: 'NextAuth',
    keys: ['NEXTAUTH_SECRET', 'NEXTAUTH_URL'],
  },
  {
    scope: 'Mapbox',
    keys: ['NEXT_PUBLIC_MAPBOX_TOKEN'],
    optionalKeys: ['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN', 'NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN', 'EXPO_PUBLIC_MAPBOX_TOKEN'],
  },
  {
    scope: 'Stripe',
    keys: [
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'STRIPE_PRICE_SCHOOL_BASIC',
      'STRIPE_PRICE_SCHOOL_PRO',
      'STRIPE_PRICE_SCHOOL_UNLIMITED',
      'STRIPE_PRICE_DISTRICT',
    ],
  },
  {
    scope: 'Scheduling / Cron',
    keys: ['CRON_SECRET'],
  },
  {
    scope: 'Monitoring',
    keys: [],
    optionalKeys: ['NEXT_PUBLIC_SENTRY_DSN', 'EXPO_PUBLIC_SENTRY_DSN'],
  },
  {
    scope: 'Rate limiting (Upstash)',
    keys: [],
    optionalKeys: ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  },
  {
    scope: 'FieldQuest API linkage',
    keys: ['EXPO_PUBLIC_API_BASE_URL'],
  },
  {
    scope: 'AI Providers (optional)',
    keys: [],
    optionalKeys: [
      'INATURALIST_CLIENT_ID',
      'INATURALIST_CLIENT_SECRET',
      'BIRDWEATHER_API_KEY',
      'BIRDWEATHER_API_URL',
      'MACRO_API_KEY',
      'MACRO_API_URL',
      'NEXT_PUBLIC_AI_GATEWAY_URL',
    ],
    notes: 'Required once AI identification is enabled.',
  },
  {
    scope: 'Global Soundscapes (optional)',
    keys: [],
    optionalKeys: ['PURDUE_SOUNDSCAPES_API_URL', 'PURDUE_SOUNDSCAPES_API_KEY'],
    notes: 'Needed for Purdue export integration.',
  },
]

const missingCritical: { scope: string; keys: string[] }[] = []
const missingOptional: { scope: string; keys: string[]; notes?: string }[] = []

const hasValue = (key: string) => {
  const value = process.env[key]
  return typeof value === 'string' && value.trim().length > 0
}

requirements.forEach((req) => {
  const missing = req.keys.filter((key) => !hasValue(key))
  if (missing.length) {
    missingCritical.push({ scope: req.scope, keys: missing })
  }

  if (req.optionalKeys?.length) {
    const missingOpt = req.optionalKeys.filter((key) => !hasValue(key))
    if (missingOpt.length) {
      missingOptional.push({ scope: req.scope, keys: missingOpt, notes: req.notes })
    }
  }
})

console.log('Environment sources loaded:', loadedSources.length ? loadedSources.join(', ') : '(none)')

if (missingCritical.length) {
  console.error('\n❌ Missing required environment variables:')
  missingCritical.forEach(({ scope, keys }) => {
    console.error(`- ${scope}: ${keys.join(', ')}`)
  })
  console.error('\nAdd the missing values to .env.local (web) and/or FieldQuest/.env before continuing.')
  process.exit(1)
}

console.log('\n✅ All required environment variables are present.')

if (missingOptional.length) {
  console.warn('\n⚠️ Optional variables not set (enable these to unlock extra features):')
  missingOptional.forEach(({ scope, keys, notes }) => {
    console.warn(`- ${scope}: ${keys.join(', ')}`)
    if (notes) {
      console.warn(`  Notes: ${notes}`)
    }
  })
}

process.exit(0)

