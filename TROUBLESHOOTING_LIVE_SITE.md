# Troubleshooting Live Website Categories Issue

## Step 1: Verify Environment Variables Are Set

### Check in Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these are set:
   - `DATABASE_URL` = `postgresql://postgres:x855bMcb160J86kv@db.jflezxcpylccucevhbkv.supabase.co:5432/postgres`
   - `NEXTAUTH_URL` = `https://your-project-name.vercel.app`
   - `NODE_ENV` = `production`

### Check Environment Variables Scope:
- Make sure they're set for **Production** environment
- Not just Preview or Development

## Step 2: Test Your Live Website

### Test the API directly:
```
https://your-project-name.vercel.app/api/categories
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Electronics",
      "slug": "electronics",
      "description": "..."
    }
  ]
}
```

### Test the Categories Page:
```
https://your-project-name.vercel.app/categories
```

**Expected:** Should show categories grid, not loading spinner

## Step 3: Check Common Issues

### Issue 1: Environment Variables Not Applied
**Solution:** 
1. Go to Vercel Dashboard → Deployments
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete

### Issue 2: Wrong Database URL
**Check:** Make sure the DATABASE_URL is exactly:
```
postgresql://postgres:x855bMcb160J86kv@db.jflezxcpylccucevhbkv.supabase.co:5432/postgres
```

### Issue 3: Database Not Accessible
**Test:** Try connecting to your Supabase database directly:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Check if the connection string is correct

### Issue 4: Prisma Client Not Generated
**Solution:** Add this to your `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## Step 4: Debug with Console Logs

### Add Debug Logging to API:
Edit `app/api/categories/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Categories API called')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log('📂 Found categories:', categories.length)
    
    return NextResponse.json({
      success: true,
      data: categories
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ Categories API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
```

### Check Vercel Function Logs:
1. Go to Vercel Dashboard → Functions
2. Look for error logs in the categories API

## Step 5: Alternative Solutions

### Solution 1: Force Redeploy
```bash
# If you have Vercel CLI
vercel --prod --force
```

### Solution 2: Check Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check **Build Logs** for errors

### Solution 3: Test Database Connection
Create a test API endpoint at `app/api/test-db/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.category.count()
    return NextResponse.json({ 
      success: true, 
      message: `Database connected! Found ${count} categories` 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
```

Then test: `https://your-project-name.vercel.app/api/test-db`

## Step 6: Final Verification

### If everything is working:
- ✅ `https://your-project-name.vercel.app/api/categories` returns JSON
- ✅ `https://your-project-name.vercel.app/categories` shows categories
- ✅ `https://your-project-name.vercel.app/categories/electronics` shows products

### If still not working:
1. Check Vercel Function logs for specific errors
2. Verify Supabase database is accessible
3. Make sure all environment variables are set for Production
4. Try redeploying with a new commit

## Quick Fix Commands

```bash
# Test locally with production environment
NODE_ENV=production node test-production.js

# Check if environment variables are loaded
node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL)"
```
