# 🚀 Deploy to Production - RIGHT NOW!

## Step 1: Deploy to Vercel (5 minutes)

```powershell
# Login to Vercel (opens browser)
vercel login

# Deploy to production
vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your personal account
- **Link to existing project?** → No
- **Project name?** → `wla-app` (or whatever you want)
- **Directory?** → `./` (press Enter)
- **Override settings?** → No

Vercel will:
1. Build your app
2. Deploy it
3. Give you a URL like: `https://wla-app-xxx.vercel.app`

---

## Step 2: Add Environment Variables (3 minutes)

After deployment, go to: https://vercel.com/dashboard

1. Click your project (`wla-app`)
2. Go to **Settings** → **Environment Variables**
3. Add ALL these variables (copy from your `.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXTAUTH_URL=https://your-vercel-url.vercel.app
NEXTAUTH_SECRET=tR3N7Arb+tYrgbKvH7Z/t3a8BZ/MtNPmI8BuhwhSNvQ=

STRIPE_SECRET_KEY=sk_test_51S5DqK...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51S5DqK...
STRIPE_WEBHOOK_SECRET=whsec_Q7qeaq...
STRIPE_PRICE_SCHOOL_BASIC=price_1SR0V1...
STRIPE_PRICE_SCHOOL_PRO=price_1SR0VP...
STRIPE_PRICE_SCHOOL_UNLIMITED=price_1SR0Vq...
STRIPE_PRICE_DISTRICT=price_1SR0Wl...
```

4. Click **Save** for each
5. Go to **Deployments** tab
6. Click **Redeploy** (to use new env vars)

---

## Step 3: Update Stripe Webhook (2 minutes)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click your webhook endpoint
3. Click **Edit**
4. Change URL to: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
5. Click **Update endpoint**

---

## Step 4: Test Production! (2 minutes)

Visit your Vercel URL:
1. **Homepage**: `https://your-vercel-url.vercel.app`
2. **Sign in**: Use email/password
3. **Make admin**: Update role in Supabase
4. **Admin dashboard**: `https://your-vercel-url.vercel.app/admin/dashboard`
5. **Test payment**: Subscribe with test card `4242...`

---

## ✅ YOU'RE LIVE!

Your app is now:
- ✅ Deployed to production
- ✅ Running on Vercel's CDN (fast worldwide)
- ✅ HTTPS enabled
- ✅ Custom domain ready (can add later)
- ✅ Auto-deploys on git push

---

## 🎯 What's Next?

### Immediate:
- [ ] Test all features in production
- [ ] Share URL with beta testers
- [ ] Get feedback

### This Week:
- [ ] Add custom domain (optional)
- [ ] Build mobile apps
- [ ] Submit to app stores

### This Month:
- [ ] Onboard first schools
- [ ] Start generating revenue!

---

## 🔗 Quick Links After Deployment

- **Live App**: https://your-vercel-url.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Admin Panel**: https://your-vercel-url.vercel.app/admin/dashboard
- **Supabase**: https://supabase.com/dashboard
- **Stripe**: https://dashboard.stripe.com

---

## 💡 Pro Tips

**Custom Domain:**
```
1. Go to Vercel → Settings → Domains
2. Add: wildpraxis.org (or whatever you own)
3. Update DNS records (Vercel shows you how)
4. Update NEXTAUTH_URL in env vars
5. Update Stripe webhook URL
```

**Automatic Deployments:**
- Every `git push` to main → auto-deploys!
- Preview deployments for branches
- Rollback anytime

**Monitoring:**
- Vercel Analytics: See traffic
- Sentry: See errors
- Stripe Dashboard: See revenue

---

## 🎉 CONGRATULATIONS!

You just deployed a production-ready app with:
- Payment processing
- User authentication
- Admin dashboard
- Database integration
- Mobile support

**Time to celebrate!** 🎊

Then: Build mobile apps → Submit to stores → LAUNCH! 🚀
