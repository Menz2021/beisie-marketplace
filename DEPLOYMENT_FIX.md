# Fix for Live Website Categories Issue

## Problem
The categories are working on localhost but not on the live website (Vercel deployment).

## Root Cause
The production environment doesn't have the correct environment variables configured.

## Solution

### Method 1: Configure Environment Variables in Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (beisie-marketplace)
3. **Go to Settings → Environment Variables**
4. **Add these environment variables**:

```
DATABASE_URL = postgresql://postgres:x855bMcb160J86kv@db.jflezxcpylccucevhbkv.supabase.co:5432/postgres
NEXTAUTH_URL = https://your-project-name.vercel.app
NEXTAUTH_SECRET = your-random-secret-key-here
NODE_ENV = production
```

5. **Redeploy**: Go to Deployments tab and click "Redeploy" on the latest deployment

### Method 2: Use Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Set environment variables**:
   ```bash
   vercel env add DATABASE_URL
   # Enter: postgresql://postgres:x855bMcb160J86kv@db.jflezxcpylccucevhbkv.supabase.co:5432/postgres
   
   vercel env add NEXTAUTH_URL
   # Enter: https://your-project-name.vercel.app
   
   vercel env add NEXTAUTH_SECRET
   # Enter: your-random-secret-key-here
   
   vercel env add NODE_ENV
   # Enter: production
   ```

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Method 3: Update vercel.json (Already Done)

The `vercel.json` file has been updated with the DATABASE_URL. You can also add other environment variables there.

## After Fixing

1. **Test the categories API**: `https://your-project-name.vercel.app/api/categories`
2. **Test the categories page**: `https://your-project-name.vercel.app/categories`
3. **Test individual categories**: `https://your-project-name.vercel.app/categories/electronics`

## Verification

The categories should now work on the live website just like they do on localhost.

## Additional Notes

- Make sure to replace `your-project-name` with your actual Vercel project name
- The NEXTAUTH_SECRET should be a random string (you can generate one online)
- After adding environment variables, you must redeploy for changes to take effect
