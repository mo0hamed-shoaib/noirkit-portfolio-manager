"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Share2,
  Mail,
  FileText,
} from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import type { SocialLink } from "@/lib/types";
import { CustomButton } from "@/components/ui/custom-button";
import { Button } from "@/components/ui/button";
import { trackSocialLinkClick } from "@/lib/analytics";
import { ServicesFactsSection } from "./services-facts-section";

interface SocialSectionProps {
  socialLinks: SocialLink[];
  onViewCV: () => void;
  onContactClick: () => void;
}

export function SocialSection({ socialLinks, onViewCV, onContactClick }: SocialSectionProps) {
  const [copied, setCopied] = useState(false);

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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-mono font-semibold mb-4">Quick Actions & Socials</h3>
        
        {/* All Buttons in One Line */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Action Buttons */}
          <CustomButton
            variant="outline"
            size="default"
            onClick={handleSharePortfolio}
            className="h-11 px-4 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            title={copied ? "Copied!" : "Share Portfolio"}
          >
            <Share2 className="w-4 h-4 mr-1" />
            {copied ? "Copied!" : "Share"}
          </CustomButton>
          <CustomButton
            variant="outline"
            size="default"
            onClick={onViewCV}
            className="h-11 px-4 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            title="View CV"
          >
            <FileText className="w-4 h-4 mr-1" />
            View CV
          </CustomButton>
          <CustomButton
            variant="outline"
            size="default"
            onClick={onContactClick}
            className="h-11 px-4 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            title="Mail Me"
          >
            <Mail className="w-4 h-4 mr-1" />
            Mail Me
          </CustomButton>

          {/* Social Links */}
          {socialLinks.map((link) => {
            const IconComponent = getIconComponent(link.platform);
            return (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${link.platform} profile`}
                className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-border bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                onClick={() => handleSocialLinkClick(link.platform, link.url)}
              >
                <IconComponent className="w-4 h-4" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Subtle divider */}
      <div className="border-t border-border" aria-hidden="true"></div>

      {/* Services & Fun Facts */}
      <ServicesFactsSection />
    </div>
  );
}
