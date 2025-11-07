# Supabase Setup Guide for WildPraxis

This guide walks you through setting up Supabase as the database for WildPraxis.

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free tier is fine to start)
3. Create a new project:
   - **Name**: WildPraxis
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your users (e.g., US East for PA)
   - **Pricing Plan**: Free tier (500MB database, 500MB file storage, 2GB bandwidth)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmno.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

3. Add them to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key
```

## Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `lib/db/schema.sql`
4. Click **Run** to execute
5. You should see success messages for all table creations

## Step 4: Run Migrations

After the base schema, run the migrations in order:

1. Click **New query** in SQL Editor
2. Copy contents of `lib/db/migrations/001_add_organizations.sql`
3. Click **Run**
4. Verify success

## Step 5: Enable Row Level Security (RLS)

Row Level Security is critical for multi-tenant security. The schema and migrations already include RLS policies, but verify they're active:

1. Go to **Authentication** → **Policies**
2. You should see policies for:
   - `users` table
   - `organizations` table
   - `organization_users` table
   - `classes` table

If any are missing, they're included in the SQL files.

## Step 6: Set Up Authentication

WildPraxis uses NextAuth.js for authentication, but Supabase can also provide auth:

### Option A: Keep NextAuth.js (Recommended)
- Continue using Google/Azure AD OAuth via NextAuth
- Store user data in Supabase `users` table
- Best for existing setup

### Option B: Use Supabase Auth
- Enable providers in **Authentication** → **Providers**
- Update code to use `@supabase/auth-helpers-nextjs`
- More integrated with Supabase features

**For now, stick with Option A (NextAuth.js) since it's already configured.**

## Step 7: Test Database Connection

Run the app locally and check logs:

```bash
npm run dev
```

Visit any page that uses the database. Check browser console and terminal for:
- ✅ "Database connected successfully"
- ❌ Any Supabase errors

## Step 8: Populate Sample Data (Optional)

For testing, you can add sample data:

1. Go to **Table Editor** in Supabase
2. Select `users` table
3. Insert a test user manually
4. Or run SQL:

```sql
INSERT INTO users (
  email,
  username,
  display_name,
  role
) VALUES (
  'test@wildpraxis.org',
  'testuser',
  'Test Student',
  'student'
);
```

## Step 9: Set Up Storage (for Photos)

For journal photos and user uploads:

1. Go to **Storage** in Supabase
2. Create a new bucket:
   - **Name**: `photos`
   - **Public**: Yes (or set policies for user-only access)
3. Set up storage policies:

```sql
-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own photos
CREATE POLICY "Users can view their photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 10: Monitor Usage

Free tier limits:
- **Database**: 500MB
- **Storage**: 1GB
- **Bandwidth**: 2GB/month
- **API requests**: Unlimited (with reasonable use)

Monitor in **Settings** → **Usage**. Upgrade to Pro ($25/month) when needed.

## Upgrading to Production

When ready for production:

1. **Upgrade Plan**: Pro tier ($25/month) gives:
   - 8GB database
   - 100GB storage
   - 50GB bandwidth
   - Daily backups
   - Support

2. **Enable Point-in-Time Recovery (PITR)**:
   - Go to **Settings** → **Database**
   - Enable PITR for backups

3. **Set up Custom Domain** (optional):
   - Configure custom domain for API
   - Update `NEXT_PUBLIC_SUPABASE_URL`

4. **Enable Replication** (optional):
   - For high availability
   - Available on Pro tier

## Security Checklist

✅ RLS enabled on all tables  
✅ Service role key never exposed to client  
✅ Auth policies tested  
✅ SSL/HTTPS enforced  
✅ Rate limiting configured (via Upstash Redis)  
✅ Environment variables secured  
✅ Regular backups enabled  

## Common Issues

### Issue: "Invalid API key"
- **Solution**: Double-check `.env.local` has correct keys
- Make sure you copied the full key (they're long!)

### Issue: "Row Level Security" errors
- **Solution**: Check that RLS policies are active
- Verify user is authenticated
- Check policy conditions match your use case

### Issue: "Database connection failed"
- **Solution**: Verify Supabase project is active (not paused)
- Free tier projects pause after 1 week of inactivity
- Go to dashboard to wake it up

### Issue: "Schema changes not reflected"
- **Solution**: Clear your browser cache
- Restart Next.js dev server
- Check SQL Editor for error messages

## Next Steps

1. ✅ Database set up
2. 🔄 Update API routes to use Supabase (next task)
3. 🔄 Replace mock data with real queries
4. 🔄 Test all CRUD operations
5. 🔄 Set up storage for photos
6. 🔄 Configure backups

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## Support

- **Supabase Support**: [support.supabase.com](https://support.supabase.com)
- **Community**: [supabase.com/community](https://supabase.com/community)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)

