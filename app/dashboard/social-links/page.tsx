"use client";

import type React from "react";
import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Share2,
  ExternalLink,
  GripVertical,
  X,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { usePortfolioStore } from "@/lib/store";
import type { SocialLink } from "@/lib/types";
import { CustomInput } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SortableList } from "@/components/ui/sortable-list";
import { useToast } from "@/components/ui/toast";
import { DashboardButton } from "@/components/ui/dashboard-button";

export default function SocialLinksPage() {
  const {
    socialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderSocialLinks,
  } = usePortfolioStore();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [formData, setFormData] = useState<
    Omit<SocialLink, "id" | "platform" | "icon">
  >({
    url: "",
  });

  // Popular social media platforms with their icons
  const popularPlatforms = [
    {
      name: "Twitter/X",
      icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
    {
      name: "LinkedIn",
      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
      name: "GitHub",
      icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
    },
    {
      name: "Instagram",
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
  ];

  const resetForm = () => {
    setFormData({
      url: "",
    });
    setEditingLink(null);
  };

  const openModal = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData(link);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.trim()) {
      showToast("Please fill in the URL field", "error");
      return;
    }

    // Extract platform name from URL
    const url = formData.url.toLowerCase();
    let platformName = "Social Link";

    if (url.includes("twitter.com") || url.includes("x.com")) {
      platformName = "Twitter/X";
    } else if (url.includes("linkedin.com")) {
      platformName = "LinkedIn";
    } else if (url.includes("github.com")) {
      platformName = "GitHub";
    } else if (url.includes("instagram.com")) {
      platformName = "Instagram";
    } else if (url.includes("facebook.com")) {
      platformName = "Facebook";
    } else if (url.includes("youtube.com")) {
      platformName = "YouTube";
    } else if (url.includes("tiktok.com")) {
      platformName = "TikTok";
    } else if (url.includes("discord.com")) {
      platformName = "Discord";
    } else if (url.includes("telegram.me")) {
      platformName = "Telegram";
    } else if (url.includes("reddit.com")) {
      platformName = "Reddit";
    }

    const formDataWithPlatform = {
      ...formData,
      platform: platformName,
      icon: "", // Empty icon since we use platform-based icons
    };

    try {
      if (editingLink) {
        await updateSocialLink(editingLink.id, formDataWithPlatform);
        showToast("Social link updated successfully!", "success");
      } else {
        await addSocialLink(formDataWithPlatform);
        showToast("Social link added successfully!", "success");
      }
      closeModal();
    } catch (error) {
      showToast("Failed to save social link", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this social link?")) {
      try {
        await deleteSocialLink(id);
        showToast("Social link deleted successfully!", "success");
      } catch (error) {
        showToast("Failed to delete social link", "error");
      }
    }
  };

  const handleReorder = async (reorderedLinks: SocialLink[]) => {
    try {
      await reorderSocialLinks(reorderedLinks);
      showToast("Social links reordered successfully!", "success");
    } catch (error) {
      showToast("Failed to reorder social links", "error");
    }
  };

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

  const renderSocialLinkItem = (
    link: SocialLink,
    index: number,
    isDragging: boolean
  ) => (
    <div
      key={link.id}
      className={`border border-white/20 rounded-xl p-6 bg-black/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm group ${
        isDragging ? "scale-105 shadow-lg opacity-75" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isReordering && (
            <div className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <div className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
            {(() => {
              const IconComponent = getIconComponent(link.platform);
              return <IconComponent className="w-8 h-8" />;
            })()}
          </div>
          <div className="flex-1">
            <p className="text-white font-mono tracking-wide">
              {link.platform}
            </p>
          </div>
        </div>
        {!isReordering && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DashboardButton variant="ghost" size="sm" asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
              </a>
            </DashboardButton>
            <DashboardButton
              variant="ghost"
              size="sm"
              onClick={() => openModal(link)}
            >
              <Edit className="w-3 h-3" />
            </DashboardButton>
            <DashboardButton
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(link.id)}
            >
              <Trash2 className="w-3 h-3" />
            </DashboardButton>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            Social Links
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            Manage your social media presence
          </p>
        </div>
        <div className="flex gap-3">
          {socialLinks.length > 0 && (
            <DashboardButton
              variant={isReordering ? "default" : "outline"}
              onClick={() => setIsReordering(!isReordering)}
            >
              {isReordering ? "Done" : "Reorder"}
            </DashboardButton>
          )}
          <DashboardButton onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </DashboardButton>
        </div>
      </div>

      {/* Social Links Grid */}
      {isReordering ? (
        <SortableList
          items={socialLinks}
          onReorder={handleReorder}
          renderItem={renderSocialLinkItem}
          keyExtractor={(link) => link.id}
          className="space-y-4"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link, index) =>
            renderSocialLinkItem(link, index, false)
          )}
        </div>
      )}

      {/* Empty State */}
      {socialLinks.length === 0 && (
        <div className="col-span-full border border-white/20 rounded-xl p-12 text-center bg-black/30 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <Share2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No social links added yet</p>
          <DashboardButton onClick={() => openModal()}>
            Add Your First Social Link
          </DashboardButton>
        </div>
      )}

      {/* Social Link Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl bg-black border border-white text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Social Link" : "Add New Social Link"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Profile URL *</Label>
              <CustomInput
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://twitter.com/username"
                required
              />
            </div>

            <div className="flex gap-4">
              <DashboardButton type="submit">
                {editingLink ? "Update Link" : "Add Link"}
              </DashboardButton>
              <DashboardButton
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </DashboardButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
