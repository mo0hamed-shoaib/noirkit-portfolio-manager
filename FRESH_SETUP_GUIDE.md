# NoirKit Portfolio Manager - Fresh Setup Guide

A complete guide to set up a new NoirKit portfolio project from scratch.

## 🚀 Quick Start

1. **Create Supabase Project**
2. **Configure Environment Variables**
3. **Set Up Authentication**
4. **Run Database Scripts**
5. **Start Development Server**

---

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- Git repository (optional but recommended)

---

## 🔧 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys
3. Wait for the project to be ready (usually 2-3 minutes)

---

## ⚙️ Step 2: Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Replace the placeholder values with your actual Supabase project credentials.

---

## 🔐 Step 3: Configure Authentication

### 3.1 Supabase Dashboard Settings

1. **Go to Authentication > URL Configuration**
2. **Set Site URL**:

   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. **Add Redirect URLs**:
   - `http://localhost:3000/`
   - `http://localhost:3000/auth/confirm-email`
   - `https://yourdomain.com/` (for production)
   - `https://yourdomain.com/auth/confirm-email` (for production)

### 3.2 Email Templates (Optional)

1. Go to **Authentication > Email Templates**
2. Select **"Confirm signup"**
3. Customize the email content and styling
4. The confirmation link will automatically redirect to `/auth/confirm-email`

### 3.3 Email Confirmation Flow

The app includes a dedicated email confirmation page that provides:

- ✅ Better user experience with clear confirmation feedback
- ✅ Dedicated page explaining next steps
- ✅ Direct link to login page
- ✅ Consistent branding and design
- ✅ Mobile-friendly responsive design

**How it works:**

1. User signs up → Gets confirmation email
2. User clicks email link → Redirected to `/auth/confirm-email`
3. Confirmation page → Shows success message with login button
4. User clicks login → Redirected to login page

---

## 🗄️ Step 4: Run Database Scripts

Run these SQL scripts in your Supabase SQL Editor in **exact order**:

### 4.1 Essential Scripts

1. **`create-database-schema.sql`** - Creates all tables and policies
2. **`create-storage-buckets.sql`** - Creates storage buckets and policies

### 4.2 Script Order

```sql
-- Run this first
-- Copy and paste the contents of create-database-schema.sql

-- Then run this
-- Copy and paste the contents of create-storage-buckets.sql
```

---

## 🖥️ Step 5: Start Development Server

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see your portfolio!

---

## 📁 Storage System

### File Organization

Your files are stored in user-specific folders within each bucket:

- **Profile Images**: `{user-id}/profile.{extension}`
- **Project Images**: `{user-id}/{project-id}_{index}.{extension}`
- **CV Files**: `{user-id}/cv.{extension}`

### Why Files Don't Show in Supabase Dashboard

This is **completely normal**! Here's why:

1. **Nested Folder Structure**: Files are stored in user-specific folders
2. **Dashboard Limitations**: Supabase dashboard doesn't show nested folders clearly
3. **File Organization**: App uses logical folder structure for security

### How to Verify Files Are Working

✅ **Primary Method**: If you can see images on your portfolio homepage, files are working correctly!

🔍 **Alternative Methods**:

1. **Use the Storage Dashboard Page**:

   - Go to `/dashboard/storage` in your app
   - View all files with details, sizes, and upload dates

2. **Run SQL Query**:
   ```sql
   SELECT bucket_id, name, created_at, metadata
   FROM storage.objects
   ORDER BY created_at DESC;
   ```

### Storage Management

Instead of using Supabase Dashboard, use the **Storage Management page** in your app:

- Navigate to `/dashboard/storage`
- View all files with details
- See file sizes, upload dates, and metadata
- Delete files directly from the interface

---

## 🚀 Production Deployment

### Environment Variables

Update your environment variables for production:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Supabase Configuration

1. Update Site URL to your production domain
2. Add production redirect URLs
3. Test email confirmation flow
4. Consider setting up custom email domain

### File URLs

Your files are accessible via public URLs:

- **Profile Images**: `https://your-project.supabase.co/storage/v1/object/public/profile-images/{user-id}/profile.jpg`
- **Project Images**: `https://your-project.supabase.co/storage/v1/object/public/project-images/{user-id}/{project-id}_{index}.jpg`
- **CV Files**: `https://your-project.supabase.co/storage/v1/object/public/cv-files/{user-id}/cv.pdf`

---

## 🔧 Troubleshooting

### Email Issues

- **Email not sending**: Check Supabase email settings and SMTP configuration
- **Redirect not working**: Verify redirect URLs in Supabase dashboard
- **Page not loading**: Check Next.js app is running and page exists

### Storage Issues

- **Images don't show**: Check browser console, verify file URLs in database
- **Upload fails**: Check file size limits (5MB profile, 10MB projects/CV), verify file types
- **Files not visible**: Use `/dashboard/storage` page instead of Supabase dashboard

### General Issues

- **Authentication errors**: Verify environment variables are correct
- **Database errors**: Ensure all SQL scripts ran successfully
- **Build errors**: Check Node.js version and dependencies

---

## 📚 Next Steps

1. **Customize your portfolio** through the dashboard
2. **Upload profile image** and CV
3. **Add projects** with images and links
4. **Configure social links** and tech stack
5. **Set up contact form** for inquiries
6. **Deploy to production** when ready

---

## 🆘 Need Help?

- Check the browser console for error messages
- Verify all environment variables are set correctly
- Ensure all SQL scripts ran without errors
- Test the email confirmation flow
- Use the storage management page for file verification

---

**🎉 Congratulations!** Your NoirKit portfolio is now ready to use!
