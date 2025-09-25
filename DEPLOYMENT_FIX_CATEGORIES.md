# Fix Categories Not Showing on Live Website

## Problem
Categories are not displaying on the live website, likely due to database connection or seeding issues.

## Root Causes Identified
1. **Environment Variables**: DATABASE_URL not properly set in Vercel
2. **Database Seeding**: Categories may not exist in production database
3. **Schema Mismatch**: Local SQLite vs Production PostgreSQL

## Solution Steps

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production** environment:

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `postgresql://postgres.blqarrlpyteuelqwslen:Mugoyaronald2020@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `NODE_ENV` | `production` |

### Step 2: Seed Production Database

Run the production seeding script:

```bash
# Set environment to production
NODE_ENV=production

# Run the seeding script
node scripts/seed-production-categories.js
```

### Step 3: Redeploy Your Application

1. Go to Vercel Dashboard → Deployments
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete (2-3 minutes)

### Step 4: Test the Fix

Test these endpoints:

1. **Database Connection Test:**
   ```
   https://your-project-name.vercel.app/api/test-db
   ```
   Expected: `{"success": true, "message": "Database connected successfully!"}`

2. **Categories API Test:**
   ```
   https://your-project-name.vercel.app/api/categories
   ```
   Expected: `{"success": true, "data": [...], "count": 24}`

3. **Categories Page Test:**
   ```
   https://your-project-name.vercel.app/categories
   ```
   Expected: Categories grid should display

### Step 5: Verify Categories Are Working

- ✅ Home page shows "Shop by Category" section
- ✅ Categories page displays all categories
- ✅ Individual category pages work (e.g., `/categories/electronics`)

## Alternative: Manual Database Seeding

If the script doesn't work, manually seed categories in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Table Editor** → **categories**
4. Insert these categories:

```sql
INSERT INTO categories (name, description, slug) VALUES
('Electronics', 'Electronic devices and gadgets', 'electronics'),
('Mobile Phones', 'Smartphones and accessories', 'mobile-phones'),
('Fashion', 'Clothing and fashion items', 'fashion'),
('Home & Kitchen', 'Home and kitchen products', 'home-kitchen'),
('Beauty & Health', 'Beauty and health products', 'beauty-health'),
('Laptops & Computers', 'Laptops, desktops and computer accessories', 'laptops-computers'),
('Gaming', 'Gaming consoles and accessories', 'gaming'),
('Cameras & Photography', 'Cameras and photography equipment', 'cameras-photography'),
('Audio & Headphones', 'Audio equipment and headphones', 'audio-headphones'),
('Wearables', 'Smartwatches and wearable devices', 'wearables');
```

## Troubleshooting

### If Categories Still Don't Show:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions
   - Look for error logs in `/api/categories`

2. **Verify Database Connection:**
   - Test: `https://your-project-name.vercel.app/api/test-db`
   - Should return success with category count

3. **Check Environment Variables:**
   - Make sure they're set for **Production** environment
   - Not just Preview or Development

4. **Database Schema Issues:**
   - Ensure production database has `categories` table
   - Check if Prisma migrations ran successfully

### Common Error Messages:

- **"Database not found"**: DATABASE_URL is incorrect
- **"Table doesn't exist"**: Run Prisma migrations
- **"Connection timeout"**: Supabase database might be paused
- **"Authentication failed"**: Database credentials are wrong

## Quick Commands

```bash
# Test database connection locally
NODE_ENV=production node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.category.count().then(count => {
  console.log('Categories count:', count);
  prisma.\$disconnect();
});
"

# Generate Prisma client for production
npx prisma generate

# Run migrations (if needed)
npx prisma migrate deploy
```

## Expected Results

After completing these steps:
- ✅ Categories API returns data
- ✅ Categories page displays properly
- ✅ Home page shows category section
- ✅ Individual category pages work
- ✅ Products are accessible by category

## Files Modified

- `vercel.json` - Removed hardcoded env vars
- `app/api/categories/route.ts` - Added better error handling
- `scripts/seed-production-categories.js` - New production seeding script
- `DEPLOYMENT_FIX_CATEGORIES.md` - This guide
