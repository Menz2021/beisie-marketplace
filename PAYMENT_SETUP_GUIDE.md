# Payment Integration Setup Guide

This guide will help you set up real payment processing for your Uganda marketplace.

## 🏦 Payment Providers Setup

### 1. MTN Mobile Money Setup

**Step 1: Register with MTN MoMo API**
- Visit: https://momodeveloper.mtn.com/
- Create a developer account
- Create a new app/project
- Get your API credentials (API Key, API Secret)

**Step 2: Configure Environment Variables**
```bash
MTN_API_KEY=your_mtn_api_key_here
MTN_API_SECRET=your_mtn_api_secret_here
MTN_ENVIRONMENT=sandbox  # Change to "production" when ready
MTN_CALLBACK_URL=https://yourdomain.com/api/payments/mtn/callback
```

**Step 3: Test Integration**
- Use sandbox environment first
- Test with MTN's test phone numbers
- Verify webhook callbacks

### 2. Airtel Money Setup

**Step 1: Register with Airtel Money API**
- Visit: https://openapiuat.airtel.africa/
- Create a developer account
- Get your client credentials

**Step 2: Configure Environment Variables**
```bash
AIRTEL_CLIENT_ID=your_airtel_client_id_here
AIRTEL_CLIENT_SECRET=your_airtel_client_secret_here
AIRTEL_ENVIRONMENT=sandbox  # Change to "production" when ready
AIRTEL_CALLBACK_URL=https://yourdomain.com/api/payments/airtel/callback
```

### 3. Stripe Setup (for Visa/Mastercard)

**Step 1: Create Stripe Account**
- Visit: https://stripe.com/
- Create an account
- Get your API keys from dashboard

**Step 2: Configure Environment Variables**
```bash
STRIPE_PUBLIC_KEY=pk_test_...  # or pk_live_... for production
STRIPE_SECRET_KEY=sk_test_...  # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_...  # Get from Stripe dashboard
```

**Step 3: Configure Webhook**
- In Stripe dashboard, go to Webhooks
- Add endpoint: `https://yourdomain.com/api/payments/stripe/webhook`
- Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`

## 🔧 Implementation Steps

### Step 1: Update Environment Variables
Copy the example environment file and fill in your credentials:
```bash
cp env.payment.example .env.local
# Edit .env.local with your actual credentials
```

### Step 2: Test Payment Configuration
```bash
# Check if all required environment variables are set
npm run test:payment-config
```

### Step 3: Update Payment Classes
The payment classes in `lib/payments.ts` need to be updated with real API implementations:

1. **MTN Mobile Money**: Replace mock implementation with real MTN API calls
2. **Airtel Money**: Replace mock implementation with real Airtel API calls  
3. **Stripe**: Replace mock implementation with real Stripe SDK

### Step 4: Test Payment Flow
1. Create a test order
2. Initiate payment with each method
3. Verify webhook callbacks
4. Check order status updates

## 🧪 Testing

### Sandbox Testing
- **MTN**: Use MTN's sandbox environment and test phone numbers
- **Airtel**: Use Airtel's UAT environment
- **Stripe**: Use Stripe's test mode with test card numbers

### Test Card Numbers (Stripe)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

### Test Phone Numbers (Uganda)
- **MTN**: +256700000000 (sandbox)
- **Airtel**: +256700000001 (sandbox)

## 🚀 Production Deployment

### Before Going Live:
1. ✅ Test all payment methods thoroughly
2. ✅ Set up proper webhook verification
3. ✅ Configure production API keys
4. ✅ Set up monitoring and logging
5. ✅ Test with real small amounts first

### Environment Variables for Production:
```bash
# Change all sandbox/test keys to production keys
MTN_ENVIRONMENT=production
AIRTEL_ENVIRONMENT=production
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## 📱 Mobile Money Integration Details

### MTN Mobile Money API Flow:
1. **Initiate Payment**: POST to MTN collection API
2. **User Confirmation**: Customer confirms on their phone
3. **Webhook Notification**: MTN sends status update
4. **Order Update**: Update order status in database

### Airtel Money API Flow:
1. **Get Access Token**: Authenticate with Airtel
2. **Initiate Payment**: POST to Airtel payments API
3. **User Confirmation**: Customer confirms on their phone
4. **Webhook Notification**: Airtel sends status update
5. **Order Update**: Update order status in database

## 🔒 Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **Environment Variables**: Never commit API keys to code
3. **HTTPS**: Use HTTPS for all webhook endpoints
4. **Rate Limiting**: Implement rate limiting for payment endpoints
5. **Logging**: Log all payment activities for audit

## 📞 Support Contacts

- **MTN MoMo API**: https://momodeveloper.mtn.com/support
- **Airtel Money API**: https://openapiuat.airtel.africa/support
- **Stripe Support**: https://support.stripe.com/

## 🐛 Troubleshooting

### Common Issues:
1. **Webhook not receiving**: Check URL accessibility and SSL certificate
2. **Payment stuck in pending**: Check webhook implementation
3. **API errors**: Verify API credentials and environment settings
4. **Phone number validation**: Ensure Uganda phone number format

### Debug Commands:
```bash
# Check payment configuration
npm run check:payment-config

# Test webhook endpoints
curl -X POST https://yourdomain.com/api/payments/mtn/callback

# View payment logs
npm run logs:payment
```
