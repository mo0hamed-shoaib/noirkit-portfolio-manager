"use client";

import type React from "react";
import { useState } from "react";
import {
  Link,
  ExternalLink,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
  Copy,
  CheckCircle,
} from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import { CustomButton } from "@/components/ui/custom-button";
import { CVModal } from "@/components/cv-modal";
import { useToast } from "@/components/ui/toast";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CVManagementContent() {
  const { personalInfo, updatePersonalInfo } = usePortfolioStore();
  const { showToast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [cvLink, setCvLink] = useState(personalInfo?.cvFile || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCVLink = async () => {
    if (!cvLink.trim()) {
      showToast("Please enter a CV link", "error");
      return;
    }

    // Basic URL validation
    try {
      new URL(cvLink);
    } catch {
      showToast("Please enter a valid URL", "error");
      return;
    }

    setIsSaving(true);

    try {
      await updatePersonalInfo({ cvFile: cvLink.trim() });
      setIsSaving(false);
      showToast("CV link saved successfully!", "success");
    } catch (error) {
      setIsSaving(false);
      console.error("Save error:", error);
      showToast("Error saving CV link. Please try again.", "error");
    }
  };

  const handleRemoveCV = async () => {
    if (
      confirm(
        "Are you sure you want to remove your CV link? This action cannot be undone."
      )
    ) {
      try {
        await updatePersonalInfo({ cvFile: undefined });
        setCvLink("");
        showToast("CV link removed successfully", "success");
      } catch (error) {
        console.error("Remove error:", error);
        showToast("Failed to remove CV link", "error");
      }
    }
  };

  const handleCopyLink = () => {
    if (personalInfo?.cvFile) {
      navigator.clipboard.writeText(personalInfo.cvFile);
      showToast("CV link copied to clipboard!", "success");
    }
  };

  const handleTestLink = () => {
    if (personalInfo?.cvFile) {
      window.open(personalInfo.cvFile, "_blank", "noopener,noreferrer");
    }
  };

  const hasCvFile = personalInfo?.cvFile && personalInfo.cvFile.trim() !== "";

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            CV Management
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            Add and manage your CV link for portfolio visitors
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Current Status */}
        <div className="border border-white/20 rounded-xl p-6 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              hasCvFile 
                ? "bg-green-500/20 border border-green-500/30" 
                : "bg-gray-500/20 border border-gray-500/30"
            }`}>
              {hasCvFile ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <FileText className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white font-mono">
                {hasCvFile ? "CV Link Active" : "No CV Link Set"}
              </h2>
              <p className="text-sm text-gray-400 font-mono">
                {hasCvFile 
                  ? "Your CV is accessible to portfolio visitors" 
                  : "Add a CV link to enable the View CV button"
                }
              </p>
            </div>
          </div>

          {hasCvFile && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm text-green-400 font-mono break-all">
                {personalInfo.cvFile}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit CV Link */}
        <div className="border border-white/20 rounded-xl p-6 bg-black/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white font-mono">
            <Link className="w-5 h-5" />
            {hasCvFile ? "Update CV Link" : "Add CV Link"}
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-link" className="text-sm font-medium text-white">
                CV Link URL
              </Label>
              <Input
                id="cv-link"
                type="url"
                placeholder="https://drive.google.com/file/d/... or https://example.com/cv.pdf"
                value={cvLink}
                onChange={(e) => setCvLink(e.target.value)}
                className="bg-black/30 border-white/20 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-400">
                Enter a direct link to your CV (Google Drive, Dropbox, personal website, etc.)
              </p>
            </div>

            <div className="flex gap-3">
              <DashboardButton
                onClick={handleSaveCVLink}
                disabled={isSaving || !cvLink.trim()}
                className="flex-1"
              >
                <Link className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : hasCvFile ? "Update Link" : "Save Link"}
              </DashboardButton>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasCvFile && (
          <div className="border border-white/20 rounded-xl p-6 bg-black/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white font-mono">
              <Eye className="w-5 h-5" />
              Manage CV Link
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <DashboardButton
                onClick={() => setIsPreviewOpen(true)}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview CV
              </DashboardButton>
              
              <DashboardButton
                variant="outline"
                onClick={handleTestLink}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Test Link
              </DashboardButton>
              
              <DashboardButton 
                variant="outline" 
                onClick={handleCopyLink}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </DashboardButton>
              
              <DashboardButton
                variant="ghost"
                onClick={handleRemoveCV}
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Link
              </DashboardButton>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="border border-white/20 rounded-xl p-6 bg-black/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white font-mono">
            <AlertCircle className="w-5 h-5" />
            CV Link Guidelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-mono">Recommended Sources</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Google Drive with "Anyone with the link can view" permission</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Dropbox with public sharing enabled</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Personal website or portfolio domain</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Professional platforms like LinkedIn</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-mono">Best Practices</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use PDF format for best compatibility</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Test the link in an incognito window</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep your CV updated and professional</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Consider using a custom domain for professionalism</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview Modal */}
      <CVModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
} 