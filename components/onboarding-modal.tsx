"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Briefcase,
  Code,
  Award,
  Mail,
  Share2,
  FileText,
  X,
  Sparkles,
  Zap,
  Globe,
  Palette,
  Settings,
  BarChart3,
} from "lucide-react";

interface FeatureSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

export function OnboardingModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if user has seen onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("has_seen_onboarding")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking onboarding status:", error);
          return;
        }

        // If no profile exists or has_seen_onboarding is false, show onboarding
        if (!data || !data.has_seen_onboarding) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  // Define feature sections
  const features: FeatureSection[] = [
    {
      id: "profile",
      title: "Personal Info",
      description:
        "Manage your profile, contact details, and upload your CV. This is where visitors learn about you.",
      icon: User,
      href: "/dashboard",
    },
    {
      id: "projects",
      title: "Projects",
      description:
        "Showcase your best work with images, descriptions, and links. This is the heart of your portfolio.",
      icon: Briefcase,
      href: "/dashboard/projects",
    },
    {
      id: "tech-stack",
      title: "Tech Stack",
      description:
        "Display the technologies and tools you use. Perfect for showing your technical expertise.",
      icon: Code,
      href: "/dashboard/tech-stack",
    },
    {
      id: "achievements",
      title: "Achievements",
      description:
        "Add your education, certifications, and professional achievements to build credibility.",
      icon: Award,
      href: "/dashboard/achievements",
    },
    {
      id: "social-links",
      title: "Social Links",
      description:
        "Connect your professional social media profiles for better networking opportunities.",
      icon: Share2,
      href: "/dashboard/social-links",
    },
    {
      id: "contact",
      title: "Contact Form",
      description:
        "Customize how visitors can reach you. Add fields, change the design, and manage submissions.",
      icon: Mail,
      href: "/dashboard/contact",
    },
    {
      id: "storage",
      title: "Storage",
      description:
        "Manage your uploaded files, images, and CV. Keep track of your storage usage.",
      icon: FileText,
      href: "/dashboard/storage",
    },
    {
      id: "backup",
      title: "Data Backup",
      description:
        "Export and import your portfolio data. Perfect for backups or moving to a new account.",
      icon: BarChart3,
      href: "/dashboard/backup",
    },
  ];

  const handleCompleteOnboarding = async () => {
    if (!user) return;

    try {
      // Update profile to mark onboarding as seen
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        has_seen_onboarding: true,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error updating onboarding status:", error);
        return;
      }

      setHasSeenOnboarding(true);
      setIsOpen(false);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  if (!isOpen || hasSeenOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-mono font-bold text-white tracking-wide">
                Welcome to NoirKit
              </h2>
              <p className="text-gray-400 font-mono text-sm tracking-wide">
                Portfolio Management Dashboard
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCompleteOnboarding}
            className="text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Introduction */}
        <div className="p-8 border-b border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-xl font-mono font-semibold text-white mb-4 tracking-wide">
              Everything you need to build an amazing portfolio
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
              NoirKit gives you complete control over your professional
              portfolio. Here's what you can do with each section of your
              dashboard:
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-mono font-semibold text-white mb-3 tracking-wide">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-mono">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="p-8 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-mono font-medium text-white tracking-wide">
                Public Portfolio
              </h4>
              <p className="text-sm text-gray-400 font-mono">
                Your portfolio is automatically live at your domain
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-mono font-medium text-white tracking-wide">
                Beautiful Design
              </h4>
              <p className="text-sm text-gray-400 font-mono">
                Professional, responsive design that looks great on all devices
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-mono font-medium text-white tracking-wide">
                Easy Management
              </h4>
              <p className="text-sm text-gray-400 font-mono">
                Simple drag-and-drop interface to organize your content
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/10">
          <div className="text-center">
            <p className="text-gray-400 mb-6 font-mono text-sm">
              Ready to start building your portfolio? Explore the sections above
              to get started!
            </p>
            <Button
              onClick={handleCompleteOnboarding}
              className="bg-white text-black hover:bg-gray-100 font-mono font-semibold tracking-wide px-8 py-3 border border-white/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
