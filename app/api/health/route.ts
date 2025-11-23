import { NextResponse } from 'next/server';

/**
 * Health check endpoint
 * Returns 200 if service is healthy
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'wla-ambassadors-app',
    },
    { status: 200 }
  );
}
