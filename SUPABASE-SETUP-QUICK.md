# Supabase Quick Setup - You're Almost Done! 🚀

## ✅ What You Already Have

- Supabase project: **WildPraxis**
- Tables: `classes`, `organization_users`, `organizations`, `users`
- Wildlife Leadership Academy already in organizations

Perfect! You're 80% done!

---

## 🔑 Step 1: Get Your Supabase Credentials (2 minutes)

1. Go to: **https://supabase.com/dashboard**
2. Select your **WildPraxis** project
3. Click **Settings** (gear icon at bottom left)
4. Click **API**
5. Copy these 3 values:

### Project URL
Look for: **Project URL**
- Looks like: `https://abcdefgh12345678.supabase.co`
- Copy this → use for `NEXT_PUBLIC_SUPABASE_URL`

### Anon/Public Key
Look for: **Project API keys** → **anon** → **public**
- Long string starting with `eyJ...`
- Copy this → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Service Role Key
Look for: **Project API keys** → **service_role**
- Long string starting with `eyJ...`
- ⚠️ **KEEP THIS SECRET!**
- Copy this → use for `SUPABASE_SERVICE_ROLE_KEY`

---

## 📝 Step 2: Update Your .env.local (1 minute)

Open `.env.local` and replace these lines:

```bash
# OLD:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NEW (paste your actual values):
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
```

---

## 🗄️ Step 3: Run the Subscription Migration (3 minutes)

You need to add subscription/payment fields to your existing `organizations` table.

### In Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste this SQL:

```sql
-- Add subscription fields to organizations table
-- This enables Stripe payment tracking

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid'));
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_plan TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_canceled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS max_students INTEGER;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer ON organizations(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription ON organizations(subscription_id);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status ON organizations(subscription_status);

-- Add invitation tracking to organization_users
ALTER TABLE organization_users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id);
ALTER TABLE organization_users ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE;
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see: ✅ **Success. No rows returned**

---

## 🔐 Step 4: Generate NextAuth Secret (1 minute)

Run this in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and add to `.env.local`:
```bash
NEXTAUTH_SECRET=paste-the-output-here
```

---

## ✅ Final .env.local Should Look Like This:

```bash
# Stripe (✅ Done)
STRIPE_SECRET_KEY=sk_test_51S5DqK...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51S5DqK...
STRIPE_WEBHOOK_SECRET=whsec_Q7qeaq...
STRIPE_PRICE_SCHOOL_BASIC=price_1SR0V1...
STRIPE_PRICE_SCHOOL_PRO=price_1SR0VP...
STRIPE_PRICE_SCHOOL_UNLIMITED=price_1SR0Vq...
STRIPE_PRICE_DISTRICT=price_1SR0Wl...

# Supabase (✅ Add these now)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# NextAuth (✅ Generate this)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# App Config
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

---

## 🧪 Step 5: Test It! (5 minutes)

```bash
# Start the dev server
npm run dev
```

Then open:
- **http://localhost:3000** - Main site
- **http://localhost:3000/admin/dashboard** - Admin dashboard

### Test the Payment Flow:

1. Go to admin dashboard
2. Click "Add Organization"
3. Create a test school
4. Try to subscribe using Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Exp: `12/34`
   - CVC: `123`
   - ZIP: `12345`

If the checkout page opens → **Success!** ✅

---

## 🎯 What Should Work Now

After completing these steps:
- ✅ Authentication (login/signup)
- ✅ Admin dashboard
- ✅ Organization management
- ✅ Stripe subscription flow
- ✅ Webhook updates (after subscribing)

---

## 📊 Check Your Database

After testing, check Supabase:
1. Go to **Table Editor**
2. Open **organizations** table
3. You should see new columns:
   - `stripe_customer_id`
   - `subscription_id`
   - `subscription_status`
   - `subscription_plan`
   - etc.

---

## 🆘 Troubleshooting

### "Invalid API key"
- Double-check you copied the full keys (they're long!)
- No spaces at the beginning/end

### "Relation does not exist"
- Make sure you ran the SQL migration
- Check that all 4 base tables exist

### "Authentication error"
- Make sure `NEXTAUTH_SECRET` is set
- Try restarting the dev server

---

## 🎉 You're Almost Live!

Once testing works:
1. ✅ Deploy to Vercel (see DEPLOYMENT-GUIDE.md)
2. ✅ Build mobile apps (see DEPLOYMENT-GUIDE.md)
3. ✅ Submit to app stores

**Ready to test?** Just get those 3 Supabase values and you're good to go! 🚀

