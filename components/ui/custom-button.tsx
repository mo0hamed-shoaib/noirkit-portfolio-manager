"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <Button
        className={cn(
          // Base styles with more rounded corners
          "transition-all duration-200 font-medium rounded-full",
          // Default variant - black bg, white text, white border
          variant === "default" && "bg-black text-white border border-white hover:bg-white hover:text-black",
          // Outline variant - transparent bg, white text, white border
          variant === "outline" && "bg-transparent text-white border border-white hover:bg-white hover:text-black",
          // Ghost variant - no border
          variant === "ghost" && "bg-transparent text-white hover:bg-white hover:text-black border-0",
          className,
        )}
        variant="outline"
        size={size}
        ref={ref}
        {...props}
      />
    )
  },
)
CustomButton.displayName = "CustomButton"

export { CustomButton }
