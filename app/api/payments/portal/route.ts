import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createPortalSession } from '@/lib/payments/stripe'
import { withSecurity, validateBody } from '@/lib/auth/api-middleware'

const portalSchema = z.object({
  customerId: z.string(),
  returnUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  const authResult = await withSecurity(request, { requireRole: 'educator' })
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const validation = await validateBody(request, portalSchema)
  if (validation instanceof NextResponse) {
    return validation
  }

  const { customerId, returnUrl } = validation.data
  const origin = request.nextUrl.origin
  const resolvedReturn = returnUrl ?? `${origin}/billing`

  try {
    const session = await createPortalSession({
      customerId,
      returnUrl: resolvedReturn,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Unable to create portal session' },
      { status: 500 }
    )
  }
}

