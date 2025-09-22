const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔧 Setting up local development environment...')

// Create .env.local file
const envContent = `# Local Development Environment
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-key-2024"
NODE_ENV="development"
`

fs.writeFileSync('.env.local', envContent)
console.log('✅ Created .env.local file')

// Copy dev schema to main schema
fs.copyFileSync('prisma/schema-dev.prisma', 'prisma/schema.prisma')
console.log('✅ Updated Prisma schema for local development')

// Generate Prisma client
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Generated Prisma client')
} catch (error) {
  console.error('❌ Error generating Prisma client:', error.message)
}

// Push database schema
try {
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ Pushed database schema')
} catch (error) {
  console.error('❌ Error pushing database schema:', error.message)
}

console.log('🎉 Local development environment setup complete!')
console.log('📝 Next steps:')
console.log('1. Run: npm run dev')
console.log('2. Run: node scripts/seed-local-data.js')
console.log('3. Visit: http://localhost:3000')
