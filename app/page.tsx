"use client"

import { useState, Suspense, useEffect } from "react"
import { Menu } from "lucide-react"
import { usePortfolioStore } from "@/lib/store"
import { CustomButton } from "@/components/ui/custom-button"
import { CVModal } from "@/components/cv-modal"
import { ContactModal } from "@/components/contact-modal"
import { ProfileSection } from "@/components/sections/profile-section"
import { SocialSection } from "@/components/sections/social-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { TechStackSection } from "@/components/sections/tech-stack-section"
import { ContactAchievementsSection } from "@/components/sections/contact-achievements-section"
import { ProfileSkeleton, ProjectCardSkeleton } from "@/components/ui/skeleton"
import { usePageTitle } from "@/lib/hooks/use-page-title"

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        <div className="space-y-8">
          <ProfileSkeleton />
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const { personalInfo, socialLinks, projects, techStack, achievements, fetchAllData, loading } = usePortfolioStore()
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Set dynamic page title based on user's name
  usePageTitle({ 
    title: personalInfo?.name || "Portfolio",
    suffix: personalInfo?.jobTitle || "Developer"
  })

  useEffect(() => {
    // Fetch portfolio data for public view (works for both authenticated and public users)
    fetchAllData().catch(() => {
      // If fetch fails, it means no portfolio data exists yet
    })
  }, [fetchAllData])

  // Show loading state while fetching data
  if (loading) {
    return <LoadingFallback />
  }

  // If no personal info, show a message to set up the portfolio
  if (!personalInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-mono mb-4">Portfolio Not Set Up</h1>
          <p className="text-gray-400 mb-6">
            This portfolio hasn't been configured yet. Sign in to the dashboard to set up your portfolio.
          </p>
          <CustomButton asChild>
            <a href="/auth/login">Go to Dashboard</a>
          </CustomButton>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-black text-white">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 max-w-none">
            {/* Left Sidebar */}
            <aside className="space-y-8" role="complementary" aria-label="Personal information and social links">
              <ProfileSection personalInfo={personalInfo} onViewCV={() => setIsCVModalOpen(true)} />
              <SocialSection socialLinks={socialLinks} />
            </aside>

            {/* Right Content */}
            <main className="space-y-8" role="main">
              {/* Mobile Menu Button */}
              <div className="flex justify-end lg:hidden">
                <CustomButton variant="ghost" size="icon" aria-label="Open mobile menu">
                  <Menu className="w-6 h-6" />
                </CustomButton>
              </div>

              <ProjectsSection projects={projects} techStack={techStack} />
              <TechStackSection techStack={techStack} />
              <ContactAchievementsSection
                achievements={achievements}
                onContactClick={() => setIsContactModalOpen(true)}
              />
            </main>
          </div>
        </div>

        {/* Modals */}
        <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </div>
    </Suspense>
  )
}
