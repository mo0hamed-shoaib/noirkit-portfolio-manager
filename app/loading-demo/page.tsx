"use client";

import React, { useState } from "react";
import { 
  ProgressBarLoader, 
  WaveLoader, 
  CircularProgressLoader, 
  StaggeredContentLoader, 
  MinimalPulseLoader 
} from "@/components/ui/enhanced-loading";
import { EnhancedProgressLoader } from "@/components/ui/enhanced-loading-with-reveal";
import { CustomButton } from "@/components/ui/custom-button";

const loaders = [
  { 
    name: "Enhanced Canvas Loader", 
    component: () => <EnhancedProgressLoader variant="particles" />, 
    description: "Animated canvas background with particles, progress bar, and smooth content reveal",
    pros: ["Animated canvas background", "Smooth content transitions", "Most engaging experience", "Professional branding"],
    bestFor: "When you want the most immersive and impressive loading experience"
  },
  { 
    name: "Progress Bar", 
    component: ProgressBarLoader, 
    description: "Shows step-by-step progress with realistic loading messages",
    pros: ["Clear progress indication", "User knows what's happening", "Professional feel"],
    bestFor: "When you want users to feel engaged and informed"
  },
  { 
    name: "Wave Animation", 
    component: WaveLoader, 
    description: "Elegant wave animation with branding",
    pros: ["Visually appealing", "Modern and clean", "Quick to implement"],
    bestFor: "When you want a stylish, branded loading experience"
  },
  { 
    name: "Circular Progress", 
    component: CircularProgressLoader, 
    description: "Classic circular progress with data type indicators",
    pros: ["Familiar UX pattern", "Shows percentage", "Compact design"],
    bestFor: "When you need a traditional progress indicator"
  },
  { 
    name: "Staggered Content", 
    component: StaggeredContentLoader, 
    description: "Shows content loading section by section",
    pros: ["Content-aware", "Builds anticipation", "Unique approach"],
    bestFor: "When you want to preview the actual content structure"
  },
  { 
    name: "Minimal Pulse", 
    component: MinimalPulseLoader, 
    description: "Simple, clean loading animation",
    pros: ["Fast and lightweight", "Subtle", "Works everywhere"],
    bestFor: "When you need a quick, unobtrusive loader"
  },
];

export default function LoadingDemo() {
  const [currentLoader, setCurrentLoader] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = (index: number) => {
    setCurrentLoader(index);
    setIsLoading(true);
    // Auto-hide after 5 seconds
    setTimeout(() => setIsLoading(false), 5000);
  };

  const CurrentLoader = loaders[currentLoader].component;

  if (isLoading) {
    return <CurrentLoader />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Loading Experience Demo</h1>
          <p className="text-muted-foreground">
            Choose a loading style that best fits your UX goals
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loaders.map((loader, index) => (
            <div
              key={loader.name}
              className="border border-border rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{loader.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {loader.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-400">Pros:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {loader.pros.map((pro, i) => (
                    <li key={i}>• {pro}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-400">Best For:</h4>
                <p className="text-xs text-muted-foreground">{loader.bestFor}</p>
              </div>

              <CustomButton
                onClick={() => showLoader(index)}
                className="w-full"
                variant="outline"
              >
                Preview (5s)
              </CustomButton>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Implementation Guide</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Current Implementation:</h3>
              <code className="block bg-muted p-3 rounded text-xs">
                {`// In app/page.tsx
if (loading) {
  return <ProgressBarLoader />;
}`}
              </code>
            </div>

            <div>
              <h3 className="font-medium mb-2">Switch to Different Loader:</h3>
              <code className="block bg-muted p-3 rounded text-xs">
                {`// Replace ProgressBarLoader with:
// <WaveLoader />
// <CircularProgressLoader />
// <StaggeredContentLoader />
// <MinimalPulseLoader />`}
              </code>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
              <h3 className="font-medium text-blue-400 mb-2">Recommendation:</h3>
              <p className="text-muted-foreground">
                For portfolio sites, <strong>ProgressBarLoader</strong> or <strong>StaggeredContentLoader</strong> 
                work best as they give users a sense of the content being prepared, 
                making the wait feel purposeful rather than arbitrary.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <CustomButton
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            ← Back to Portfolio
          </CustomButton>
        </div>
      </div>
    </div>
  );
}