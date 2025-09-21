# PowerShell script to start the development server with correct environment variables
$env:DATABASE_URL="postgresql://postgres:Mugoyaronald2020@db.blqarrlpyteuelqwslen.supabase.co:5432/postgres"
npm run dev
