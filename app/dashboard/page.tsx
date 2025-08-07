"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Upload, Mail, Save } from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomInput } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { usePageTitle } from "@/lib/hooks/use-page-title";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function PersonalInfoPage() {
  const {
    personalInfo,
    updatePersonalInfo,
    projects,
    techStack,
    achievements,
    socialLinks,
    loading,
  } = usePortfolioStore();
  const { showToast } = useToast();

  // Set dynamic page title
  usePageTitle({
    title: "Personal Information",
    prefix: "Dashboard",
  });
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    bio: "",
    profileImage: "/placeholder.svg?height=60&width=60",
    email: "",
    phone: "",
    location: "",
    cvFile: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>("");

  useEffect(() => {
    if (personalInfo) {
      const newFormData = {
        name: personalInfo.name || "",
        jobTitle: personalInfo.jobTitle || "",
        bio: personalInfo.bio || "",
        profileImage:
          personalInfo.profileImage || "/placeholder.svg?height=60&width=60",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        location: personalInfo.location || "",
        cvFile: personalInfo.cvFile || "",
      };
      setFormData(newFormData);
      setLastSavedData(JSON.stringify(newFormData));
    }
  }, [personalInfo]);

  // Auto-save functionality
  const autoSave = useCallback(async (data: typeof formData) => {
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastSavedData) return;

    setIsAutoSaving(true);
    try {
      await updatePersonalInfo(data);
      setLastSavedData(currentDataString);
      showToast("Changes saved automatically", "success");
    } catch (error) {
      showToast("Auto-save failed", "error");
    } finally {
      setIsAutoSaving(false);
    }
  }, [updatePersonalInfo, lastSavedData, showToast]);

  // Debounced auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      autoSave(formData);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, autoSave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updatePersonalInfo(formData);
      setLastSavedData(JSON.stringify(formData));
      showToast("Personal information updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update personal information", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !personalInfo) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-mono mb-2">Personal Information</h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            Personal Information
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            Update your personal details and contact information
          </p>
        </div>
        {/* Auto-save indicator */}
        <div className="flex items-center gap-2">
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Save className="w-4 h-4 animate-pulse" />
              <span>Auto-saving...</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="space-y-2">
          <Label htmlFor="profileImage" className="text-white">
            Profile Image
          </Label>
          <div className="flex items-center gap-4">
            <Image
              src={formData.profileImage || "/placeholder.svg"}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full border border-white"
            />
            <div>
              <DashboardButton
                type="button"
                variant="outline"
                size="sm"
                asChild
              >
                <label htmlFor="profileImage" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Image
                </label>
              </DashboardButton>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name *
            </Label>
            <CustomInput
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-white">
              Job Title *
            </Label>
            <CustomInput
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
              }
              placeholder="e.g., Senior Web Developer"
              required
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <CustomInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <CustomInput
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">
              Location
            </Label>
            <CustomInput
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white">
            Bio
          </Label>
          <CustomInput
            variant="textarea"
            id="bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        <DashboardButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </DashboardButton>
      </form>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white font-mono tracking-wide">
              Projects
            </CardTitle>
            <div className="h-4 w-4 text-blue-400">📁</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {projects?.length || 0}
            </div>
            <p className="text-xs text-gray-400 font-mono">Total projects</p>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white font-mono tracking-wide">
              Technologies
            </CardTitle>
            <div className="h-4 w-4 text-green-400">⚡</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {techStack?.length || 0}
            </div>
            <p className="text-xs text-gray-400 font-mono">Tech stack items</p>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white font-mono tracking-wide">
              Achievements
            </CardTitle>
            <div className="h-4 w-4 text-yellow-400">🏆</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {achievements?.length || 0}
            </div>
            <p className="text-xs text-gray-400 font-mono">Total achievements</p>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white font-mono tracking-wide">
              Social Links
            </CardTitle>
            <div className="h-4 w-4 text-purple-400">🔗</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {socialLinks?.length || 0}
            </div>
            <p className="text-xs text-gray-400 font-mono">Social profiles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
