# Email Confirmation Setup Guide

This guide explains how to configure email confirmation redirects for your NoirKit portfolio application.

## Current Setup

The application now includes a dedicated email confirmation page at `/auth/confirm-email` that provides a better user experience when users click the confirmation link in their email.

## Configuration Steps

### 1. Environment Variables

Add the following environment variable to your `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, update this to your actual domain:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 2. Supabase Dashboard Configuration

1. **Go to your Supabase Dashboard**

   - Navigate to Authentication > URL Configuration
   - Or go to Settings > Auth > URL Configuration

2. **Update Site URL**

   - Set the Site URL to your application's base URL
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`

3. **Update Redirect URLs**
   - Add the following redirect URL:
   - `http://localhost:3000/auth/confirm-email` (for development)
   - `https://yourdomain.com/auth/confirm-email` (for production)

### 3. Email Templates (Optional)

You can customize the email confirmation template in Supabase:

1. Go to Authentication > Email Templates
2. Select "Confirm signup"
3. Customize the email content and styling
4. The confirmation link will automatically redirect to `/auth/confirm-email`

## How It Works

1. **User signs up** → Gets confirmation email
2. **User clicks email link** → Redirected to `/auth/confirm-email`
3. **Confirmation page** → Shows success message with login button
4. **User clicks login** → Redirected to login page

## Benefits

- ✅ Better user experience with clear confirmation feedback
- ✅ Dedicated page explaining next steps
- ✅ Direct link to login page
- ✅ Consistent branding and design
- ✅ Mobile-friendly responsive design

## Troubleshooting

### Email not sending

- Check your Supabase project's email settings
- Verify SMTP configuration if using custom email provider
- Check spam/junk folders

### Redirect not working

- Verify the redirect URL is added to Supabase dashboard
- Check that `NEXT_PUBLIC_SITE_URL` environment variable is set correctly
- Ensure the `/auth/confirm-email` page exists

### Page not loading

- Check that the Next.js app is running
- Verify the page component is properly exported
- Check browser console for any errors

## Production Deployment

When deploying to production:

1. Update `NEXT_PUBLIC_SITE_URL` to your production domain
2. Add the production redirect URL to Supabase dashboard
3. Test the email confirmation flow in production
4. Consider setting up custom email domain for better deliverability
