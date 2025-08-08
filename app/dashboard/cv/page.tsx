"use client";

import type React from "react";
import { useState } from "react";
import {
  Upload,
  Download,
  ExternalLink,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import { CustomButton } from "@/components/ui/custom-button";
import { CVModal } from "@/components/cv-modal";
import { useToast } from "@/components/ui/toast";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { uploadCV, deleteFile } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";

export default function CVManagementPage() {
  const { personalInfo, updatePersonalInfo } = usePortfolioStore();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file only", "error");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast("File size must be less than 10MB", "error");
      return;
    }

    setIsUploading(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Upload to Supabase storage
      const result = await uploadCV(file, user.id);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Update personal info with the storage URL
      await updatePersonalInfo({ cvFile: result.url });
      setIsUploading(false);
      showToast("CV uploaded successfully!", "success");
    } catch (error) {
      setIsUploading(false);
      console.error("Upload error:", error);
      showToast("Error uploading file. Please try again.", "error");
    }
  };

  const handleDownload = () => {
    if (personalInfo?.cvFile) {
      const link = document.createElement("a");
      link.href = personalInfo.cvFile;
      link.download = `${personalInfo.name.replace(/\s+/g, "_")}_CV.pdf`;
      link.click();
    }
  };

  const handleOpenInNewTab = async () => {
    if (!personalInfo?.cvFile) return;

    try {
      // Convert base64 to blob and create a proper URL
      const response = await fetch(personalInfo.cvFile);
      if (!response.ok) throw new Error("Failed to fetch CV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Open in new tab
      window.open(url, "_blank", "noopener,noreferrer");

      // Clean up the blob URL after a delay to allow the new tab to load
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Failed to open CV in new tab:", error);
      // Fallback to direct URL if blob creation fails
      window.open(personalInfo.cvFile, "_blank", "noopener,noreferrer");
    }
  };

  const handleRemoveCV = async () => {
    if (
      confirm(
        "Are you sure you want to remove your CV? This action cannot be undone."
      )
    ) {
      try {
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        // Delete from Supabase storage if it's a storage URL
        if (personalInfo?.cvFile && !personalInfo.cvFile.startsWith('data:')) {
          const fileName = `${user.id}/cv.pdf`;
          await deleteFile("cv-files", fileName);
        }

        await updatePersonalInfo({ cvFile: undefined });
        showToast("CV removed successfully", "success");
      } catch (error) {
        console.error("Remove error:", error);
        showToast("Failed to remove CV", "error");
      }
    }
  };

  const formatFileSize = (fileUrl: string) => {
    // For storage URLs, we can't easily get the size, so show a placeholder
    if (fileUrl.startsWith('data:')) {
      // Rough estimation of file size from base64
      const sizeInBytes = (fileUrl.length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      return sizeInMB.toFixed(2) + " MB";
    }
    return "PDF Format"; // For storage URLs, we don't show size
  };

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            CV Management
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            Upload and manage your curriculum vitae
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="border border-white/20 rounded-xl p-6 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload CV
            </h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors duration-200">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {isUploading
                    ? "Uploading..."
                    : "Drag and drop your CV here, or click to browse"}
                </p>
                <DashboardButton asChild disabled={isUploading}>
                  <label className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : "Choose PDF File"}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </DashboardButton>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-400">
                    <p className="font-medium mb-1">Upload Guidelines:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• PDF format only</li>
                      <li>• Maximum file size: 10MB</li>
                      <li>• Recommended: Single page or multi-page PDF</li>
                      <li>• Ensure text is readable and professional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current CV Section */}
        <div className="space-y-6">
          <div className="border border-white/20 rounded-xl p-6 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Current CV
            </h2>

            {personalInfo?.cvFile ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-400">CV Uploaded</p>
                      <p className="text-xs text-gray-400">
                        Size: {formatFileSize(personalInfo.cvFile)} • PDF Format
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <DashboardButton
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview CV
                  </DashboardButton>
                  <div className="grid grid-cols-2 gap-3">
                    <DashboardButton
                      variant="outline"
                      onClick={handleOpenInNewTab}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </DashboardButton>
                    <DashboardButton variant="outline" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DashboardButton>
                  </div>
                  <DashboardButton
                    variant="ghost"
                    onClick={handleRemoveCV}
                    className="text-red-400 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove CV
                  </DashboardButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No CV uploaded yet</p>
                <p className="text-sm text-gray-600">
                  Upload your CV to enable the "View CV" button on your
                  portfolio
                </p>
              </div>
            )}
          </div>

          {/* CV Tips */}
          <div className="border border-white/20 rounded-xl p-6 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">CV Best Practices</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p>Keep it concise - ideally 1-2 pages maximum</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Use a clean, professional layout with consistent formatting
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Include contact information, skills, experience, and education
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p>Tailor content to match your portfolio and target roles</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p>Ensure the PDF is searchable and accessible</p>
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
