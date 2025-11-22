import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ count: 0 });
    }

    // TODO: Implement actual unread feedback detection
    // For now, return 0
    // Future: Add feedback_read boolean to user_visits table

    return NextResponse.json({ count: 0 });
  } catch (error) {
    console.error('Error fetching unread feedback count:', error);
    return NextResponse.json({ count: 0 });
  }
}

