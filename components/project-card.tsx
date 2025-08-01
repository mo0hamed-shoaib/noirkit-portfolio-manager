"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { Project, TechStack } from "@/lib/types";
import { CustomButton } from "./ui/custom-button";

interface ProjectCardProps {
  project: Project;
  techStackIcons: TechStack[];
}

export function ProjectCard({ project, techStackIcons }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const renderIcon = (iconPath: string, className = "w-5 h-5") => {
    if (!iconPath) return null;

    // Check if it looks like a full SVG
    const isFullSvg = iconPath.trim().startsWith("<svg");

    try {
      if (isFullSvg) {
        return (
          <div
            className={className}
            style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.3))" }}
            dangerouslySetInnerHTML={{ __html: iconPath }}
          />
        );
      }

      // Else assume it's a valid path
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.3))" }}
        >
          <path d={iconPath} />
        </svg>
      );
    } catch {
      return (
        <div
          className={`${className} bg-red-500/20 border border-red-500 rounded flex items-center justify-center`}
        >
          <X className="w-4 h-4 text-red-500" />
        </div>
      );
    }
  };

  const getTechIcon = (techName: string) => {
    const tech = techStackIcons.find(
      (t) => t.name.toLowerCase() === techName.toLowerCase()
    );
    return tech?.icon;
  };

  const changeImage = useCallback(
    (newIndex: number) => {
      if (isTransitioning || newIndex === currentImageIndex) return;

      setIsTransitioning(true);
      setCurrentImageIndex(newIndex);

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    },
    [isTransitioning, currentImageIndex]
  );

  // Auto-switch images every 5 seconds
  useEffect(() => {
    if (project.images.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentImageIndex + 1) % project.images.length;
        changeImage(nextIndex);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [project.images.length, currentImageIndex, changeImage]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentImageIndex + 1) % project.images.length;
    changeImage(nextIndex);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex =
      (currentImageIndex - 1 + project.images.length) % project.images.length;
    changeImage(prevIndex);
  };

  const goToImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    changeImage(index);
  };

  return (
    <div
      className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel with Crossfade Transition */}
      <div className="relative w-full h-full">
        {project.images.map((image, index) => (
          <Image
            key={index}
            src={image || "/placeholder.svg"}
            alt={`${project.name} - Image ${index + 1}`}
            fill
            className={`object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* Image Navigation - Only show if multiple images */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              title="Previous image"
              className="absolute left-2 bottom-2 w-6 h-6 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 backdrop-blur-sm border border-white/10 hover:scale-105"
            >
              <ChevronLeft className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={nextImage}
              title="Next image"
              className="absolute right-2 bottom-2 w-6 h-6 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 backdrop-blur-sm border border-white/10 hover:scale-105"
            >
              <ChevronRight className="w-3 h-3 text-white" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(e, index)}
                  title={`Go to image ${index + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Hover Overlay with Title, Description, Tech Stack, and Buttons */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-4 transition-opacity duration-300 z-20 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <h3 className="text-xl font-bold text-white mb-2 text-center">
          {project.name}
        </h3>
        <p className="text-gray-300 text-sm mb-4 text-center line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Icons */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {project.techStack.map((tech, index) => {
            const iconPath = getTechIcon(tech);
            return (
              <div
                key={index}
                className="w-8 h-8 text-white/80 hover:text-white transition-colors"
                title={tech}
              >
                {iconPath ? (
                  renderIcon(iconPath, "w-full h-full")
                ) : (
                  <div className="w-full h-full bg-white/20 rounded flex items-center justify-center text-xs font-bold">
                    {tech.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {project.deployLink && (
            <CustomButton size="sm" asChild className="shadow-lg">
              <Link href={project.deployLink} target="_blank">
                <ExternalLink className="w-4 h-4 mr-1" />
                Live Demo
              </Link>
            </CustomButton>
          )}
          {project.githubLink && (
            <CustomButton
              variant="outline"
              size="sm"
              asChild
              className="shadow-lg"
            >
              <Link href={project.githubLink} target="_blank">
                <Github className="w-4 h-4 mr-1" />
                Source
              </Link>
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
}
