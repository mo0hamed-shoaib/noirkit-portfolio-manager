"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-white/10", className)} {...props} />
}

export function ProjectCardSkeleton() {
  return (
    <div className="aspect-square bg-gray-900 rounded-lg p-4">
      <Skeleton className="w-full h-full" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="w-15 h-15 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
