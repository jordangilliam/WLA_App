import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventType, payload } = body;

    if (!eventType || typeof eventType !== 'string') {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { error } = await supabaseAdmin.from('explore_activity_log').insert({
      user_id: userId,
      event_type: eventType,
      payload: payload ?? {},
    } as never);

    if (error) {
      console.error('Failed to record explore telemetry', error);
      return NextResponse.json({ error: 'Failed to record telemetry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Explore telemetry error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

