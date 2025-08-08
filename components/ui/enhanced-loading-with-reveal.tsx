"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, User, Briefcase, Code, Award, Share2, Mail, CheckCircle } from "lucide-react";
import { AnimatedCanvas } from "./animated-canvas";

interface EnhancedLoaderProps {
  onComplete?: () => void;
  variant?: "particles" | "waves" | "grid" | "constellation";
}

export function EnhancedProgressLoader({ onComplete, variant = "particles" }: EnhancedLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const steps = [
    { id: 0, label: "Initializing portfolio...", icon: User, duration: 800 },
    { id: 1, label: "Loading projects...", icon: Briefcase, duration: 1000 },
    { id: 2, label: "Fetching tech stack...", icon: Code, duration: 600 },
    { id: 3, label: "Getting achievements...", icon: Award, duration: 700 },
    { id: 4, label: "Loading social links...", icon: Share2, duration: 500 },
    { id: 5, label: "Finalizing portfolio...", icon: Mail, duration: 400 },
  ];

  useEffect(() => {
    let currentProgress = 0;
    let stepIndex = 0;

    const progressStep = () => {
      if (stepIndex >= steps.length) {
        setProgress(100);
        setIsComplete(true);
        
        // Show completion state briefly, then reveal content
        setTimeout(() => {
          setShowContent(true);
          setTimeout(() => {
            onComplete?.();
          }, 800); // Time for reveal animation
        }, 500);
        
        return;
      }

      const step = steps[stepIndex];
      const stepProgress = 100 / steps.length;
      const targetProgress = (stepIndex + 1) * stepProgress;
      
      setCurrentStep(stepIndex);
      
      // Animate progress for current step
      const animateProgress = () => {
        currentProgress += (targetProgress - currentProgress) * 0.1;
        setProgress(currentProgress);
        
        if (currentProgress < targetProgress - 1) {
          requestAnimationFrame(animateProgress);
        } else {
          setProgress(targetProgress);
          stepIndex++;
          setTimeout(progressStep, 200); // Brief pause between steps
        }
      };
      
      setTimeout(() => {
        animateProgress();
      }, step.duration);
    };

    progressStep();
  }, [onComplete]);

  const CurrentIcon = steps[currentStep]?.icon || User;

  if (showContent) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Animated reveal overlay */}
        <div className="absolute inset-0 bg-background animate-slideUp opacity-0" 
             style={{ animationFillMode: 'forwards', animationDuration: '0.8s' }} />
        
        {/* Content will be revealed by parent component */}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      {/* Animated Canvas Background */}
      <AnimatedCanvas variant={variant} color="#ffffff" intensity="medium" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Area with Animation */}
          <div className="text-center space-y-4 animate-fadeIn">
            <div className="relative">
              {/* Pulsing background ring */}
              <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full mx-auto animate-ping" 
                   style={{ animationDuration: '2s' }} />
              
              {/* Icon container */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full mx-auto flex items-center justify-center border border-primary/30">
                {isComplete ? (
                  <CheckCircle className="w-10 h-10 text-green-400 animate-bounce" />
                ) : (
                  <CurrentIcon className="w-10 h-10 text-primary animate-pulse" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                NoirKit
              </h2>
              <p className="text-muted-foreground">
                {isComplete ? "Portfolio ready!" : "Crafting your digital presence"}
              </p>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-6">
            <div className="relative">
              {/* Background bar */}
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm border border-border/50">
                {/* Progress fill with gradient */}
                <div 
                  className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/30 blur-sm" />
                </div>
              </div>
              
              {/* Progress glow */}
              <div 
                className="absolute top-0 h-3 bg-primary/30 rounded-full blur-md transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Progress info */}
            <div className="flex justify-between items-center text-sm">
              <span className={cn(
                "transition-all duration-300",
                isComplete ? "text-green-400" : "text-muted-foreground"
              )}>
                {isComplete ? "✓ Portfolio loaded successfully!" : steps[currentStep]?.label || "Loading..."}
              </span>
              <span className="font-mono text-primary font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "relative w-3 h-3 rounded-full transition-all duration-500",
                  index < currentStep
                    ? "bg-green-400 scale-110"
                    : index === currentStep
                    ? "bg-primary scale-125 animate-pulse"
                    : "bg-muted scale-100"
                )}
              >
                {/* Completed step glow */}
                {index < currentStep && (
                  <div className="absolute inset-0 bg-green-400/30 rounded-full blur-sm scale-150" />
                )}
                
                {/* Current step glow */}
                {index === currentStep && (
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm scale-150 animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Completion Animation */}
          {isComplete && (
            <div className="text-center animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-full text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Portfolio loaded successfully</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Content Reveal Animation Component
export function ContentRevealWrapper({ children, isVisible }: { children: React.ReactNode; isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="animate-contentReveal">
      {children}
    </div>
  );
}