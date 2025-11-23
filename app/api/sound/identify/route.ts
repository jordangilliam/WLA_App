import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { runIdentificationPipeline } from '@/lib/ai';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * POST /api/sound/identify
 * Identify bird/animal sounds from audio recording
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { audioData, latitude, longitude, fieldSiteId, observationId } = body;

    if (!audioData) {
      return NextResponse.json({ error: 'audioData is required' }, { status: 400 });
    }

    // Run identification pipeline for audio
    const results = await runIdentificationPipeline({
      mediaType: 'audio',
      audioData,
      targets: ['bird', 'macro', 'species'],
      latitude,
      longitude,
    });

    // Store identification results
    if (supabaseAdmin && results.length > 0) {
      const records = results.map((result) => ({
        user_id: userId,
        observation_id: observationId || null,
        field_site_id: fieldSiteId || null,
        provider: result.provider,
        mode: result.mode,
        label: result.label,
        confidence: result.confidence,
        status: result.status === 'ok' ? 'pending' : 'auto',
        result: result,
      }));

      try {
        await supabaseAdmin.from('ai_identifications').insert(records as never);
      } catch (error) {
        console.error('Failed to persist sound identification:', error);
      }
    }

    // Return top results sorted by confidence
    const topResults = results
      .filter((r) => r.status === 'ok' && r.confidence && r.confidence > 0.5)
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      results: topResults,
      totalResults: results.length,
    });
  } catch (error) {
    console.error('Error in sound identification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

