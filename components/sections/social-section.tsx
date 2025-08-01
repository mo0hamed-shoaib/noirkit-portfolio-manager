"use client"

import Link from "next/link"
import type { SocialLink } from "@/lib/types"
import { CustomButton } from "@/components/ui/custom-button"

interface SocialSectionProps {
  socialLinks: SocialLink[]
}

export function SocialSection({ socialLinks }: SocialSectionProps) {
  const renderIcon = (iconPath: string, className = "w-5 h-5") => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.3))" }}
      aria-hidden="true"
    >
      <path d={iconPath} />
    </svg>
  )

  if (socialLinks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No social links available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        {socialLinks.map((link) => (
          <CustomButton
            key={link.id}
            variant="ghost"
            size="icon"
            asChild
            className="hover:scale-110 transition-transform duration-200"
          >
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${link.platform} profile`}
            >
              {renderIcon(link.icon)}
            </Link>
          </CustomButton>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        <div className="text-gray-400 text-sm space-y-2">
        <div className="flex items-center gap-2">
        <img src="/icon.png" alt="NoirKit logo" width="28" height="28" className="rounded" />
        <span className="font-semibold tracking-wide text-white">NoirKit</span>
      </div>
      <p className="ml-auto whitespace-nowrap">© by Mohamed Gamal {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
