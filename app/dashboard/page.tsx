"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, Mail } from "lucide-react"
import { usePortfolioStore } from "@/lib/store"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { usePageTitle } from "@/lib/hooks/use-page-title"
import Image from "next/image"

export default function PersonalInfoPage() {
  const { personalInfo, updatePersonalInfo, projects, techStack, achievements, socialLinks, loading } =
    usePortfolioStore()
  const { showToast } = useToast()
  
  // Set dynamic page title
  usePageTitle({ 
    title: "Personal Information",
    prefix: "Dashboard"
  })
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    bio: "",
    profileImage: "/placeholder.svg?height=60&width=60",
    email: "",
    phone: "",
    location: "",
    cvFile: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (personalInfo) {
      setFormData({
        name: personalInfo.name || "",
        jobTitle: personalInfo.jobTitle || "",
        bio: personalInfo.bio || "",
        profileImage: personalInfo.profileImage || "/placeholder.svg?height=60&width=60",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        location: personalInfo.location || "",
        cvFile: personalInfo.cvFile || "",
      })
    }
  }, [personalInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updatePersonalInfo(formData)
      showToast("Personal information updated successfully!", "success")
    } catch (error) {
      showToast("Failed to update personal information", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({ ...prev, profileImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading && !personalInfo) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-mono mb-2">Personal Information</h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-mono mb-2">Personal Information</h1>
        <p className="text-gray-400">Update your personal details and contact information</p>
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
              <CustomButton type="button" variant="outline" size="sm" asChild>
                <label htmlFor="profileImage" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Image
                </label>
              </CustomButton>
              <input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <CustomInput
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-white">
              Job Title
            </Label>
            <CustomInput
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
              placeholder="Your job title"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <CustomInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <CustomInput
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">
              Location
            </Label>
            <CustomInput
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="City, State/Country"
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
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        <CustomButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </CustomButton>
      </form>

      {/* Portfolio Stats */}
      <div className="mt-12 pt-8 border-t border-white/20">
        <h2 className="text-2xl font-mono mb-6">Portfolio Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{projects?.length || 0}</div>
            <div className="text-sm text-gray-400">Projects</div>
          </div>
          <div className="bg-gray-900/50 border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{techStack?.length || 0}</div>
            <div className="text-sm text-gray-400">Technologies</div>
          </div>
          <div className="bg-gray-900/50 border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{achievements?.length || 0}</div>
            <div className="text-sm text-gray-400">Achievements</div>
          </div>
          <div className="bg-gray-900/50 border border-white/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{socialLinks?.length || 0}</div>
            <div className="text-sm text-gray-400">Social Links</div>
          </div>
        </div>
      </div>
    </div>
  )
}
// H
