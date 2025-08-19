<div align="center">
  <img src="public/logo-icon.png" alt="NoirKit Logo" width="120" height="120">
  
  # NoirKit
  
  ### 🌟 Professional Portfolio Management Platform
  
  *Transform your professional presence with cinematic loading experiences and interactive setup*

  **NoirKit** is a modern portfolio platform that makes creating stunning developer portfolios effortless and engaging. Built with Next.js 14 and Supabase, it features **animated canvas backgrounds**, **interactive setup guides** with realistic time estimates, and **staggered content reveals** that create movie-like transitions. 

  Manage your complete professional presence through an intuitive dashboard - from projects and tech stacks to achievements and custom contact forms - while visitors enjoy a **lightning-fast, mobile-optimized** experience with **smooth animations** throughout.

  <br>
  
  <a href="https://mohamedgamal-noir.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20Portfolio-00C853?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
  
  <br><br>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  ---
  
  <p align="center">
    <strong>Features</strong> • <strong>Tech Stack</strong> • <strong>Quick Start</strong> • <strong>Dashboard</strong> • <strong>Deployment</strong>
  </p>
</div>

## ✨ Features {#features}

### 👨‍💼 For Portfolio Owners
- 🎨 **Complete Portfolio Management** - Personal info, projects, tech stack, achievements, social links
- 📁 **Smart CV Management** - Direct link integration for seamless CV sharing and access
- 🎯 **Drag & Drop Reordering** - Organize content order with intuitive drag-and-drop functionality
- 📝 **Custom Contact Forms** - Build and customize contact forms with various field types
- 📊 **Contact Management** - View and manage contact form submissions in one place
- 💾 **Data Backup & Restore** - Export and import your complete portfolio data
- 🔒 **Secure Authentication** - Email-based authentication with Supabase
- 📱 **Mobile Dashboard** - Fully responsive management interface with optimized touch interactions
- 🎨 **Modern UI** - Clean, professional design with dark mode support
- ⚡ **Enhanced Loading Experience** - Animated canvas backgrounds with smooth progress indication
- 🌟 **Interactive Setup Guide** - Step-by-step onboarding with time estimates and feature previews
- 🎛️ **Optimized Dashboard Layout** - Compact, organized interface with improved navigation

### 🌐 For Visitors
- 🎭 **Beautiful Portfolio Display** - Responsive, professional portfolio presentation
- 📱 **Mobile Optimized** - Perfect experience across all devices with touch-friendly interactions
- 📬 **Easy Contact** - Streamlined contact forms to reach portfolio owners
- ⚡ **Lightning Fast** - Optimized performance with Next.js 14 and caching
- 🔍 **SEO Optimized** - Built-in meta tags, Open Graph, and structured data
- 🎬 **Cinematic Loading** - Engaging animated backgrounds with staggered content reveals
- 🎯 **Smooth Transitions** - Professional animations and micro-interactions throughout
- 📄 **Direct CV Access** - One-click CV viewing with external link integration

## 🚀 Tech Stack {#tech-stack}

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
| **Animations** | Custom CSS Animations + Canvas API |
| **Loading UX** | Progressive Enhancement + Staggered Reveals |
| **Development** | TypeScript, ESLint, PostCSS |
| **Deployment** | Vercel (Recommended), Netlify, Railway |

</div>

## 📋 Prerequisites

- **Node.js** 18 or higher
- **pnpm** (recommended) or npm
- **Supabase account** (free tier available)
- **Git** (optional but recommended)

## 🚀 Quick Start {#quick-start}

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

Create a `.env.local` file in the root directory:
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

# Optional: For public portfolio deployment, specify which user's portfolio to show
# NEXT_PUBLIC_DEFAULT_USER_ID=your-user-id-here
# NEXT_PUBLIC_DEFAULT_USER_EMAIL=your-email@example.com
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

## 🎬 Enhanced Loading Experience

NoirKit features a **cinematic loading experience** that transforms waiting time into an engaging preview of your portfolio:

### 🎨 **Animated Canvas Backgrounds**
Choose from multiple stunning background animations:
- **Particles** ✨ - Floating particles with dynamic connections
- **Waves** 🌊 - Flowing wave animations with depth
- **Grid** 📐 - Animated grid with pulsing intersections
- **Constellation** ⭐ - Twinkling stars with constellation lines

### ⚡ **Smart Progress Indication**
- **Step-by-step progress** with realistic loading phases
- **Dynamic icons** that change based on current data being loaded
- **Smooth animations** with shimmer and glow effects
- **Completion celebration** with success states

### 🎭 **Staggered Content Reveal**
After loading completes, content reveals with professional animations:
- **Sidebar**: Slides in from left with staggered timing
- **Main content**: Slides in from right with delays
- **Projects**: Rise up from bottom with smooth transitions
- **Footer**: Fades in as the final touch

### 🔧 **Easy Customization**
Switch canvas animations by changing one line:
```tsx
<EnhancedProgressLoader variant="particles" /> // or "waves", "grid", "constellation"
```

