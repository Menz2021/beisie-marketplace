# OAuth Setup Guide

## Required Environment Variables

Add these environment variables to your `.env.local` file and Vercel dashboard:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL
NEXTAUTH_SECRET=your-secret-key-here  # Generate a random secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to "Facebook Login" → "Settings"
5. Add valid OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (for development)
   - `https://yourdomain.com/api/auth/callback/facebook` (for production)
6. Copy the App ID and App Secret

## Database Migration

Run the following command to update your database schema:

```bash
npx prisma db push
```

## Testing

1. Start your development server: `npm run dev`
2. Go to `/auth/login`
3. Try signing in with Google or Facebook
4. Check that users are created in your database

## Notes

- OAuth users will be automatically verified (`isVerified: true`)
- OAuth users will have role `CUSTOMER` by default
- Users can link multiple OAuth accounts to the same email
- The system will create a random password for OAuth users (they won't use it)
