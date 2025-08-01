"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-white/5 via-white/10 to-white/5",
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="aspect-square bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="space-y-3">
        <Skeleton className="w-full h-32 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Skeleton className="w-15 h-15 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-600 border-2 border-black rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function TechStackSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-3 bg-gray-900/30 rounded-lg border border-white/10"
          >
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialLinksSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-3 bg-gray-900/30 rounded-lg border border-white/10"
          >
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AchievementsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-gray-900/30 rounded-lg border border-white/10"
          >
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
