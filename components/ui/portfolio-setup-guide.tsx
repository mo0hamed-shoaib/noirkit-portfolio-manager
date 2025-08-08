"use client";

import React, { useState } from "react";
import { 
  User, 
  Briefcase, 
  Code, 
  Award, 
  Share2, 
  Mail, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Sparkles,
  Eye,
  Settings
} from "lucide-react";
import { CustomButton } from "./custom-button";
import { AnimatedCanvas } from "./animated-canvas";

const setupSteps = [
  {
    icon: User,
    title: "Personal Information",
    description: "Add your name, job title, bio, and profile photo",
    estimatedTime: "2 min",
    features: ["Professional headshot", "Compelling bio", "Contact details"]
  },
  {
    icon: Briefcase,
    title: "Showcase Projects",
    description: "Upload your best work with descriptions and live links",
    estimatedTime: "10 min",
    features: ["Project images", "Live demos", "GitHub repositories", "Tech stacks"]
  },
  {
    icon: Code,
    title: "Tech Stack",
    description: "Display your technical skills with custom icons",
    estimatedTime: "3 min",
    features: ["Programming languages", "Frameworks", "Tools", "Custom SVG icons"]
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Highlight education, certifications, and milestones",
    estimatedTime: "5 min",
    features: ["Education history", "Certifications", "Awards", "Professional milestones"]
  },
  {
    icon: Share2,
    title: "Social Links",
    description: "Connect your professional social media profiles",
    estimatedTime: "2 min",
    features: ["LinkedIn", "GitHub", "Twitter", "Custom platforms"]
  },
  {
    icon: Mail,
    title: "Contact Form",
    description: "Set up custom contact forms for inquiries",
    estimatedTime: "3 min",
    features: ["Custom fields", "Form validation", "Submission tracking"]
  }
];

export function PortfolioSetupGuide() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const totalEstimatedTime = setupSteps.reduce((total, step) => {
    const time = parseInt(step.estimatedTime);
    return total + time;
  }, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedCanvas variant="constellation" color="#ffffff" intensity="low" />
      
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full border border-primary/30 mb-6">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Create Your Portfolio
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your professional presence with a stunning, customizable portfolio. 
                Get started in just <span className="text-primary font-semibold">{totalEstimatedTime} minutes</span>.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>~{totalEstimatedTime} min setup</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4 text-primary" />
                <span>Instant preview</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings className="w-4 h-4 text-primary" />
                <span>Fully customizable</span>
              </div>
            </div>
          </div>

          {/* Setup Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setupSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isHovered = hoveredStep === index;
              
              return (
                <div
                  key={index}
                  className="group relative p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold border-2 border-background">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
                    isHovered ? 'scale-110 bg-primary/20' : ''
                  }`}>
                    <StepIcon className={`w-6 h-6 text-primary transition-all duration-300 ${
                      isHovered ? 'scale-110' : ''
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {step.estimatedTime}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Arrow */}
                  <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Ready to get started?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Your professional portfolio is just a few clicks away. 
                Sign in to access the dashboard and begin building your digital presence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <CustomButton
                size="lg"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/auth/login" className="flex items-center gap-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </CustomButton>
              
              <CustomButton
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg border-border hover:border-primary/50"
                asChild
              >
                <a href="/auth/signup">
                  Create Account
                </a>
              </CustomButton>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-border/50">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Customizable</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Setup Cost</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">Possibilities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                Powered by <span className="text-primary font-semibold">NoirKit</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}