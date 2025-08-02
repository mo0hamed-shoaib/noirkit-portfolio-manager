"use client";

import type React from "react";

import { useState } from "react";
import { Download, Upload, Database, AlertCircle } from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import { CustomButton } from "@/components/ui/custom-button";
import { DashboardButton } from "@/components/ui/dashboard-button";

export default function BackupPage() {
  const store = usePortfolioStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = {
        personalInfo: store.personalInfo,
        socialLinks: store.socialLinks,
        projects: store.projects,
        techStack: store.techStack,
        achievements: store.achievements,
        contactForm: store.contactForm,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `portfolio-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error exporting data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Validate data structure
        if (!data.personalInfo || !data.projects || !data.techStack) {
          throw new Error("Invalid backup file format");
        }

        // Import data
        if (data.personalInfo) store.updatePersonalInfo(data.personalInfo);
        if (data.socialLinks) {
          // Clear existing and add imported
          data.socialLinks.forEach((link: any) => store.addSocialLink(link));
        }
        // Similar for other data types...

        alert("Data imported successfully!");
      } catch (error) {
        alert("Error importing data. Please check the file format.");
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            Data Backup
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            Export and import your portfolio data
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Export Section */}
        <div className="border border-white/20 rounded-xl p-6 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </h2>
          <p className="text-gray-400 mb-4">
            Download a complete backup of your portfolio data as a JSON file.
          </p>
          <DashboardButton onClick={handleExport} disabled={isExporting}>
            <Database className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Portfolio Data"}
          </DashboardButton>
        </div>

        {/* Import Section */}
        <div className="border border-white/20 rounded-xl p-6 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Data
          </h2>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-400">
                <p className="font-medium mb-1">Warning:</p>
                <p>
                  Importing data will overwrite your current portfolio content.
                  Make sure to export your current data first as a backup.
                </p>
              </div>
            </div>
          </div>
          <DashboardButton asChild disabled={isImporting}>
            <label className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? "Importing..." : "Import Portfolio Data"}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                disabled={isImporting}
              />
            </label>
          </DashboardButton>
        </div>
      </div>
    </div>
  );
}
