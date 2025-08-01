"use client";

import Link from "next/link";
import { Share2, Copy, Check } from "lucide-react";
import type { SocialLink } from "@/lib/types";
import { CustomButton } from "@/components/ui/custom-button";
import { trackSocialLinkClick } from "@/lib/analytics";
import { useState } from "react";

interface SocialSectionProps {
  socialLinks: SocialLink[];
}

export function SocialSection({ socialLinks }: SocialSectionProps) {
  const [copied, setCopied] = useState(false);

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
  );

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

  const handleCopyLink = async () => {
    const portfolioUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log("Error copying to clipboard:", error);
    }
  };

  if (socialLinks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No social links available</p>
        </div>

        {/* Share Portfolio Section */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-mono font-semibold mb-4">
            Share Portfolio
          </h3>
          <div className="flex gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleSharePortfolio}
              className="flex-1 hover:scale-105 transition-all duration-200"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </CustomButton>
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex-1 hover:scale-105 transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-mono font-semibold mb-4">Connect</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {socialLinks.map((link) => (
            <CustomButton
              key={link.id}
              variant="outline"
              size="sm"
              asChild
              className="h-12 px-4 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-white/20"
            >
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${link.platform} profile`}
                className="flex items-center gap-3 w-full"
                onClick={() => handleSocialLinkClick(link.platform, link.url)}
              >
                {renderIcon(link.icon, "w-5 h-5 flex-shrink-0")}
                <span className="text-sm font-medium truncate">
                  {link.platform}
                </span>
              </Link>
            </CustomButton>
          ))}
        </div>
      </div>

      {/* Share Portfolio Section */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-mono font-semibold mb-4">
          Share Portfolio
        </h3>
        <div className="flex gap-3">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={handleSharePortfolio}
            className="flex-1 hover:scale-105 transition-all duration-200"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </CustomButton>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex-1 hover:scale-105 transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </CustomButton>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-white/10">
        <div className="text-gray-400 text-sm space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/icon.png"
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
