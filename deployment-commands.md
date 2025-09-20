# Deployment Commands for Beisie Marketplace

## Step 1: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Beisie Marketplace"
```

## Step 2: Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name: `beisie-marketplace`
4. Make it public
5. Don't initialize with README
6. Copy the repository URL

## Step 3: Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/beisie-marketplace.git
git branch -M main
git push -u origin main
```

## Step 4: Set Up Supabase Database
1. Go to https://supabase.com
2. Create new project: `beisie-marketplace`
3. Copy the database connection string
4. It looks like: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

## Step 5: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your `beisie-marketplace` repository
4. Add environment variables:
   - DATABASE_URL = your_supabase_connection_string
   - NEXTAUTH_URL = https://your-project-name.vercel.app
   - NEXTAUTH_SECRET = generate_a_random_string_here
   - NODE_ENV = production
5. Click Deploy

## Step 6: Set Up Database
After deployment, run these commands:
```bash
npx prisma db push
npx prisma generate
node scripts/create-test-accounts.js
```

## Your deployed site will be at:
https://your-project-name.vercel.app




