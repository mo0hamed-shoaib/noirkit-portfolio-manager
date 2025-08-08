"use client";
import { useState } from "react";
import {
  ExternalLink,
  FileText,
  Link,
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

  const handleOpenCV = () => {
    if (personalInfo?.cvFile) {
      window.open(personalInfo.cvFile, "_blank", "noopener,noreferrer");
    }
  };

  const hasCvFile = personalInfo?.cvFile && personalInfo.cvFile.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] max-w-md bg-black border border-white text-white p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-white/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-mono font-light">
                {personalInfo?.name ? `${personalInfo.name}'s CV` : "CV"}
              </DialogTitle>
              <p className="text-xs text-gray-400 font-light mt-1">
                View curriculum vitae
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          {!hasCvFile ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white/60" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-mono font-light">
                  No CV Available
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Add your CV link in the dashboard to share your professional experience with visitors.
                </p>
              </div>
              <CustomButton
                variant="outline"
                size="sm"
                onClick={() => onClose()}
                className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
              >
                Close
              </CustomButton>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-green-400/40 bg-green-400/5 flex items-center justify-center">
                <Link className="w-6 h-6 text-green-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-mono font-light text-green-400">
                  CV Link Available
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Click the button below to view the CV in a new tab. This is a direct view link from Google Drive or similar services.
                </p>
              </div>
              <div className="space-y-3">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={handleOpenCV}
                  className="w-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open CV (Google Drive, ...)
                </CustomButton>
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => onClose()}
                  className="w-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                >
                  Close
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
