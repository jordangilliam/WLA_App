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

    // TODO: Implement actual "new" achievement detection
    // For now, return 0
    // Future: Track last_viewed_at timestamp and count achievements unlocked after that

    return NextResponse.json({ count: 0 });
  } catch (error) {
    console.error('Error fetching new achievements count:', error);
    return NextResponse.json({ count: 0 });
  }
}

