# PowerShell script to start the development server with correct environment variables
$env:DATABASE_URL="postgresql://postgres.blqarrlpyteuelqwslen:Mugoyaronald2020@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
npm run dev