### 🎮 **Try the Demo**
Experience all loading animations at `/loading-demo`:
- **Interactive previews** of all 5 loading styles
- **Live comparisons** with pros/cons for each
- **Implementation examples** and best practices
- **Performance insights** and recommendations

## 📊 Dashboard {#dashboard}

### 🎛️ Management Features

| Section | Description | Features |
|---------|-------------|----------|
| **👤 Personal Info** | Profile management | Bio, contact details, profile image, statistics |
| **📁 Projects** | Portfolio showcase | Project details, images, tech stack, live/repo links |
| **⚡ Tech Stack** | Skills display | Technologies with custom SVG icons |
| **🏆 Achievements** | Credentials | Education, certifications, professional milestones |
| **🔗 Social Links** | Professional networking | LinkedIn, GitHub, Twitter, custom links |
| **📧 Contact Form** | Lead management | Custom form builder, submission tracking |
| **📄 CV Management** | Resume sharing | Direct link integration for seamless CV access |
| **🗂️ Data Backup** | Portfolio backup | Export/import complete portfolio data |

### 🎨 **Recent Dashboard Improvements**
- **Compact Layout**: Optimized spacing and sizing for better information density
- **Enhanced Navigation**: Larger, more accessible sidebar buttons with improved touch targets
- **Mobile Optimization**: Touch-friendly interactions and responsive design improvements
- **Streamlined CV Management**: Direct link approach for reliable CV sharing
- **Visual Organization**: Better section separation and content hierarchy

## 📖 Usage Guide

### 🌟 **Interactive Setup Experience**
NoirKit features a **comprehensive setup guide** that makes portfolio creation intuitive and enjoyable:

- **Visual step-by-step breakdown** of the entire setup process
- **Time estimates** for each section (~5 minutes total)
- **Feature previews** showing exactly what you'll be creating
- **Interactive animations** that engage and guide users
- **Clear value proposition** with immediate benefits

### Getting Started
1. **Sign Up** → Create your account at `/auth/signup`
2. **Verify Email** → Check email and confirm your account
3. **Dashboard Access** → Sign in at `/auth/login`
4. **Follow Setup Guide** → Interactive guide walks you through each step
5. **Profile Setup** → Add personal info, bio, and profile image (~2 min)
6. **Content Creation** → Add projects (~10 min), tech stack (~3 min), achievements (~5 min)
7. **Social Integration** → Connect social links (~2 min)
8. **Contact Setup** → Configure contact forms (~3 min)
9. **CV Setup** → Add direct CV link for easy sharing (~1 min)
10. **Go Live** → Share your public portfolio URL

### ⏱️ **Setup Time Breakdown**
- **Personal Info**: 3 minutes
- **Projects**: 5 minutes  
- **Tech Stack**: 5 minutes
- **Milestones**: 3 minutes
- **Social Links**: 2 minutes
- **Contact Form**: 2 minutes
- **CV Link**: 1 minute
- **Total**: ~21 minutes

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
- Optimized project card interactions

## 🔒 Security & Privacy

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Authentication** - Secure email-based auth with Supabase
- ✅ **File Security** - Validated uploads with size/type restrictions
- ✅ **Protected Routes** - Dashboard requires authentication
- ✅ **CSRF Protection** - Built-in Next.js security
- ✅ **Input Sanitization** - All user inputs validated and sanitized

## 🚀 Deployment {#deployment}

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

**CV Link Issues**
- Ensure the CV link is publicly accessible
- Test the link in an incognito browser
- Verify the link format is correct

</details>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Need help? Here's how to get support:

1. 📚 Check the [documentation](docs/)
2. 🐛 [Open an issue](https://github.com/your-username/noirkit/issues) for bugs
3. 💡 [Start a discussion](https://github.com/your-username/noirkit/discussions) for questions
4. 📧 Email: support@noirkit.dev

## 🌟 **What Makes NoirKit Special**

### 🎬 **Cinema-Quality UX**
- **Animated canvas backgrounds** that rival modern web apps
- **Staggered content reveals** that feel like movie transitions
- **Micro-interactions** throughout the entire experience
- **Professional loading states** that build anticipation

### 🚀 **Developer Experience**
- **TypeScript everywhere** for type safety and better DX
- **Modular architecture** with reusable components
- **Easy customization** with well-documented APIs
- **Performance optimized** with Next.js 14 and modern practices

### 🎯 **User-Centric Design**
- **Interactive setup guide** that eliminates confusion
- **Realistic time estimates** for every step
- **Feature previews** so users know what they're building
- **Mobile-first responsive** design that works everywhere
- **Streamlined CV management** with direct link integration

### 📱 **Mobile Excellence**
- **Touch-optimized interactions** throughout the dashboard
- **Responsive project cards** with swipe gestures
- **Compact, organized layouts** for better mobile productivity
- **Enhanced navigation** with larger touch targets

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
  
  *Experience the future of portfolio creation*
  
  [⭐ Star this repo](https://github.com/your-username/noirkit) • [🐛 Report bug](https://github.com/your-username/noirkit/issues) • [💡 Request feature](https://github.com/your-username/noirkit/discussions)
  
</div>