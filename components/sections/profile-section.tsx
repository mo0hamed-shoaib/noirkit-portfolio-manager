"use client";

import Image from "next/image";
import { useState } from "react";
import { Share2 } from "lucide-react";
import type { PersonalInfo } from "@/lib/types";
import { CustomButton } from "@/components/ui/custom-button";

interface ProfileSectionProps {
  personalInfo: PersonalInfo;
  onViewCV: () => void;
}

export function ProfileSection({
  personalInfo,
  onViewCV,
}: ProfileSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleSharePortfolio = async () => {
    const portfolioUrl = window.location.href;
    const portfolioTitle = "Check out my portfolio";

    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolioTitle,
          url: portfolioUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(portfolioUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 group">
        <div className="relative">
          <Image
            src={personalInfo.profileImage || "/placeholder.svg"}
            alt={`${personalInfo.name} profile picture`}
            width={60}
            height={60}
            className="rounded-full border border-white transition-all duration-300 hover:border-white/60 hover:scale-105 group-hover:shadow-lg group-hover:shadow-white/20"
            priority
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-black rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-mono font-bold tracking-tight transition-all duration-200 group-hover:text-white/90">
            {personalInfo.name}
          </h1>
          <p className="text-gray-400 font-medium transition-all duration-200 group-hover:text-gray-300">
            {personalInfo.jobTitle}
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-4">
        <p className="text-gray-300 text-lg leading-relaxed font-light transition-all duration-200 hover:text-white/90">
          {personalInfo.bio}
        </p>
        <div className="flex gap-3">
          <CustomButton
            variant="outline"
            onClick={handleSharePortfolio}
            className="flex-1 sm:flex-none transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Portfolio
          </CustomButton>
          <CustomButton
            variant="outline"
            onClick={onViewCV}
            className="flex-1 sm:flex-none transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          >
            View CV
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
