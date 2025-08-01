# Dynamic Page Titles Implementation

This document explains how to implement dynamic page titles that reflect the content of each page in your NoirKit portfolio application.

## Overview

The application now supports dynamic page titles that automatically update the browser tab title to reflect the current page content. This improves user experience and SEO.

## Implementation

### 1. Custom Hook: `usePageTitle`

Located at `lib/hooks/use-page-title.ts`, this hook manages dynamic page titles:

```typescript
import { usePageTitle } from "@/lib/hooks/use-page-title"

// Basic usage
usePageTitle({ 
  title: "Projects",
  prefix: "Dashboard"
})

// With suffix
usePageTitle({ 
  title: "John Doe",
  suffix: "Developer"
})
```

### 2. Title Utility Functions

Located at `lib/utils/title.ts`, these utilities help generate consistent titles:

```typescript
import { generatePageTitle, getDashboardTitle, getPortfolioTitle } from "@/lib/utils/title"

// Generate a title with prefix and suffix
const title = generatePageTitle("Projects", { prefix: "Dashboard" })
// Result: "Dashboard - Projects"

// Get dashboard page title
const dashboardTitle = getDashboardTitle("Tech Stack")
// Result: "Dashboard - Tech Stack"

// Get portfolio title based on user info
const portfolioTitle = getPortfolioTitle("John Doe", "Full Stack Developer")
// Result: "John Doe - Full Stack Developer"
```

## Usage Examples

### Dashboard Pages

For dashboard pages, use the prefix "Dashboard":

```typescript
// In app/dashboard/projects/page.tsx
usePageTitle({ 
  title: "Projects",
  prefix: "Dashboard"
})
// Browser tab: "Dashboard - Projects"
```

### Portfolio Page

For the main portfolio page, use the user's name and job title:

```typescript
// In app/page.tsx
usePageTitle({ 
  title: personalInfo?.name || "Portfolio",
  suffix: personalInfo?.jobTitle || "Developer"
})
// Browser tab: "John Doe - Full Stack Developer"
```

### Auth Pages

For authentication pages, use the "NoirKit" prefix:

```typescript
// In app/auth/login/page.tsx
usePageTitle({ 
  title: "Sign In",
  prefix: "NoirKit"
})
// Browser tab: "NoirKit - Sign In"
```

## Root Layout Configuration

The root layout (`app/layout.tsx`) provides default metadata with a template:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Portfolio Dashboard",
    template: "%s - Portfolio Dashboard"
  },
  description: "Manage your portfolio content",
  generator: 'v0.dev'
}
```

This template allows individual pages to set their own titles while maintaining consistency.

## Best Practices

1. **Be Descriptive**: Use clear, descriptive titles that reflect the page content
2. **Keep it Short**: Titles should be concise (under 60 characters)
3. **Be Consistent**: Use consistent prefixes for related pages
4. **Include Brand**: Include your brand name for important pages
5. **Dynamic Content**: Use dynamic content when available (user names, job titles)

## Examples by Page Type

### Dashboard Pages
- Personal Information: "Dashboard - Personal Information"
- Projects: "Dashboard - Projects"
- Tech Stack: "Dashboard - Tech Stack"
- Achievements: "Dashboard - Achievements"
- Social Links: "Dashboard - Social Links"
- Contact: "Dashboard - Contact"
- CV: "Dashboard - CV"
- Backup: "Dashboard - Backup"

### Public Pages
- Portfolio: "John Doe - Full Stack Developer" (or "Portfolio" if no user info)
- Login: "NoirKit - Sign In"
- Signup: "NoirKit - Sign Up"

## Implementation Status

The following pages have been updated with dynamic titles:

✅ Main Portfolio Page (`app/page.tsx`)
✅ Dashboard Home (`app/dashboard/page.tsx`)
✅ Projects Page (`app/dashboard/projects/page.tsx`)
✅ Tech Stack Page (`app/dashboard/tech-stack/page.tsx`)
✅ Achievements Page (`app/dashboard/achievements/page.tsx`)
✅ Login Page (`app/auth/login/page.tsx`)

## Adding to New Pages

To add dynamic titles to a new page:

1. Import the hook:
```typescript
import { usePageTitle } from "@/lib/hooks/use-page-title"
```

2. Add the hook call in your component:
```typescript
export default function YourPage() {
  // Your existing code...
  
  usePageTitle({ 
    title: "Your Page Title",
    prefix: "Dashboard" // or appropriate prefix
  })
  
  // Rest of your component...
}
```

This implementation provides a clean, consistent way to manage page titles across your entire application. 