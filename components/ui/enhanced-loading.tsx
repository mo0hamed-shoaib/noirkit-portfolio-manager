"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, User, Briefcase, Code, Award, Share2, Mail } from "lucide-react";

// 1. Progress Bar Loading with Steps
export function ProgressBarLoader() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, label: "Loading profile...", icon: User },
    { id: 1, label: "Fetching projects...", icon: Briefcase },
    { id: 2, label: "Loading tech stack...", icon: Code },
    { id: 3, label: "Getting achievements...", icon: Award },
    { id: 4, label: "Loading social links...", icon: Share2 },
    { id: 5, label: "Finalizing portfolio...", icon: Mail },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        const stepProgress = Math.floor(newProgress / 16.67); // 100/6 steps
        setCurrentStep(Math.min(stepProgress, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep]?.icon || User;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Area */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto flex items-center justify-center">
            <CurrentIcon className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-mono font-bold">NoirKit</h2>
          <p className="text-muted-foreground">Loading your portfolio</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {steps[currentStep]?.label || "Loading..."}
            </span>
            <span className="text-primary font-mono">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index <= currentStep
                  ? "bg-primary scale-110"
                  : "bg-muted scale-100"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Wave Animation Loader
export function WaveLoader() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="space-y-4">
          <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NoirKit
          </h1>
          <p className="text-muted-foreground">Crafting your digital presence</p>
        </div>

        {/* Wave Animation */}
        <div className="flex justify-center items-end space-x-1 h-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2 bg-primary rounded-full animate-wave"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your professional portfolio...
        </p>
      </div>
    </div>
  );
}

// 3. Circular Progress with Data Types
export function CircularProgressLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingType, setLoadingType] = useState(0);

  const dataTypes = [
    "Personal Info",
    "Projects",
    "Tech Stack", 
    "Achievements",
    "Social Links",
    "Contact Form"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 8 + 2;
        setLoadingType(Math.floor(newProgress / 16.67));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="text-center space-y-8">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto">
          <svg
            className="w-32 h-32 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary transition-all duration-300 ease-out"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>

        {/* NoirKit Branding */}
        <div className="space-y-2">
          <h2 className="text-2xl font-mono font-bold">NoirKit</h2>
          <p className="text-muted-foreground">
            Loading {dataTypes[loadingType] || "Portfolio"}...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.4s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Staggered Content Loader (Content-Aware)
export function StaggeredContentLoader() {
  const [loadedSections, setLoadedSections] = useState<number[]>([]);

  const sections = [
    { name: "Profile", delay: 0 },
    { name: "Projects", delay: 600 },
    { name: "Tech Stack", delay: 1200 },
    { name: "Achievements", delay: 1800 },
    { name: "Social Links", delay: 2400 },
  ];

  useEffect(() => {
    sections.forEach((section, index) => {
      setTimeout(() => {
        setLoadedSections(prev => [...prev, index]);
      }, section.delay);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-mono font-bold mb-2">NoirKit Portfolio</h1>
          <div className="flex justify-center space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

        {/* Staggered Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.name}
              className={cn(
                "p-6 border border-border rounded-lg transition-all duration-500",
                loadedSections.includes(index)
                  ? "opacity-100 translate-y-0 bg-card"
                  : "opacity-30 translate-y-4 bg-muted/30"
              )}
            >
              <div className="flex items-center space-x-3">
                {loadedSections.includes(index) ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
                <span className={cn(
                  "font-medium transition-colors",
                  loadedSections.includes(index)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}>
                  {loadedSections.includes(index) ? `✓ ${section.name} Loaded` : `Loading ${section.name}...`}
                </span>
              </div>
              
              {/* Preview skeleton for loaded sections */}
              {loadedSections.includes(index) && (
                <div className="mt-3 space-y-2 animate-fadeIn">
                  <div className="h-2 bg-muted rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. Minimal Pulse Loader (Fast & Clean)
export function MinimalPulseLoader() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        {/* Pulsing logo */}
        <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center animate-pulse">
          <div className="w-10 h-10 bg-primary/40 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-primary rounded-full" />
          </div>
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-mono font-semibold">NoirKit</h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Preparing your portfolio...
          </p>
        </div>
      </div>
    </div>
  );
}