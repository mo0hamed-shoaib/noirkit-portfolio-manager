"use client"

import Image from "next/image"
import type { PersonalInfo } from "@/lib/types"
import { CustomButton } from "@/components/ui/custom-button"

interface ProfileSectionProps {
  personalInfo: PersonalInfo
  onViewCV: () => void
}

export function ProfileSection({ personalInfo, onViewCV }: ProfileSectionProps) {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={personalInfo.profileImage || "/placeholder.svg"}
            alt={`${personalInfo.name} profile picture`}
            width={60}
            height={60}
            className="rounded-full border border-white transition-all duration-300 hover:border-white/60"
            priority
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-black rounded-full"></div>
        </div>
        <div>
          <h1 className="text-2xl font-mono font-bold tracking-tight">{personalInfo.name}</h1>
          <p className="text-gray-400 font-medium">{personalInfo.jobTitle}</p>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-6">
        <p className="text-gray-300 text-lg leading-relaxed font-light">{personalInfo.bio}</p>
        <div className="flex gap-3">
          <CustomButton variant="outline" className="flex-1 sm:flex-none">
            More about Me
          </CustomButton>
          <CustomButton onClick={onViewCV} className="flex-1 sm:flex-none">
            View CV
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
