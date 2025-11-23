import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/social/feed
 * Get discovery feed for user's classes
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
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Get user's classes
    let classIds: string[] = [];
    if (classId) {
      classIds = [classId];
    } else {
      const { data: enrollments } = await supabaseAdmin
        .from('class_enrollments')
        .select('class_id')
        .eq('user_id', userId);

      classIds = (enrollments || []).map((e: any) => e.class_id);
    }

    if (classIds.length === 0) {
      return NextResponse.json({ success: true, discoveries: [] });
    }

    // Fetch feed posts
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('class_feed_posts')
      .select(`
        *,
        users!class_feed_posts_user_id_fkey (id, name, avatar_url)
      `)
      .in('class_id', classIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (postsError) {
      console.error('Error fetching feed posts:', postsError);
      return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
    }

    // Transform to discovery format
    const discoveries = (posts || []).map((post: any) => ({
      id: post.id,
      userId: post.user_id,
      userName: post.users?.name || 'Unknown',
      userAvatar: post.users?.avatar_url || null,
      type: post.content_type,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      timestamp: post.created_at,
      link: `/share/${post.content_type}/${post.content_id}`,
    }));

    return NextResponse.json({
      success: true,
      discoveries,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

