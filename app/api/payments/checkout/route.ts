import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createCheckoutSession, getPlan } from '@/lib/payments/stripe'
import { withSecurity, validateBody } from '@/lib/auth/api-middleware'

const checkoutSchema = z.object({
  organizationId: z.string().uuid(),
  planId: z.string(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  customerEmail: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  const authResult = await withSecurity(request, { requireRole: 'educator' })
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const validation = await validateBody(request, checkoutSchema)
  if (validation instanceof NextResponse) {
    return validation
  }

  const { organizationId, planId, successUrl, cancelUrl, customerEmail } = validation.data

  if (!getPlan(planId)) {
    return NextResponse.json(
      { error: `Unknown planId: ${planId}` },
      { status: 400 }
    )
  }

  const origin = request.nextUrl.origin
  const resolvedSuccess = successUrl ?? `${origin}/billing/success`
  const resolvedCancel = cancelUrl ?? `${origin}/billing`

  try {
    const session = await createCheckoutSession({
      organizationId,
      planId,
      successUrl: resolvedSuccess,
      cancelUrl: resolvedCancel,
      customerEmail,
    })

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    )
  }
}

