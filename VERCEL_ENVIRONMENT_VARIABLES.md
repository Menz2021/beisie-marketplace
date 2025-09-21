# Vercel Environment Variables for Beisie Marketplace

## Required Environment Variables

Add these **exact** environment variables to your Vercel project:

### 1. DATABASE_URL
```
postgresql://postgres:x855bMcb160J86kv@db.jflezxcpylccucevhbkv.supabase.co:5432/postgres
```

### 2. NEXTAUTH_URL
```
https://beisie-marketplace.vercel.app
```

### 3. NEXTAUTH_SECRET
```
your-random-secret-key-here-make-it-long-and-random
```

### 4. NODE_ENV
```
production
```

## How to Add These in Vercel:

1. **Go to**: https://vercel.com/dashboard
2. **Select your project**: `beisie-marketplace`
3. **Go to**: Settings → Environment Variables
4. **Add each variable** with these exact values:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:x855bMcb160J86kv@db.jflezxcpylccucevhbkv.supabase.co:5432/postgres` | Production |
| `NEXTAUTH_URL` | `https://beisie-marketplace.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `your-random-secret-key-here-make-it-long-and-random` | Production |
| `NODE_ENV` | `production` | Production |

## Important Notes:

- ✅ **Set for Production environment** (not just Preview)
- ✅ **Use exact values** as shown above
- ✅ **After adding all variables, redeploy** your project
- ✅ **Wait 2-3 minutes** for deployment to complete

## After Adding Variables:

1. **Go to Deployments tab**
2. **Click "Redeploy"** on the latest deployment
3. **Wait for deployment to complete**
4. **Test**: `https://beisie-marketplace.vercel.app/api/test-db`

## Generate NEXTAUTH_SECRET:

You can generate a random secret key here: https://generate-secret.vercel.app/32

Or use this one: `beisie-marketplace-secret-key-2024-very-long-and-secure`

## Expected Result:

After adding these variables and redeploying:
- ✅ Database connection will work
- ✅ Categories API will return data
- ✅ Categories page will show dynamic content
- ✅ All products will be accessible

## Troubleshooting:

If still not working:
1. **Check Supabase database** is not paused
2. **Verify connection string** in Supabase dashboard
3. **Make sure variables are set for Production** environment
4. **Redeploy after adding variables**
