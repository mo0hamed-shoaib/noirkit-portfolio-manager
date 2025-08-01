"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <Button
        className={cn(
          // Base styles with more rounded corners and touch-friendly sizing
          "transition-all duration-200 font-medium rounded-full",
          // Ensure minimum touch target size (44px) for mobile
          "min-h-[44px] min-w-[44px]",
          // Default variant - black bg, white text, white border
          variant === "default" &&
            "bg-black text-white border border-white hover:bg-white hover:text-black",
          // Outline variant - transparent bg, white text, white border
          variant === "outline" &&
            "bg-transparent text-white border border-white hover:bg-white hover:text-black",
          // Ghost variant - no border
          variant === "ghost" &&
            "bg-transparent text-white hover:bg-white hover:text-black border-0",
          // Size variants with touch-friendly dimensions
          size === "sm" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-lg",
          size === "icon" && "h-12 w-12 p-0",
          size === "default" && "h-11 px-6",
          // Enhanced hover and focus states for better accessibility
          "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black",
          "active:scale-95",
          className
        )}
        variant="outline"
        size={size}
        ref={ref}
        {...props}
      />
    );
  }
);
CustomButton.displayName = "CustomButton";

export { CustomButton };
