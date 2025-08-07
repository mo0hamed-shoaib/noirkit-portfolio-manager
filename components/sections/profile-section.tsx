"use client";

import Image from "next/image";
import type { PersonalInfo } from "@/lib/types";

interface ProfileSectionProps {
  personalInfo: PersonalInfo;
}

export function ProfileSection({
  personalInfo,
}: ProfileSectionProps) {
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
      </div>

      {/* Divider */}
      <div className="border-t border-border" aria-hidden="true"></div>
    </div>
  );
}
