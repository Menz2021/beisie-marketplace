const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateDatabase() {
  try {
    console.log('🔄 Starting database migration...')
    
    // Check if ConfirmationToken table exists by trying to query it
    try {
      await prisma.confirmationToken.findMany({ take: 1 })
      console.log('✅ ConfirmationToken table already exists')
    } catch (error) {
      console.log('❌ ConfirmationToken table does not exist')
      console.log('📝 You need to run: npx prisma db push')
      console.log('🔧 Or add the table manually in your database')
      
      // Create a simple SQL command to add the table
      console.log('\n📋 SQL to run in your database:')
      console.log(`
CREATE TABLE "confirmation_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "confirmation_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "confirmation_tokens_token_key" ON "confirmation_tokens"("token");

CREATE INDEX "confirmation_tokens_userId_fkey" ON "confirmation_tokens"("userId");

ALTER TABLE "confirmation_tokens" ADD CONSTRAINT "confirmation_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `)
    }
    
    console.log('✅ Database migration check completed')
    
  } catch (error) {
    console.error('❌ Migration error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateDatabase()
