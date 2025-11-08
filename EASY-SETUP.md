# 🚀 Super Easy Setup - 3 Commands!

## Step 1: Create .env.local File (Interactive)

Run this PowerShell script - it will ask you for your Supabase credentials:

```powershell
.\create-env-file.ps1
```

**You'll need these 3 values from Supabase:**
1. Project URL (from https://supabase.com/dashboard → WildPraxis → Settings → API)
2. Anon key
3. Service role key

The script will:
- ✅ Add all your Stripe keys automatically
- ✅ Add your Supabase credentials
- ✅ Generate NextAuth secret automatically
- ✅ Create .env.local file

---

## Step 2: Run Database Migration (30 seconds)

1. Go to: https://supabase.com/dashboard → **WildPraxis** → **SQL Editor**
2. Click **New query**
3. Copy this SQL:

```sql
-- Add subscription fields to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid'));
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_plan TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_canceled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS max_students INTEGER;

CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer ON organizations(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription ON organizations(subscription_id);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status ON organizations(subscription_status);

ALTER TABLE organization_users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id);
ALTER TABLE organization_users ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE;
```

4. Click **Run** ✅

---

## Step 3: Test It! (2 minutes)

```powershell
npm run dev
```

Open: **http://localhost:3000/admin/dashboard**

Try subscribing with test card:
- Card: `4242 4242 4242 4242`
- Exp: `12/34`
- CVC: `123`

---

## ✅ That's It!

**3 steps:**
1. Run `.\create-env-file.ps1`
2. Run SQL migration in Supabase
3. Run `npm run dev` and test

---

## 🆘 If Something Goes Wrong

### "Execution policy" error
Run this first:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### "npm not found"
Use the portable npm:
```powershell
.\node-portable\npm.cmd run dev
```

### "Invalid Supabase credentials"
- Make sure you copied the full keys (they're very long!)
- No spaces at the beginning/end
- Check you're in the right project (WildPraxis)

---

## 🎉 You're Done!

After testing works locally:
- Deploy to Vercel (see DEPLOYMENT-GUIDE.md)
- Build mobile apps
- Launch! 🚀

