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
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
      if (newIndex === currentImageIndex) return;
      setCurrentImageIndex(newIndex);
    },
    [currentImageIndex]
  );

  // Initialize images loaded state
  useEffect(() => {
    setImagesLoaded(new Array(project.images.length).fill(false));
    setImageErrors(new Array(project.images.length).fill(false));
  }, [project.images.length]);

  // Handle image load
  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

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

  // Touch swipe handling for mobile image navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (project.images.length > 1) {
      if (isLeftSwipe) {
        // Swipe left = next image
        const nextIndex = (currentImageIndex + 1) % project.images.length;
        changeImage(nextIndex);
      } else if (isRightSwipe) {
        // Swipe right = previous image
        const prevIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
        changeImage(prevIndex);
      }
    }
  };

  // Handle touch/click for mobile overlay toggle
  const handleCardClick = (e: React.MouseEvent) => {
    // Only toggle overlay if it's not a swipe gesture
    if (touchStart && touchEnd) {
      const distance = Math.abs(touchStart - touchEnd);
      if (distance > minSwipeDistance) {
        return; // It was a swipe, don't toggle overlay
      }
    }
    setIsOverlayVisible(!isOverlayVisible);
  };

  // Determine if overlay should be visible
  const shouldShowOverlay = isHovered || isOverlayVisible;

  return (
    <div
      className="relative aspect-video sm:aspect-video md:aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Image Carousel with Crossfade Transition */}
      <div className="relative w-full h-full">
        {project.images.map((image, index) => (
          <div key={index} className="absolute inset-0">
              <Image
                src={imageErrors[index] ? "/placeholder.svg" : (image || "/placeholder.svg")}
                alt={`${project.name} - Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ 
                  transition: 'opacity 1500ms ease-in-out',
                  opacity: index === currentImageIndex ? 1 : 0,
                  zIndex: index === currentImageIndex ? 10 : 0
                }}
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                quality={85}
              />
              {/* Loading skeleton for images */}
              {!imagesLoaded[index] && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
              )}
            </div>
        ))}

        {/* Image Navigation - Hidden on mobile, visible on desktop when hovered */}
        {project.images.length > 1 && (!isOverlayVisible || isHovered) && (
          <>
            <button
              onClick={prevImage}
              title="Previous image"
              className="hidden sm:flex absolute left-2 bottom-2 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 backdrop-blur-sm border border-white/10 hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={nextImage}
              title="Next image"
              className="hidden sm:flex absolute right-2 bottom-2 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 backdrop-blur-sm border border-white/10 hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            {/* Modern Image Progress Bar - Hidden on mobile */}
            <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
                <span className="text-xs text-white/80">
                  {currentImageIndex + 1}/{project.images.length}
                </span>
                <div className="w-12 bg-white/20 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-2000 ease-in-out"
                    style={{ width: `${((currentImageIndex + 1) / project.images.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Touch Swipe Indicator - Only visible when multiple images */}
        {project.images.length > 1 && (
          <div className={`sm:hidden absolute z-30 transition-all duration-300 ${
            isOverlayVisible 
              ? "bottom-2 left-2" // Move to bottom-left when overlay is active
              : "top-2 right-2"   // Default position when overlay is hidden
          }`}>
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
              <span className="text-xs text-white/80">
                {currentImageIndex + 1}/{project.images.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Permanent Project Name Overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 sm:p-4 z-20">
        <h3 className="text-base sm:text-lg font-bold text-white text-center line-clamp-1">
          {project.name}
        </h3>
      </div>

      {/* Hover Overlay with Description, Tech Stack, and Buttons */}
      <div
        className={`absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col justify-center items-center p-3 sm:p-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 rounded-lg ${
          shouldShowOverlay ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Project Name in Hover Overlay - Hidden on mobile */}
        <h3 className="hidden sm:block text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 text-center line-clamp-1">
          {project.name}
        </h3>
        
        {/* Description - Hidden on mobile */}
        <p className="hidden sm:block text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 text-center line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Icons - Optimized for mobile */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-4 justify-center max-w-full">
          {project.techStack.slice(0, 8).map((tech, index) => {
            const iconPath = getTechIcon(tech);
            return (
              <div
                key={index}
                className="w-8 h-8 sm:w-8 sm:h-8 text-white/80 hover:text-white transition-colors flex-shrink-0"
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
          {project.techStack.length > 8 && (
            <div className="w-8 h-8 sm:w-8 sm:h-8 bg-white/10 rounded flex items-center justify-center text-xs text-white/60">
              +{project.techStack.length - 8}
            </div>
          )}
        </div>

        {/* Action Buttons - Larger and more prominent on mobile */}
        <div className="flex gap-3 flex-wrap justify-center">
          {project.deployLink && (
            <CustomButton
              variant="outline"
              size="sm"
              asChild
              className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20 text-sm px-4 py-2"
            >
              <Link
                href={project.deployLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Live Demo</span>
                <span className="sm:hidden">Demo</span>
              </Link>
            </CustomButton>
          )}
          {project.githubLink && (
            <CustomButton
              variant="outline"
              size="sm"
              asChild
              className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20 text-sm px-4 py-2"
            >
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                Source
              </Link>
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
}
