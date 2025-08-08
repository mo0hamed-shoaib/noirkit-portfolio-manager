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
import { ServicesFactsSection } from "@/components/sections/services-facts-section";
import { Footer } from "@/components/footer";
import {
  ProfileSkeleton,
  ProjectCardSkeleton,
  TechStackSkeleton,
  SocialLinksSkeleton,
  AchievementsSkeleton,
} from "@/components/ui/skeleton";
import { ProgressBarLoader } from "@/components/ui/enhanced-loading";
import { EnhancedProgressLoader, ContentRevealWrapper } from "@/components/ui/enhanced-loading-with-reveal";
import { PortfolioSetupGuide } from "@/components/ui/portfolio-setup-guide";
import { usePageTitle } from "@/lib/hooks/use-page-title";
import { trackPageView } from "@/lib/analytics";

function LoadingFallback() {
  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      role="main"
      aria-label="Loading portfolio content"
    >
      <div className="flex-1 p-6 lg:p-8">
        {/* Hybrid Layout Skeleton - Matches current structure */}
        <div className="space-y-8">
          {/* Top Section: Skeleton for Hybrid Layout */}
          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
            {/* Left Sidebar Skeletons */}
            <aside className="2xl:col-span-4 space-y-6">
              <ProfileSkeleton />
              <SocialLinksSkeleton />
            </aside>

            {/* Right Content Skeletons */}
            <main className="2xl:col-span-8 space-y-6">
              <TechStackSkeleton />
              <AchievementsSkeleton />
            </main>
          </div>

          {/* Full-Width Projects Section Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-32 bg-gray-900/30 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-900/30 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4 min-h-[200px]">
              {[...Array(3)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Services & Fun Facts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-white/20 rounded-xl p-6 bg-black/20">
              <div className="h-6 w-40 bg-gray-900/30 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-900/30 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="border border-white/20 rounded-xl p-6 bg-black/20">
              <div className="h-6 w-32 bg-gray-900/30 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-900/30 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
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
  const [showContent, setShowContent] = useState(false);

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

  // Show enhanced loading state while fetching data
  if (loading && !showContent) {
    return (
      <EnhancedProgressLoader 
        onComplete={() => setShowContent(true)}
        variant="particles" // or "waves", "grid", "constellation"
      />
    );
  }

  // If no personal info, show the enhanced setup guide
  if (!personalInfo) {
    return <PortfolioSetupGuide />;
  }

  return (
    <ContentRevealWrapper isVisible={showContent || !loading}>
      <Suspense fallback={<LoadingFallback />}>
        <div
          className="min-h-screen bg-background text-foreground flex flex-col"
          role="main"
          aria-label={`${personalInfo.name}'s portfolio`}
        >
        <div className="flex-1 p-6 lg:p-8">
          {/* Hybrid Layout - Consistent Sidebar + Full-Width Content */}
          <div className="space-y-8">
            {/* Top Section: Consistent Height Cards */}
            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
              {/* Left Sidebar - Profile &Actions (Fixed Height) */}
              <aside className="2xl:col-span-4 space-y-6">
                <div className="animate-fadeInUp">
                  <ProfileSection personalInfo={personalInfo} />
                </div>
                <div className="animate-fadeInUp animate-delay-100">
                  <SocialSection 
                    socialLinks={socialLinks} 
                    onViewCV={() => setIsCVModalOpen(true)}
                    onContactClick={() => setIsContactModalOpen(true)}
                  />
                </div>
              </aside>

              {/* Right Content - Variable Height Cards */}
              <main className="2xl:col-span-8 space-y-6">
                <div className="animate-slideInRight">
                  <TechStackSection techStack={techStack} />
                </div>
                <div className="animate-slideInRight animate-delay-100">
                  <ContactAchievementsSection
                    achievements={achievements}
                    onContactClick={() => setIsContactModalOpen(true)}
                  />
                </div>
              </main>
            </div>

            {/* Full-Width Projects Section */}
            <div className="animate-fadeInUp animate-delay-200">
              <ProjectsSection projects={projects} techStack={techStack} />
            </div>

            {/* Bottom Section: Services & Fun Facts - Full Width */}
            <div className="animate-fadeInUp animate-delay-300">
              <ServicesFactsSection />
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />

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
    </ContentRevealWrapper>
  );
} 