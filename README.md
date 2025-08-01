# Portfolio SaaS Platform

A modern, full-stack portfolio management platform built with Next.js, Supabase, and TypeScript. Create, manage, and showcase your professional portfolio with ease.

## ✨ Features

### For Portfolio Owners
- 🎨 **Complete Portfolio Management**: Personal info, projects, tech stack, achievements, social links
- 📁 **File Management**: Upload profile images, project screenshots, and CV files
- 🎯 **Drag & Drop Reordering**: Organize content order with intuitive drag-and-drop
- 📝 **Custom Contact Forms**: Build and customize contact forms with various field types
- 📊 **Contact Management**: View and manage contact form submissions
- 💾 **Data Export/Import**: Backup and restore your portfolio data
- 🔒 **Secure Authentication**: Email-based authentication with Supabase

### For Visitors
- 🌐 **Public Portfolio View**: Beautiful, responsive portfolio display
- 📱 **Mobile Optimized**: Works perfectly on all devices
- 📬 **Contact Forms**: Easy way to reach out to portfolio owners
- ⚡ **Fast Loading**: Optimized performance and caching

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Radix UI, Lucide React Icons
- **State Management**: Zustand
- **Drag & Drop**: @hello-pangea/dnd
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- A Supabase account
- Git (optional)

## 🛠️ Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd portfolio-saas
npm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy:
   - Project URL
   - Anon public key
   - Service role key (from Service Role section)

### 3. Environment Variables

\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### 4. Database Setup

Run these SQL scripts in your Supabase SQL Editor:

1. **Database Schema**: Copy and run `scripts/create-database-schema.sql`
2. **Storage Buckets**: Copy and run `scripts/create-storage-buckets.sql`
3. **Sample Data** (optional): 
   - Replace `YOUR_USER_ID_HERE` in `scripts/populate-sample-data.sql` with your actual user ID
   - Run the script

### 5. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your portfolio platform!

## 📖 Usage

### Getting Started
1. **Sign Up**: Create your account at `/auth/signup`
2. **Verify Email**: Check your email and click the verification link
3. **Sign In**: Access your dashboard at `/auth/login`
4. **Set Up Profile**: Add your personal information, bio, and profile image
5. **Add Content**: Create projects, add technologies, achievements, and social links
6. **Customize**: Set up your contact form and upload your CV
7. **Share**: Your public portfolio is available at the root URL

### Dashboard Features
- **Personal Info**: Manage your profile, contact details, and CV
- **Projects**: Add projects with images, descriptions, and tech stacks
- **Tech Stack**: Showcase your technical skills with icons
- **Achievements**: Add education and professional achievements
- **Social Links**: Connect your social media profiles
- **Contact Form**: Customize contact form fields and settings
- **Data Backup**: Export/import your portfolio data

## 🎨 Customization

### Adding Custom Tech Stack Icons
1. Find SVG icons from sources like [Simple Icons](https://simpleicons.org/)
2. Copy the `path` data from the SVG
3. Paste it into the "SVG Icon Path" field in the Tech Stack section

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.ts`
- Customize components in the `components/` directory

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Secure email-based authentication
- **File Upload Security**: Validated file types and sizes
- **Protected Routes**: Dashboard requires authentication

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Custom Domain
- Configure your custom domain in Vercel settings
- Update CORS settings in Supabase if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Setup Guide](SETUP_GUIDE.md) for detailed instructions
2. Verify all environment variables are set correctly
3. Check Supabase logs for database errors
4. Ensure all SQL scripts ran successfully

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Vercel](https://vercel.com) for seamless deployment
- [Radix UI](https://radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling

---

Built with ❤️ using Next.js and Supabase
