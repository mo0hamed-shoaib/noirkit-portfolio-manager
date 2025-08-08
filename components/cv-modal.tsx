"use client";
import { useState, useEffect } from "react";
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

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
  const { personalInfo } = usePortfolioStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

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
      setHasError(true);
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

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully");
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    console.error("Iframe failed to load");
    setIsLoading(false);
    setHasError(true);
  };

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading && pdfUrl) {
      const timeout = setTimeout(() => {
        console.log("Iframe loading timeout, switching to fallback");
        setIsLoading(false);
        setHasError(true);
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [isLoading, pdfUrl]);

  // Force error state if loading takes too long
  useEffect(() => {
    if (isLoading) {
      const forceErrorTimeout = setTimeout(() => {
        console.log("Forcing error state due to long loading time");
        setIsLoading(false);
        setHasError(true);
      }, 8000); // 8 seconds maximum

      return () => clearTimeout(forceErrorTimeout);
    }
  }, [isLoading]);

  // Reset states when modal opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsLoading(true);
      setHasError(false);
      // Create proper PDF URL for iframe
      if (personalInfo?.cvFile) {
        console.log("CV File URL:", personalInfo.cvFile);
        // If it's a base64 data URL, use it directly
        if (personalInfo.cvFile.startsWith('data:')) {
          console.log("Using base64 data URL");
          setPdfUrl(personalInfo.cvFile);
        } else {
          // For Supabase storage URLs, use directly first, then try blob if needed
          console.log("Using Supabase storage URL");
          setPdfUrl(personalInfo.cvFile);
          // Also try to create a blob URL as backup
          createBlobUrl(personalInfo.cvFile);
        }
      }
    } else {
      onClose();
    }
  };

  // Create blob URL for better iframe compatibility
  const createBlobUrl = async (url: string) => {
    try {
      console.log("Attempting to create blob URL from:", url);
      
      // First test if the URL is accessible
      const testResponse = await fetch(url, { method: 'HEAD' });
      console.log("URL accessibility test:", testResponse.status, testResponse.statusText);
      
      if (!testResponse.ok) {
        throw new Error(`URL not accessible: ${testResponse.status} ${testResponse.statusText}`);
      }
      
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log("Blob created successfully, size:", blob.size);
      
      const blobUrl = window.URL.createObjectURL(blob);
      console.log("Blob URL created:", blobUrl);
      setPdfUrl(blobUrl);
    } catch (error) {
      console.error("Failed to create blob URL:", error);
      console.log("Falling back to direct URL:", url);
      // Fallback to direct URL
      setPdfUrl(url);
    }
  };

  const hasCvFile = personalInfo?.cvFile && personalInfo.cvFile.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
          ) : hasError ? (
            <div className="h-full flex items-center justify-center p-4 sm:p-6">
              <div className="text-center space-y-4 sm:space-y-6 max-w-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-2 border-red-400/40 bg-red-400/5 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-mono font-light text-red-400">
                    Unable to Load CV Preview
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    The CV preview couldn't be displayed in the modal. This is common with certain browsers or network configurations. You can still view and download your CV using the buttons below.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <CustomButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                      // Retry with a fresh blob URL
                      if (personalInfo?.cvFile && !personalInfo.cvFile.startsWith('data:')) {
                        createBlobUrl(personalInfo.cvFile);
                      }
                    }}
                    className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                  >
                    Retry Preview
                  </CustomButton>
                  <CustomButton
                    size="sm"
                    onClick={handleOpenInNewTab}
                    className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                  >
                    Open in New Tab
                  </CustomButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full bg-white">
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 animate-spin text-white" />
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm font-light">
                      Loading document...
                    </p>
                  </div>
                </div>
              )}

              {/* PDF Viewer - Works on both mobile and desktop */}
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="CV Preview"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="fullscreen"
              />
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
