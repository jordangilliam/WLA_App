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
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const db = supabaseAdmin

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
        const subWithPeriods = subscription as Stripe.Subscription & {
          current_period_start?: number | null
          current_period_end?: number | null
        }

        const currentPeriodStart = subWithPeriods.current_period_start
          ? new Date(subWithPeriods.current_period_start * 1000).toISOString()
          : null
        const currentPeriodEnd = subWithPeriods.current_period_end
          ? new Date(subWithPeriods.current_period_end * 1000).toISOString()
          : null

        await db
          .from('organizations')
          .update({
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_plan: planId,
            subscription_current_period_start: currentPeriodStart,
            subscription_current_period_end: currentPeriodEnd,
            stripe_customer_id: subscription.customer as string,
          } as never)
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
        const updatedPeriods = subscription as Stripe.Subscription & {
          current_period_start?: number | null
          current_period_end?: number | null
        }

        const updatedCurrentPeriodStart = updatedPeriods.current_period_start
          ? new Date(updatedPeriods.current_period_start * 1000).toISOString()
          : null
        const updatedCurrentPeriodEnd = updatedPeriods.current_period_end
          ? new Date(updatedPeriods.current_period_end * 1000).toISOString()
          : null

        await db
          .from('organizations')
          .update({
            subscription_status: subscription.status,
            subscription_current_period_start: updatedCurrentPeriodStart,
            subscription_current_period_end: updatedCurrentPeriodEnd,
          } as never)
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
        await db
          .from('organizations')
          .update({
            subscription_status: 'canceled',
            subscription_canceled_at: new Date().toISOString(),
          } as never)
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

