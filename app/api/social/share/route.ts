import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';
import { sanitizeString } from '@/lib/auth/api-middleware';

/**
 * POST /api/social/share
 * Share content to class feed
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json();
    const { type, itemId, title, description, imageUrl, classId } = body;

    if (!type || !itemId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Sanitize user input to prevent XSS
    const sanitizedTitle = sanitizeString(String(title));
    const sanitizedDescription = description ? sanitizeString(String(description)) : null;

    // Get user's classes if classId not provided
    let targetClasses: string[] = [];
    if (classId) {
      targetClasses = [classId];
    } else {
      const { data: enrollments } = await supabaseAdmin
        .from('class_enrollments')
        .select('class_id')
        .eq('user_id', userId);

      targetClasses = (enrollments || []).map((e: any) => e.class_id);
    }

    if (targetClasses.length === 0) {
      return NextResponse.json(
        { error: 'User is not enrolled in any classes' },
        { status: 400 }
      );
    }

    // Create share posts for each class
    const posts = targetClasses.map((cid) => ({
      user_id: userId,
      class_id: cid,
      content_type: type,
      content_id: itemId,
      title: sanitizedTitle,
      description: sanitizedDescription,
      image_url: imageUrl || null,
      created_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabaseAdmin
      .from('class_feed_posts')
      .insert(posts as never);

    if (insertError) {
      console.error('Error creating share posts:', insertError);
      return NextResponse.json({ error: 'Failed to share' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Shared successfully',
      sharedToClasses: targetClasses.length,
    });
  } catch (error) {
    console.error('Error in share API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

