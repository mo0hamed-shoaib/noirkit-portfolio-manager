"use client";
import { useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "./ui/custom-button";
import { DashboardButton } from "./ui/dashboard-button";
import { usePortfolioStore } from "@/lib/store";
import { PDFViewer } from "./ui/pdf-viewer";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
  const { personalInfo } = usePortfolioStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!personalInfo?.cvFile) return;

    setIsDownloading(true);
    try {
      const response = await fetch(personalInfo.cvFile);
      if (!response.ok) throw new Error("Failed to fetch CV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        personalInfo.name?.replace(/\s+/g, "_") || "CV"
      }_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
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

  const hasCvFile = personalInfo?.cvFile && personalInfo.cvFile.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] max-w-4xl h-[95vh] max-h-[800px] bg-black border border-white text-white p-0 flex flex-col gap-0"
        aria-describedby="cv-modal-description"
      >
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 py-4 pr-4 sm:pr-16 border-b border-white/20 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-mono font-light">
                {personalInfo?.name
                  ? `${personalInfo.name}'s CV`
                  : "CV Preview"}
              </DialogTitle>
              <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
                Professional curriculum vitae
              </p>
            </div>

            {hasCvFile && (
              <div className="flex items-center gap-2 sm:gap-3">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="hidden sm:flex transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20 text-xs"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Full Screen
                </CustomButton>
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="hidden sm:flex transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20 text-xs"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span>Download PDF</span>
                    </>
                  )}
                </CustomButton>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Content Area - Takes remaining space */}
        <div className="flex-1 min-h-0 relative" id="cv-modal-description">
          {!hasCvFile ? (
            <div className="h-full flex items-center justify-center p-4 sm:p-6">
              <div className="text-center space-y-4 sm:space-y-6 max-w-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white/60" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-mono font-light">
                    No CV Available
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    Upload your resume in the dashboard to share your
                    professional experience and qualifications with visitors.
                  </p>
                </div>
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => onClose()}
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                >
                  Return to Dashboard
                </CustomButton>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {/* PDF.js Viewer */}
              <PDFViewer url={personalInfo.cvFile!} className="h-full" />
            </div>
          )}
        </div>

        {/* Mobile Footer */}
        {hasCvFile && (
          <div className="sm:hidden px-4 py-3 border-t border-white/20 bg-gray-900/30 flex-shrink-0">
            <div className="flex gap-2">
              <CustomButton
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20 text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Full Screen
              </CustomButton>
              <CustomButton
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20 text-xs"
              >
                {isDownloading ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Download className="w-3 h-3 mr-1" />
                )}
                {isDownloading ? "Downloading..." : "Download PDF"}
              </CustomButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
