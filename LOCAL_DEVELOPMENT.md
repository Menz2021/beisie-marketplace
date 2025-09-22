# Local Development Setup

This document explains how to set up and use the local development environment for the Beisie Marketplace.

## 🚀 Quick Start

### 1. Switch to Local Development
```bash
node scripts/switch-env.js local
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Visit Local Website
Open http://localhost:3000 in your browser

## 📁 Environment Files

- **Local Development**: `.env.local` (SQLite database)
- **Production**: Uses production PostgreSQL database

## 🗄️ Database

### Local Development (SQLite)
- **File**: `prisma/dev.db`
- **Schema**: `prisma/schema-dev.prisma`
- **Data**: Seeded with test categories and users

### Production (PostgreSQL)
- **Host**: Supabase PostgreSQL
- **Schema**: `prisma/schema-production.prisma`

## 🔄 Switching Environments

### Switch to Local Development
```bash
node scripts/switch-env.js local
npm run dev
```

### Switch to Production
```bash
node scripts/switch-env.js production
npm run dev
```

## 🧪 Test Accounts

### Local Development
- **Admin**: admin@beisie.com / admin123
- **Seller**: seller@testmarketplace.ug / password123
- **Customer**: customer@testmarketplace.ug / password123

### Production
- **Admin**: admin@beisie.com / admin123
- **Other accounts**: As configured in production database

## 📦 Available Categories (Local)

1. Electronics
2. **Mobile Phones** ✅
3. Fashion
4. Home & Kitchen
5. Beauty & Health
6. Laptops & Computers
7. Gaming
8. Cameras & Photography
9. Audio & Headphones
10. Wearables
11. Power Banks & Chargers
12. Tablets
13. TVs & Accessories
14. Automotive
15. Sports & Fitness
16. Books & Media
17. Toys & Games
18. Furniture
19. Jewelry
20. Watches

## 🛠️ Development Workflow

### Making Changes
1. **Switch to local**: `node scripts/switch-env.js local`
2. **Make your changes** to the code
3. **Test locally**: Visit http://localhost:3000
4. **Switch to production**: `node scripts/switch-env.js production`
5. **Deploy to production**: Push to GitHub (auto-deploys via Vercel)

### Adding New Categories
1. **Local**: Edit `scripts/seed-local-data.js` and run it
2. **Production**: Use the admin panel or database directly

### Database Changes
1. **Local**: Modify `prisma/schema-dev.prisma`
2. **Production**: Modify `prisma/schema-production.prisma`
3. **Run**: `npx prisma db push` and `npx prisma generate`

## 📝 Scripts

- `scripts/switch-env.js` - Switch between local and production
- `scripts/seed-local-data.js` - Seed local database with test data
- `scripts/setup-local-dev.js` - Complete local development setup

## 🎯 Benefits of Local Development

✅ **Independent Development**: Work without affecting production
✅ **Fast Iteration**: No network latency for database queries
✅ **Safe Testing**: Test new features without risk
✅ **Offline Development**: Work without internet connection
✅ **Easy Reset**: Clear and reseed database anytime

## 🚨 Important Notes

- **Always switch to local** before making changes
- **Test thoroughly** in local environment before deploying
- **Use production environment** only for final testing before deployment
- **Backup production data** before making major changes

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
rm prisma/dev.db
npx prisma db push
node scripts/seed-local-data.js
```

### Port Already in Use
```bash
# Kill existing processes
taskkill /F /IM node.exe
npm run dev
```

### Environment Issues
```bash
# Clear and reset
rm .env.local
node scripts/switch-env.js local
```
