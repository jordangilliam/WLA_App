# 🚀 Quick Start - Get Testing in 2 Minutes!

## Step 1: Create Your Admin Account (1 minute)

1. **Visit**: http://localhost:3000
2. **Click**: "Sign In" button
3. **Sign up** with any email (test email is fine):
   - Email: `admin@test.com`
   - Password: `password123`
4. **Sign in** with those credentials

## Step 2: Make Yourself an Admin (30 seconds)

After signing in, you need to set your role to 'admin' in the database:

1. Go to: https://supabase.com/dashboard → **WildPraxis** → **Table Editor**
2. Open the **`users`** table
3. Find your new user (email: `admin@test.com`)
4. Click to edit the row
5. Change **`role`** from `student` to `admin`
6. Save

## Step 3: Access Admin Dashboard (10 seconds)

1. Refresh your browser: http://localhost:3000
2. Go to: http://localhost:3000/admin/dashboard
3. **You're in!** ✅

Now you can:
- See all organizations (Wildlife Leadership Academy should be there)
- Add new organizations
- Test subscription flow
- Manage users

---

## 🧪 Test the Payment Flow

1. In admin dashboard, click **"Add Organization"**
2. Fill in:
   - Name: "Test School"
   - Type: "school"
   - Contact email: your email
3. Click **"Subscribe"** or choose a plan
4. You'll see Stripe checkout
5. Use test card: `4242 4242 4242 4242`
6. Complete checkout
7. You'll be redirected back
8. The organization now shows as **"active"** subscription!

---

## ✅ What You're Testing

- ✅ Authentication works
- ✅ Admin dashboard loads
- ✅ Stripe integration works
- ✅ Webhooks update database
- ✅ Subscriptions are tracked

---

## 🎯 Quick SQL to Make Admin

If you prefer SQL, run this in Supabase SQL Editor:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@test.com';
```

---

**That's it!** You're now an admin and can test everything! 🎉

