# Portfolio SaaS Setup Guide

This guide will help you set up your portfolio SaaS application with Supabase integration.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- Git (optional, for version control)

## Step 1: Supabase Project Setup

1. **Create a new Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name and database password
   - Select a region close to your users
   - Click "Create new project"

2. **Get your project credentials**:
   - Go to Settings > API
   - Copy the Project URL and anon public key
   - Go to Settings > API > Service Role keys
   - Copy the service_role secret key

## Step 2: Environment Variables

1. **Create environment file**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Add your Supabase credentials**:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

## Step 3: Database Setup

1. **Run the database schema**:
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Copy and paste the content from `scripts/create-database-schema.sql`
   - Click "Run"

2. **Set up storage buckets**:
   - In SQL Editor, copy and paste the content from `scripts/create-storage-buckets.sql`
   - Click "Run"

3. **Add sample data** (optional):
   - In SQL Editor, copy and paste the content from `scripts/populate-sample-data.sql`
   - **Important**: Replace the user ID in the script with your actual user ID
   - Click "Run"

## Step 4: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Step 5: Run the Application

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`.

## Step 6: Create Your Account

1. **Sign up**:
   - Go to `/auth/signup`
   - Create your account
   - Check your email for verification link
   - Click the verification link

2. **Sign in**:
   - Go to `/auth/login`
   - Sign in with your credentials
   - You'll be redirected to the dashboard

## Step 7: Customize Your Portfolio

1. **Update your profile**:
   - Go to Dashboard
   - Update your name, job title, bio, etc.
   - Upload a profile image

2. **Add your projects**:
   - Go to Dashboard > Projects
   - Add your projects with descriptions, links, and images

3. **Configure your tech stack**:
   - Go to Dashboard > Tech Stack
   - Add the technologies you use

4. **Add achievements**:
   - Go to Dashboard > Achievements
   - Add your education, certifications, awards

5. **Set up social links**:
   - Go to Dashboard > Social Links
   - Add your social media profiles

6. **Customize contact form**:
   - Go to Dashboard > Contact Form
   - Add/remove fields as needed

## Step 8: View Your Portfolio

- Your public portfolio is available at the root URL (`/`)
- Share this URL with potential clients or employers
- No authentication required for visitors to view your portfolio

## Features

### For Portfolio Owners:
- ✅ **Dashboard Management**: Full control over portfolio content
- ✅ **File Uploads**: Profile images, project screenshots, CV files
- ✅ **Drag & Drop Reordering**: Organize content order
- ✅ **Contact Form Builder**: Customize contact form fields
- ✅ **Contact Submissions**: View messages from visitors
- ✅ **Data Export**: Backup your portfolio data
- ✅ **Analytics**: Basic stats overview

### For Visitors:
- ✅ **Public Portfolio**: View complete portfolio without login
- ✅ **Contact Forms**: Send messages to portfolio owner
- ✅ **Responsive Design**: Works on all devices
- ✅ **Fast Loading**: Optimized performance

## Security Features

- **Row Level Security**: Users only see their own data
- **File Access Control**: Proper permissions for uploads
- **Authentication**: Secure login/signup with email verification
- **Protected Routes**: Dashboard requires authentication

## Troubleshooting

### Common Issues:

1. **"Permission denied" error in SQL**:
   - Make sure you're using the SQL Editor in Supabase Dashboard
   - Don't include the JWT secret line (it's already removed from our scripts)

2. **Environment variables not working**:
   - Make sure your `.env.local` file is in the root directory
   - Restart your development server after adding environment variables

3. **File uploads not working**:
   - Check that storage buckets were created successfully
   - Verify your Supabase service role key is correct

4. **Sample data not populating**:
   - Make sure you've signed up and verified your email first
   - Replace the user ID in the populate script with your actual user ID
   - Check the Supabase logs for any errors

### Getting Help:

If you encounter issues:
1. Check the browser console for error messages
2. Check the Supabase Dashboard logs
3. Verify all environment variables are set correctly
4. Make sure all SQL scripts ran successfully

## Next Steps

- **Custom Domain**: Set up a custom domain for your portfolio
- **SEO Optimization**: Add meta tags and structured data
- **Analytics**: Integrate Google Analytics or similar
- **Email Notifications**: Get notified when someone contacts you
- **Themes**: Customize the design to match your brand

Your portfolio SaaS is now ready to use! 🚀
