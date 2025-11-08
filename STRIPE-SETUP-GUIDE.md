# Stripe Setup Guide for WLA_App School Subscriptions

## Step 1: Create School Subscription Products

Log in to your Stripe Dashboard at https://dashboard.stripe.com

### Product 1: School Basic

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: `WildPraxis School Basic`
   - **Description**: `Perfect for small schools - Up to 100 students with teacher dashboard, field trip events, and progress tracking.`
   - **Pricing**:
     - Click "Add another price"
     - **Price**: `$99.99`
     - **Billing period**: `Yearly`
     - **Price ID**: Copy this! (looks like `price_xxxxxxxxxxxxx`)
   - **Save product**

### Product 2: School Pro

1. **Add product** again
2. Fill in:
   - **Name**: `WildPraxis School Pro`
   - **Description**: `For growing schools - Up to 500 students with custom field sites, advanced analytics, and priority support.`
   - **Pricing**:
     - **Price**: `$199.99`
     - **Billing period**: `Yearly`
     - **Price ID**: Copy this!
   - **Save product**

### Product 3: School Unlimited

1. **Add product** again
2. Fill in:
   - **Name**: `WildPraxis School Unlimited`
   - **Description**: `For large schools - Unlimited students with dedicated support, custom integrations, and training sessions.`
   - **Pricing**:
     - **Price**: `$499.99`
     - **Billing period**: `Yearly`
     - **Price ID**: Copy this!
   - **Save product**

### Product 4: District License

1. **Add product** again
2. Fill in:
   - **Name**: `WildPraxis District License`
   - **Description**: `Multiple schools - Up to 10 schools with unlimited students, district admin dashboard, and dedicated account manager.`
   - **Pricing**:
     - **Price**: `$999.99`
     - **Billing period**: `Yearly`
     - **Price ID**: Copy this!
   - **Save product**

---

## Step 2: Get Your API Keys

1. Go to **Developers** → **API keys**
2. Copy these keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`) - Keep this secure!

---

## Step 3: Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Fill in:
   - **Endpoint URL**: `https://YOUR-VERCEL-URL.vercel.app/api/webhooks/stripe`
     - (We'll update this after deploying to Vercel)
     - For now, use a placeholder like: `https://wlaapp.vercel.app/api/webhooks/stripe`
   - **Events to send**:
     - Select these events:
       - ✅ `customer.subscription.created`
       - ✅ `customer.subscription.updated`
       - ✅ `customer.subscription.deleted`
       - ✅ `invoice.payment_succeeded`
       - ✅ `invoice.payment_failed`
4. Click **Add endpoint**
5. Copy the **Signing secret** (starts with `whsec_`)

---

## Step 4: Configure Environment Variables

Create/update your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Stripe Price IDs (from Step 1)
STRIPE_PRICE_SCHOOL_BASIC=price_xxxxxxxxxxxxx
STRIPE_PRICE_SCHOOL_PRO=price_xxxxxxxxxxxxx
STRIPE_PRICE_SCHOOL_UNLIMITED=price_xxxxxxxxxxxxx
STRIPE_PRICE_DISTRICT=price_xxxxxxxxxxxxx

# Supabase (you already have these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

---

## Step 5: Test the Integration

### Test in Development

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3000/admin/dashboard`

3. Create a test organization

4. Use Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Exp**: Any future date (e.g., 12/34)
   - **CVC**: Any 3 digits (e.g., 123)

### Test Webhooks Locally

Use Stripe CLI to forward webhooks to localhost:

```bash
# Install Stripe CLI (Windows)
# Download from: https://github.com/stripe/stripe-cli/releases

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will give you a webhook signing secret starting with whsec_
# Use this in your .env.local for testing
```

---

## Step 6: Production Setup

### When deploying to Vercel:

1. Add all environment variables in Vercel dashboard:
   - Project Settings → Environment Variables
   - Add all the variables from `.env.local`

2. Update webhook endpoint URL:
   - Stripe Dashboard → Webhooks
   - Edit your webhook endpoint
   - Change URL to: `https://your-production-url.vercel.app/api/webhooks/stripe`

3. Switch to live mode:
   - Stripe Dashboard → Toggle "Test mode" OFF
   - Get live API keys (starts with `pk_live_` and `sk_live_`)
   - Update environment variables in Vercel

---

## Quick Checklist

- [ ] Create 4 subscription products in Stripe
- [ ] Copy all 4 price IDs
- [ ] Get publishable and secret API keys
- [ ] Create webhook endpoint
- [ ] Copy webhook signing secret
- [ ] Add all keys to `.env.local`
- [ ] Test with Stripe test cards
- [ ] Test webhook with Stripe CLI
- [ ] Deploy to Vercel
- [ ] Update webhook URL to production
- [ ] Switch to live mode

---

## What About Your Existing Products?

The $80/year and $8/month products you have:
- These might be from a previous project or test products
- You can **keep them** - they won't interfere
- Or **archive them** if you don't need them:
  - Stripe Dashboard → Products → Click on product → "Archive product"
- They're separate from the new school subscriptions we're creating

---

## Need Help?

If you get stuck:
1. Check Stripe docs: https://stripe.com/docs
2. Test mode is safe - you can't charge real cards
3. All webhooks can be tested with Stripe CLI
4. Stripe has excellent error messages in the dashboard

---

**Next**: Once you have the price IDs, paste them here and I'll help you update the configuration!

