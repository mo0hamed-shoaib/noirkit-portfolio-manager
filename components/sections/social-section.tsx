"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import type { SocialLink } from "@/lib/types";
import { CustomButton } from "@/components/ui/custom-button";
import { trackSocialLinkClick } from "@/lib/analytics";

interface SocialSectionProps {
  socialLinks: SocialLink[];
}

export function SocialSection({ socialLinks }: SocialSectionProps) {
  const getIconComponent = (platform: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      github: Github,
      linkedin: Linkedin,
      twitter: XIcon,
      "twitter/x": XIcon,
      x: XIcon,
      instagram: Instagram,
      facebook: Facebook,
      youtube: Youtube,
      // Add more mappings as needed
    };

    return iconMap[platform.toLowerCase()] || Globe; // Globe as fallback
  };

  const handleSocialLinkClick = (platform: string, url: string) => {
    trackSocialLinkClick(platform, url);
  };

  if (socialLinks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No social links available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-mono font-semibold mb-4">Connect</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {socialLinks.map((link) => (
            <CustomButton
              key={link.id}
              variant="outline"
              size="sm"
              asChild
              className="h-12 w-12 p-0 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-white/20"
            >
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${link.platform} profile`}
                className="flex items-center justify-center w-full h-full"
                onClick={() => handleSocialLinkClick(link.platform, link.url)}
              >
                {(() => {
                  const IconComponent = getIconComponent(link.platform);
                  return <IconComponent className="w-6 h-6" />;
                })()}
              </Link>
            </CustomButton>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-white/10">
        <div className="text-gray-400 text-sm space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/logo-icon.png"
              alt="NoirKit logo"
              width="28"
              height="28"
              className="rounded"
            />
            <span className="font-semibold tracking-wide text-white">
              NoirKit
            </span>
          </div>
          <p className="text-xs">
            © by Mohamed Gamal {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
