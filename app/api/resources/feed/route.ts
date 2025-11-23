import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/db/client'
import { withSecurity, validateBody } from '@/lib/auth/api-middleware'

const createResourceSchema = z.object({
  title: z.string().min(5),
  summary: z.string().max(4000).optional(),
  category: z.enum(['article', 'workshop', 'alert', 'grant', 'toolkit']).optional(),
  tags: z.array(z.string()).optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const featured = searchParams.get('featured')
  const limit = Math.max(1, Math.min(Number(searchParams.get('limit') ?? '24'), 50))

  let query = supabaseAdmin
    .from('resource_updates')
    .select('*')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }

  if (featured === 'true') {
    query = query.eq('featured', true)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to load resource updates', error)
    return NextResponse.json(
      { error: 'Unable to load resource stream' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    resources: data ?? [],
  })
}

export async function POST(request: NextRequest) {
  const auth = await withSecurity(request, { requireRole: 'educator' })
  if (auth instanceof NextResponse) {
    return auth
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const validation = await validateBody(request, createResourceSchema)
  if (validation instanceof NextResponse) {
    return validation
  }

  const payload = validation.data

  const { data, error } = await supabaseAdmin
    .from('resource_updates')
    .insert({
      title: payload.title,
      summary: payload.summary ?? null,
      category: payload.category ?? 'article',
      tags: payload.tags ?? [],
      source_name: payload.sourceName ?? null,
      source_url: payload.sourceUrl ?? null,
      featured: payload.featured ?? false,
      published_at: payload.publishedAt ?? new Date().toISOString(),
      added_by: (auth as any).user?.id ?? null,
    } as never)
    .select()
    .single()

  if (error || !data) {
    console.error('Failed to publish resource update', error)
    return NextResponse.json(
      { error: 'Unable to publish resource update' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, resource: data })
}




