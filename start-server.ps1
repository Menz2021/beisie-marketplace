# PowerShell script to start the development server with correct environment variables
$env:DATABASE_URL="postgresql://postgres:x855bMcb160J86kv@db.jflezxcpylccucevhbkv.supabase.co:5432/postgres"
npm run dev
