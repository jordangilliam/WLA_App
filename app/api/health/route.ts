import { NextResponse } from 'next/server'
import { checkDatabaseConnection, supabase, supabaseAdmin } from '@/lib/db/client'

export const revalidate = 0

export async function GET() {
  const supabaseHeartbeat = await checkDatabaseConnection()

  const { error: anonError } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })

  let adminError: Error | null = null
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from('user_visits')
      .select('id', { count: 'exact', head: true })
    adminError = error
  } else {
    adminError = new Error('SUPABASE_SERVICE_ROLE_KEY missing')
  }

  const nextAuthConfigured = Boolean(
    process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length > 0
  )

  const checks = {
    supabase: {
      ok: supabaseHeartbeat && !anonError,
      details: supabaseHeartbeat ? 'Connected' : 'Connection failed',
      anonQueryOk: !anonError,
    },
    supabaseAdmin: {
      ok: !adminError,
      details: adminError ? adminError.message : 'Admin queries healthy',
    },
    nextauth: {
      ok: nextAuthConfigured,
      details: nextAuthConfigured ? 'Secret configured' : 'Missing NEXTAUTH_SECRET',
    },
  }

  const statusOk = checks.supabase.ok && checks.supabaseAdmin.ok && checks.nextauth.ok

  return NextResponse.json(
    {
      status: statusOk ? 'ok' : 'error',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      checks,
    },
    {
      status: statusOk ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}

