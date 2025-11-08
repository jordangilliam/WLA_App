# Quick Next Steps - What To Do Right Now

## ✅ You've Done
1. Created FieldQuest assets (5 icons)
2. Have Stripe account (stringtheorysolutionsllc@gmail.com)

---

## 🎯 Do This Next (in order)

### 1. Create Stripe Products (15 minutes)

Open this in a new tab: https://dashboard.stripe.com/products

Create 4 products:

| Product Name | Price | Price ID to Copy |
|--------------|-------|------------------|
| WildPraxis School Basic | $99.99/year | price_xxxxxxx |
| WildPraxis School Pro | $199.99/year | price_xxxxxxx |
| WildPraxis School Unlimited | $499.99/year | price_xxxxxxx |
| WildPraxis District License | $999.99/year | price_xxxxxxx |

**See STRIPE-SETUP-GUIDE.md for detailed steps**

### 2. Get API Keys (2 minutes)

Go to: https://dashboard.stripe.com/apikeys

Copy these:
- Publishable key: `pk_test_xxxxx`
- Secret key: `sk_test_xxxxx`

### 3. Create Webhook (5 minutes)

Go to: https://dashboard.stripe.com/webhooks

Create webhook:
- URL: `https://wlaapp.vercel.app/api/webhooks/stripe` (placeholder for now)
- Events: subscription.created, subscription.updated, subscription.deleted, invoice.payment_succeeded, invoice.payment_failed
- Copy signing secret: `whsec_xxxxx`

### 4. Update .env.local (2 minutes)

Add these lines to your `.env.local` file:

```bash
STRIPE_SECRET_KEY=sk_test_PASTE_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PASTE_HERE
STRIPE_WEBHOOK_SECRET=whsec_PASTE_HERE
STRIPE_PRICE_SCHOOL_BASIC=price_PASTE_HERE
STRIPE_PRICE_SCHOOL_PRO=price_PASTE_HERE
STRIPE_PRICE_SCHOOL_UNLIMITED=price_PASTE_HERE
STRIPE_PRICE_DISTRICT=price_PASTE_HERE
```

### 5. Test Locally (10 minutes)

```bash
npm run dev
```

Visit: http://localhost:3000/admin/dashboard

Try creating an organization and subscribing!

---

## 🚀 After That

### Deploy to Vercel (30 minutes)
- See DEPLOYMENT-GUIDE.md
- Add environment variables in Vercel dashboard
- Update webhook URL to your real Vercel URL

### Run Database Migrations (15 minutes)
- See DATABASE-SETUP-SIMPLE.txt
- Run migrations in Supabase SQL editor

### Build Mobile Apps (2-4 hours)
- See DEPLOYMENT-GUIDE.md for Capacitor/EAS build steps

---

## 📋 Copy-Paste This

When you're ready, send me:
```
Stripe Price IDs:
- School Basic: price_xxxxx
- School Pro: price_xxxxx
- School Unlimited: price_xxxxx
- District: price_xxxxx

Stripe Keys:
- Publishable: pk_test_xxxxx
- Secret: sk_test_xxxxx
- Webhook Secret: whsec_xxxxx
```

I'll help you verify everything is configured correctly!

---

## ❓ Questions?

**"What about my existing $80 and $8 products?"**
- Leave them alone - they won't interfere
- These are separate new products for the school system

**"Should I use test or live mode?"**
- Start with TEST mode (safer)
- Switch to LIVE mode only when ready to accept real payments

**"Where do I find price IDs?"**
- Stripe Dashboard → Products → Click on product → Copy the price ID under "Pricing"

---

**Focus**: Just do Step 1 (create 4 products) first, then we'll tackle the rest! 🎯

