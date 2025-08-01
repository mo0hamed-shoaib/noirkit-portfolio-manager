"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CustomButton } from "./ui/custom-button"
import { cn } from "@/lib/utils"

interface CarouselProps {
  children: React.ReactNode[]
  className?: string
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function Carousel({
  children,
  className,
  showDots = false,
  autoPlay = false,
  autoPlayInterval = 3000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? children.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === children.length - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (autoPlay && children.length > 1) {
      const interval = setInterval(goToNext, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayInterval, children.length])

  if (children.length === 0) return null

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {children.length > 1 && (
        <>
          <CustomButton
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </CustomButton>

          <CustomButton
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="w-4 h-4" />
          </CustomButton>

          {showDots && (
            <div className="flex justify-center mt-4 space-x-2">
              {children.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-white" : "bg-gray-600",
                  )}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
