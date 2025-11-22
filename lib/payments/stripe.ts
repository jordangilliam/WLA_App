/**
 * Stripe integration for school licensing and payments
 * Handles subscriptions, checkout sessions, and webhooks
 */

import Stripe from 'stripe'

// Lazy-init Stripe client
let _stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2023-10-16' as any,
    });
  }
  return _stripe;
}

// Export a proxy that initializes on first use
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripeClient();
    return (client as any)[prop];
  }
});

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceId: string
  amount: number // in cents
  interval: 'month' | 'year'
  features: string[]
  maxStudents: number | null // null = unlimited
}

// Subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'school-basic',
    name: 'School Basic',
    description: 'Perfect for small schools',
    priceId: process.env.STRIPE_PRICE_SCHOOL_BASIC!,
    amount: 9999, // $99.99
    interval: 'year',
    features: [
      'Up to 100 students',
      'Teacher dashboard',
      'Field trip events',
      'Progress tracking',
      'Email support',
    ],
    maxStudents: 100,
  },
  {
    id: 'school-pro',
    name: 'School Pro',
    description: 'For growing schools',
    priceId: process.env.STRIPE_PRICE_SCHOOL_PRO!,
    amount: 19999, // $199.99
    interval: 'year',
    features: [
      'Up to 500 students',
      'Everything in Basic',
      'Custom field sites',
      'Advanced analytics',
      'Priority support',
      'Bulk student import',
    ],
    maxStudents: 500,
  },
  {
    id: 'school-unlimited',
    name: 'School Unlimited',
    description: 'For large schools',
    priceId: process.env.STRIPE_PRICE_SCHOOL_UNLIMITED!,
    amount: 49999, // $499.99
    interval: 'year',
    features: [
      'Unlimited students',
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'Training sessions',
      'Early access to features',
    ],
    maxStudents: null,
  },
  {
    id: 'district',
    name: 'District License',
    description: 'Multiple schools',
    priceId: process.env.STRIPE_PRICE_DISTRICT!,
    amount: 99999, // $999.99
    interval: 'year',
    features: [
      'Up to 10 schools',
      'Unlimited students',
      'District admin dashboard',
      'Cross-school analytics',
      'Dedicated account manager',
      'Custom training',
      'API access',
    ],
    maxStudents: null,
  },
]

/**
 * Create a Stripe checkout session for a subscription
 */
export async function createCheckoutSession(params: {
  organizationId: string
  planId: string
  successUrl: string
  cancelUrl: string
  customerEmail?: string
}) {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === params.planId)
  
  if (!plan) {
    throw new Error('Invalid plan ID')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    customer_email: params.customerEmail,
    client_reference_id: params.organizationId,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      metadata: {
        organization_id: params.organizationId,
        plan_id: params.planId,
      },
    },
    metadata: {
      organization_id: params.organizationId,
      plan_id: params.planId,
    },
  })

  return session
}

/**
 * Create a Stripe customer portal session
 * Allows customers to manage their subscription
 */
export async function createPortalSession(params: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  })

  return session
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

/**
 * Update subscription quantity or plan
 */
export async function updateSubscription(
  subscriptionId: string,
  updates: {
    priceId?: string
    quantity?: number
  }
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: updates.priceId || subscription.items.data[0].price.id,
        quantity: updates.quantity,
      },
    ],
  })
}

/**
 * Verify webhook signature and construct event
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

/**
 * Handle subscription events from webhooks
 */
export async function handleSubscriptionEvent(
  event: Stripe.Event,
  onSubscriptionCreated?: (subscription: Stripe.Subscription) => Promise<void>,
  onSubscriptionUpdated?: (subscription: Stripe.Subscription) => Promise<void>,
  onSubscriptionDeleted?: (subscription: Stripe.Subscription) => Promise<void>
) {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      
      if (event.type === 'customer.subscription.created' && onSubscriptionCreated) {
        await onSubscriptionCreated(subscription)
      } else if (event.type === 'customer.subscription.updated' && onSubscriptionUpdated) {
        await onSubscriptionUpdated(subscription)
      }
      break

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      if (onSubscriptionDeleted) {
        await onSubscriptionDeleted(deletedSubscription)
      }
      break

    case 'invoice.payment_succeeded':
      // Payment successful - subscription remains active
      break

    case 'invoice.payment_failed':
      // Payment failed - notify customer
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

/**
 * Get all plans
 */
export function getPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS
}

/**
 * Get plan by ID
 */
export function getPlan(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === planId)
}

