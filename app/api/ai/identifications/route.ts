import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/db/client'
import { withSecurity, validateBody } from '@/lib/auth/api-middleware'

const statusFilterSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'auto']).optional(),
})

const reviewSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
  notes: z.string().max(500).optional(),
})

export async function GET(request: NextRequest) {
  const authResult = await withSecurity(request, { requireRole: 'educator' })
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const params = statusFilterSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries())
  )

  if (!params.success) {
    return NextResponse.json(
      { error: 'Invalid query params', details: params.error.flatten() },
      { status: 400 }
    )
  }

  const status = params.data.status || 'pending'

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client unavailable' },
      { status: 500 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('ai_identifications')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data })
}

export async function PATCH(request: NextRequest) {
  const authResult = await withSecurity(request, { requireRole: 'educator' })
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const validation = await validateBody(request, reviewSchema)
  if (validation instanceof NextResponse) {
    return validation
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client unavailable' },
      { status: 500 }
    )
  }

  const { id, status, notes } = validation.data
  const reviewerId = (authResult as { user: { id: string } }).user.id

  const { data, error } = await supabaseAdmin
    .from('ai_identifications')
    .update({
      status,
      review_notes: notes ?? null,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}

