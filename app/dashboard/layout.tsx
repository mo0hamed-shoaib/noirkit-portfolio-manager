"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Code,
  Award,
  Mail,
  Share2,
  FileText,
  Home,
  Database,
  LogOut,
  Menu,
  X,
  Zap,
  HardDrive,
} from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { ProtectedRoute } from "@/components/protected-route";
import { OnboardingModal } from "@/components/onboarding-modal";
import { useAuth } from "@/lib/auth-context";
import { usePortfolioStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Personal Info", href: "/dashboard", icon: User },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Tech Stack", href: "/dashboard/tech-stack", icon: Code },
  { name: "Achievements", href: "/dashboard/achievements", icon: Award },
  { name: "Social Links", href: "/dashboard/social-links", icon: Share2 },
  { name: "Contact Form", href: "/dashboard/contact", icon: Mail },
  { name: "CV Management", href: "/dashboard/cv", icon: FileText },
  { name: "Storage", href: "/dashboard/storage", icon: HardDrive },

  { name: "Data Backup", href: "/dashboard/backup", icon: Database },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { fetchAllData, loading, error, personalInfo } = usePortfolioStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const currentPage = navigation.find((item) => item.href === pathname);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="flex">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-30 w-64 bg-black border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:transform-none",
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Brand Header */}
              <div className="flex-shrink-0 p-3 border-b border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/logo-icon.png"
                    alt="NoirKit Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <div>
                    <h1 className="text-xl font-mono font-bold">NoirKit</h1>
                    <p className="text-xs text-gray-400">Portfolio Dashboard</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DashboardButton variant="outline" size="sm" asChild>
                      <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Portfolio
                      </Link>
                    </DashboardButton>
                    <DashboardButton
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </DashboardButton>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
                    title="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-white/10 text-white border border-white/20 shadow-lg"
                          : "text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/10"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        )}
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Info */}
              <div className="flex-shrink-0 p-2 border-t border-white/20">
                {user && (
                  <div className="p-2 bg-black/50 border border-white/20 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Signed in as:</p>
                    {personalInfo?.name && (
                      <p className="text-xs font-medium text-white">
                        {personalInfo.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 lg:ml-64">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-20 bg-black border-b border-white/20 backdrop-blur-md">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
                  title="Open sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {currentPage && (
                  <div className="flex items-center gap-2">
                    <currentPage.icon className="w-5 h-5 text-gray-400" />
                    <h1 className="text-lg font-mono">{currentPage.name}</h1>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg hover:bg-red-400/10 transition-colors text-red-400 hover:text-red-300 border border-red-400/20"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 lg:p-8">
              {/* Status Messages */}
              {loading && (
                <div className="mb-6 bg-blue-400/10 border border-blue-400/20 rounded-lg p-4 text-blue-400 text-sm flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span>Loading your portfolio data...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Main Content */}
              <main className="transition-all duration-300">{children}</main>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal />
    </ProtectedRoute>
  );
}
