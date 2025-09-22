const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const environment = args[0] || 'local'

console.log(`🔄 Switching to ${environment} environment...`)

if (environment === 'local') {
  // Switch to local development
  console.log('📱 Setting up local development environment...')
  
  // Copy dev schema to main schema
  fs.copyFileSync('prisma/schema-dev.prisma', 'prisma/schema.prisma')
  console.log('✅ Updated Prisma schema for local development')
  
  // Create .env.local for local development
  const envContent = `# Local Development Environment
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-key-2024"
NODE_ENV="development"
`
  
  fs.writeFileSync('.env.local', envContent)
  console.log('✅ Created .env.local for local development')
  
  console.log('📝 Next steps for local development:')
  console.log('1. Run: npx prisma generate')
  console.log('2. Run: npx prisma db push')
  console.log('3. Run: node scripts/seed-local-data.js')
  console.log('4. Run: npm run dev')
  
} else if (environment === 'production') {
  // Switch to production
  console.log('🌐 Setting up production environment...')
  
  // Copy production schema to main schema
  fs.copyFileSync('prisma/schema-production.prisma', 'prisma/schema.prisma')
  console.log('✅ Updated Prisma schema for production')
  
  // Remove .env.local to use production environment
  if (fs.existsSync('.env.local')) {
    fs.unlinkSync('.env.local')
    console.log('✅ Removed .env.local (using production environment)')
  }
  
  console.log('📝 Next steps for production:')
  console.log('1. Run: npx prisma generate')
  console.log('2. Run: npm run dev')
  
} else {
  console.log('❌ Invalid environment. Use "local" or "production"')
  console.log('Usage: node scripts/switch-env.js [local|production]')
  process.exit(1)
}

console.log(`✅ Switched to ${environment} environment!`)
