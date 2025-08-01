import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: {
    default: "NoirKit Portfolio - Professional Developer Portfolio",
    template: "%s | NoirKit Portfolio",
  },
  description:
    "Professional developer portfolio showcasing projects, skills, and achievements. Built with modern web technologies and a sleek noir aesthetic.",
  keywords: [
    "developer",
    "portfolio",
    "web development",
    "software engineer",
    "projects",
    "skills",
    "noir",
    "modern",
  ],
  authors: [{ name: "Mohamed Gamal" }],
  creator: "Mohamed Gamal",
  publisher: "NoirKit",
  generator: "Next.js",
  applicationName: "NoirKit Portfolio",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "NoirKit Portfolio",
    title: "NoirKit Portfolio - Professional Developer Portfolio",
    description:
      "Professional developer portfolio showcasing projects, skills, and achievements. Built with modern web technologies and a sleek noir aesthetic.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NoirKit Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoirKit Portfolio - Professional Developer Portfolio",
    description:
      "Professional developer portfolio showcasing projects, skills, and achievements.",
    images: ["/og-image.png"],
    creator: "@your-twitter-handle",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data for Portfolio */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Portfolio Owner",
              jobTitle: "Software Developer",
              description:
                "Professional developer portfolio showcasing projects and skills",
              url: "https://your-domain.com",
              sameAs: [
                "https://github.com/your-username",
                "https://linkedin.com/in/your-username",
              ],
              knowsAbout: [
                "Web Development",
                "Software Engineering",
                "Frontend Development",
                "Backend Development",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Freelance",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
