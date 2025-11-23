import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * POST /api/collaboration/live-session
 * Create a new live field research session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const userRole = (session?.user as { role?: string } | undefined)?.role;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userRole !== 'educator' && userRole !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can create live sessions' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json();
    const { classId, fieldSiteId, durationMinutes = 120 } = body;

    if (!classId) {
      return NextResponse.json({ error: 'classId is required' }, { status: 400 });
    }

    // Verify teacher owns the class
    const { data: classData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('id, class_name, teacher_id')
      .eq('id', classId)
      .eq('teacher_id', userId)
      .single();

    if (classError || !classData) {
      return NextResponse.json({ error: 'Class not found or access denied' }, { status: 404 });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // Create live session record
    const { data: liveSession, error: sessionError } = await supabaseAdmin
      .from('live_field_sessions')
      .insert({
        teacher_id: userId,
        class_id: classId,
        field_site_id: fieldSiteId || null,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating live session:', sessionError);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      session: {
        id: liveSession.id,
        classId: liveSession.class_id,
        className: (classData as any).class_name,
        fieldSiteId: liveSession.field_site_id,
        startTime: liveSession.start_time,
        endTime: liveSession.end_time,
        isActive: liveSession.is_active,
      },
    });
  } catch (error) {
    console.error('Error in live session creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/collaboration/live-session
 * Get active live sessions for a user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    let query = supabaseAdmin
      .from('live_field_sessions')
      .select(`
        *,
        classes (id, class_name),
        field_sites (id, name)
      `)
      .eq('is_active', true)
      .gte('end_time', new Date().toISOString());

    if (classId) {
      query = query.eq('class_id', classId);
    } else {
      // Get sessions for user's classes
      const { data: userClasses } = await supabaseAdmin
        .from('class_enrollments')
        .select('class_id')
        .eq('user_id', userId);

      if (userClasses && userClasses.length > 0) {
        const classIds = userClasses.map((c: any) => c.class_id);
        query = query.in('class_id', classIds);
      } else {
        // No classes, return empty
        return NextResponse.json({ success: true, sessions: [] });
      }
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching live sessions:', error);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    const formattedSessions = (sessions || []).map((s: any) => ({
      id: s.id,
      classId: s.class_id,
      className: s.classes?.class_name || 'Unknown',
      fieldSiteId: s.field_site_id,
      fieldSiteName: s.field_sites?.name || null,
      startTime: s.start_time,
      endTime: s.end_time,
      isActive: s.is_active,
    }));

    return NextResponse.json({
      success: true,
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error('Error fetching live sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/collaboration/live-session/[sessionId]
 * End a live session
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { sessionId } = params;

    // Verify user owns the session
    const { data: liveSession, error: sessionError } = await supabaseAdmin
      .from('live_field_sessions')
      .select('teacher_id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !liveSession || (liveSession as any).teacher_id !== userId) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 404 });
    }

    // End the session
    const { error: updateError } = await supabaseAdmin
      .from('live_field_sessions')
      .update({
        is_active: false,
        end_time: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error ending session:', updateError);
      return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error ending live session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

