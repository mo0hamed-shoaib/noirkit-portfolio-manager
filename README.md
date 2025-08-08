<div align="center">
  <img src="public/logo-icon.png" alt="NoirKit Logo" width="120" height="120">
  
  # NoirKit
  
  ### 🌟 Professional Portfolio Management Platform
  
  *Build, manage, and showcase your professional portfolio with elegance and simplicity*
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  ---
  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#dashboard">Dashboard</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

## ✨ Features

### 👨‍💼 For Portfolio Owners
- 🎨 **Complete Portfolio Management** - Personal info, projects, tech stack, achievements, social links
- 📁 **Smart File Management** - Upload profile images, project screenshots, and CV files with organized storage
- 🎯 **Drag & Drop Reordering** - Organize content order with intuitive drag-and-drop functionality
- 📝 **Custom Contact Forms** - Build and customize contact forms with various field types
- 📊 **Contact Management** - View and manage contact form submissions in one place
- 💾 **Data Backup & Restore** - Export and import your complete portfolio data
- 🔒 **Secure Authentication** - Email-based authentication with Supabase
- 📱 **Mobile Dashboard** - Fully responsive management interface
- 🎨 **Modern UI** - Clean, professional design with dark mode support

### 🌐 For Visitors
- 🎭 **Beautiful Portfolio Display** - Responsive, professional portfolio presentation
- 📱 **Mobile Optimized** - Perfect experience across all devices
- 📬 **Easy Contact** - Streamlined contact forms to reach portfolio owners
- ⚡ **Lightning Fast** - Optimized performance with Next.js 14 and caching
- 🔍 **SEO Optimized** - Built-in meta tags, Open Graph, and structured data

## 🚀 Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript 5.0, Tailwind CSS 3.4 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **UI/UX** | Radix UI, Lucide React Icons, Custom Components |
| **State Management** | Zustand with Immer |
| **Drag & Drop** | @hello-pangea/dnd |
| **Forms** | React Hook Form + Zod Validation |
| **Styling** | Tailwind CSS + CSS Variables |
| **Development** | TypeScript, ESLint, PostCSS |
| **Deployment** | Vercel (Recommended), Netlify, Railway |

</div>

## 📋 Prerequisites

- **Node.js** 18 or higher
- **pnpm** (recommended) or npm
- **Supabase account** (free tier available)
- **Git** (optional but recommended)

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/noirkit.git
cd noirkit
pnpm install
```

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project credentials from Settings > API

### 3. Environment Configuration
```bash
# Create environment file
cp .env.example .env.local
```

```env
# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup
Run these SQL scripts in your Supabase SQL Editor **in order**:

1. **Schema**: `scripts/create-database-schema.sql`
2. **Storage**: `scripts/create-storage-buckets.sql`

### 5. Launch Application
```bash
pnpm dev
```

🎉 **Your portfolio is now live at** `http://localhost:3000`

## 📊 Dashboard

### 🎛️ Management Features

| Section | Description | Features |
|---------|-------------|----------|
| **👤 Personal Info** | Profile management | Bio, contact details, profile image, CV upload |
| **📁 Projects** | Portfolio showcase | Project details, images, tech stack, live/repo links |
| **⚡ Tech Stack** | Skills display | Technologies with custom SVG icons |
| **🏆 Achievements** | Credentials | Education, certifications, professional milestones |
| **🔗 Social Links** | Professional networking | LinkedIn, GitHub, Twitter, custom links |
| **📧 Contact Form** | Lead management | Custom form builder, submission tracking |
| **💾 Storage** | File management | Upload tracking, file organization, storage analytics |
| **🗂️ Data Backup** | Portfolio backup | Export/import complete portfolio data |

## 📖 Usage Guide

### Getting Started
1. **Sign Up** → Create your account at `/auth/signup`
2. **Verify Email** → Check email and confirm your account
3. **Dashboard Access** → Sign in at `/auth/login`
4. **Profile Setup** → Add personal info, bio, and profile image
5. **Content Creation** → Add projects, tech stack, achievements
6. **Customization** → Configure contact forms and upload CV
7. **Go Live** → Share your public portfolio URL

### 🎨 Customization

#### 🎨 Theming
- **Dark Mode**: Built-in dark theme support
- **Custom Colors**: Modify `tailwind.config.ts` for brand colors
- **Typography**: Geist font with custom typography scale

#### 🔧 Tech Stack Icons
1. Browse [Simple Icons](https://simpleicons.org/) for SVG icons
2. Copy the SVG path data
3. Paste into the Tech Stack section
4. Automatic color and sizing applied

#### 📱 Responsive Design
- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions

## 🔒 Security & Privacy

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Authentication** - Secure email-based auth with Supabase
- ✅ **File Security** - Validated uploads with size/type restrictions
- ✅ **Protected Routes** - Dashboard requires authentication
- ✅ **CSRF Protection** - Built-in Next.js security
- ✅ **Input Sanitization** - All user inputs validated and sanitized

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/noirkit)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Environment Variables**
   Add these in your Vercel dashboard:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy** 🚀

### Alternative Deployment Options

<details>
<summary><strong>📦 Deploy to Netlify</strong></summary>

1. Build the project: `pnpm build`
2. Connect repository to Netlify
3. Configure environment variables
4. Deploy from `out/` directory

</details>

<details>
<summary><strong>🚄 Deploy to Railway</strong></summary>

1. Connect GitHub repository to Railway
2. Add environment variables
3. Railway auto-deploys on push

</details>

## 📁 Project Structure

```
noirkit/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Protected dashboard routes
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── sections/         # Portfolio sections
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
│   ├── auth-context.tsx  # Authentication context
│   ├── store.ts          # Zustand state management
│   └── supabase.ts       # Supabase client
├── public/               # Static assets
├── scripts/              # Database setup scripts
└── styles/               # Global styles
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure mobile responsiveness
- Add proper error handling
- Include meaningful commit messages

## 📚 Documentation

- 📖 [Fresh Setup Guide](docs/FRESH_SETUP_GUIDE.md) - Complete setup instructions
- 🚀 [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Deployment options and configurations

## 🐛 Troubleshooting

<details>
<summary><strong>🔧 Common Issues</strong></summary>

**Authentication Issues**
- Verify environment variables are correct
- Check Supabase project settings
- Ensure redirect URLs are configured

**File Upload Problems**
- Check file size limits (5MB profile, 10MB projects)
- Verify file types are supported
- Use Storage dashboard to debug

**Database Errors**
- Ensure all SQL scripts ran successfully
- Check Supabase logs for details
- Verify RLS policies are active

</details>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Need help? Here's how to get support:

1. 📚 Check the [documentation](docs/)
2. 🐛 [Open an issue](https://github.com/your-username/noirkit/issues) for bugs
3. 💡 [Start a discussion](https://github.com/your-username/noirkit/discussions) for questions
4. 📧 Email: support@noirkit.dev

## 🙏 Acknowledgments

Special thanks to these amazing projects and communities:

- [Supabase](https://supabase.com) - Backend platform and database
- [Vercel](https://vercel.com) - Deployment and hosting
- [Next.js](https://nextjs.org) - React framework
- [Radix UI](https://radix-ui.com) - Accessible UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Lucide](https://lucide.dev) - Beautiful icon library

---

<div align="center">
  
  **Built with ❤️ by developers, for developers**
  
  [⭐ Star this repo](https://github.com/your-username/noirkit) • [🐛 Report bug](https://github.com/your-username/noirkit/issues) • [💡 Request feature](https://github.com/your-username/noirkit/discussions)
  
</div>