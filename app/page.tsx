"use client";

import { useState, Suspense, useEffect } from "react";
import { Menu } from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import { CustomButton } from "@/components/ui/custom-button";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { CVModal } from "@/components/cv-modal";
import { ContactModal } from "@/components/contact-modal";
import { ProfileSection } from "@/components/sections/profile-section";
import { SocialSection } from "@/components/sections/social-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { ContactAchievementsSection } from "@/components/sections/contact-achievements-section";
import {
  ProfileSkeleton,
  ProjectCardSkeleton,
  TechStackSkeleton,
  SocialLinksSkeleton,
  AchievementsSkeleton,
} from "@/components/ui/skeleton";
import { usePageTitle } from "@/lib/hooks/use-page-title";
import { trackPageView } from "@/lib/analytics";

function LoadingFallback() {
  return (
    <div
      className="min-h-screen bg-background text-foreground p-6"
      role="main"
      aria-label="Loading portfolio content"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        {/* Left Sidebar Skeletons */}
        <aside
          className="space-y-8"
          role="complementary"
          aria-label="Loading personal information"
        >
          <ProfileSkeleton />
          <SocialLinksSkeleton />
        </aside>

        {/* Right Content Skeletons */}
        <main className="space-y-8" role="main">
          {/* Mobile Menu Button Skeleton */}
          <div className="flex justify-end lg:hidden">
            <div className="w-10 h-10 bg-gray-900/30 rounded-full animate-pulse" />
          </div>

          {/* Projects Section Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-32 bg-gray-900/30 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-900/30 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Tech Stack Section Skeleton */}
          <TechStackSkeleton />

          {/* Achievements Section Skeleton */}
          <AchievementsSkeleton />
        </main>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const {
    personalInfo,
    socialLinks,
    projects,
    techStack,
    achievements,
    fetchAllData,
    loading,
  } = usePortfolioStore();
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Set dynamic page title based on user's name
  usePageTitle({
    title: personalInfo?.name || "Portfolio",
    suffix: personalInfo?.jobTitle || "Developer",
  });

  useEffect(() => {
    // Track page view
    trackPageView("/portfolio");

    // Fetch portfolio data for public view (works for both authenticated and public users)
    fetchAllData().catch(() => {
      // If fetch fails, it means no portfolio data exists yet
    });
  }, [fetchAllData]);

  // Show loading state while fetching data
  if (loading) {
    return <LoadingFallback />;
  }

  // If no personal info, show a message to set up the portfolio
  if (!personalInfo) {
    return (
      <div
        className="min-h-screen bg-background text-foreground flex items-center justify-center p-6"
        role="main"
      >
        <div className="text-center max-w-md space-y-6">
          <h1 className="text-3xl font-mono mb-4">Portfolio Not Set Up</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            This portfolio hasn't been configured yet. Sign in to the dashboard
            to set up your portfolio.
          </p>
          <CustomButton
            variant="outline"
            asChild
            className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          >
            <a href="/auth/login" aria-label="Navigate to dashboard login page">
              Go to Dashboard
            </a>
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div
        className="min-h-screen bg-background text-foreground"
        role="main"
        aria-label={`${personalInfo.name}'s portfolio`}
      >
        <div className="p-6 lg:p-8">
          {/* Header - Theme toggle moved to projects section */}
          <div className="mb-6">{/* Empty div to maintain spacing */}</div>

          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-12 max-w-none">
            {/* Left Sidebar */}
            <aside
              className="space-y-10"
              role="complementary"
              aria-label="Personal information and social links"
            >
              <ProfileSection
                personalInfo={personalInfo}
                onViewCV={() => setIsCVModalOpen(true)}
              />

              {/* Subtle divider */}
              <div className="border-t border-border" aria-hidden="true"></div>

              <SocialSection socialLinks={socialLinks} />
            </aside>

            {/* Right Content */}
            <main
              className="space-y-10"
              role="main"
              aria-label="Portfolio content"
            >


              <ProjectsSection projects={projects} techStack={techStack} />

              {/* Subtle divider */}
              <div className="border-t border-border" aria-hidden="true"></div>

              <TechStackSection techStack={techStack} />

              {/* Subtle divider */}
              <div className="border-t border-border" aria-hidden="true"></div>

              <ContactAchievementsSection
                achievements={achievements}
                onContactClick={() => setIsContactModalOpen(true)}
              />
            </main>
          </div>
        </div>

        {/* Modals */}
        <CVModal
          isOpen={isCVModalOpen}
          onClose={() => setIsCVModalOpen(false)}
        />
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </div>
    </Suspense>
  );
}
