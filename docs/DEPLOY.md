# 🚀 Deploy to Vercel

## Quick Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Fix useSearchParams Suspense issue"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Your portfolio will be live in minutes!

## ✅ Fixed Issues

- **useSearchParams Suspense**: Wrapped in Suspense boundary
- **Build errors**: Added experimental config
- **Static generation**: Properly handled dynamic routes

## 🎉 Your Portfolio is Ready!

Once deployed, your portfolio will be publicly accessible at your Vercel URL! 