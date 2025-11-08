/**
 * Stripe webhook endpoint
 * Handles subscription events and updates database
 */

import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent, handleSubscriptionEvent } from '@/lib/payments/stripe'
import { supabaseAdmin } from '@/lib/db/client'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const event = constructWebhookEvent(body, signature)

    // Handle the event
    await handleSubscriptionEvent(
      event,
      // On subscription created
      async (subscription: Stripe.Subscription) => {
        const organizationId = subscription.metadata.organization_id
        const planId = subscription.metadata.plan_id

        if (!organizationId) {
          console.error('No organization_id in subscription metadata')
          return
        }

        // Update organization with subscription details
        await supabaseAdmin
          .from('organizations')
          .update({
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_plan: planId,
            subscription_current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            stripe_customer_id: subscription.customer as string,
          })
          .eq('id', organizationId)

        console.log(
          `Subscription created for organization ${organizationId}: ${subscription.id}`
        )
      },

      // On subscription updated
      async (subscription: Stripe.Subscription) => {
        const organizationId = subscription.metadata.organization_id

        if (!organizationId) {
          console.error('No organization_id in subscription metadata')
          return
        }

        // Update organization subscription status
        await supabaseAdmin
          .from('organizations')
          .update({
            subscription_status: subscription.status,
            subscription_current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq('id', organizationId)

        console.log(
          `Subscription updated for organization ${organizationId}: ${subscription.status}`
        )
      },

      // On subscription deleted/canceled
      async (subscription: Stripe.Subscription) => {
        const organizationId = subscription.metadata.organization_id

        if (!organizationId) {
          console.error('No organization_id in subscription metadata')
          return
        }

        // Mark subscription as canceled
        await supabaseAdmin
          .from('organizations')
          .update({
            subscription_status: 'canceled',
            subscription_canceled_at: new Date().toISOString(),
          })
          .eq('id', organizationId)

        console.log(
          `Subscription canceled for organization ${organizationId}`
        )
      }
    )

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 400 }
    )
  }
}

