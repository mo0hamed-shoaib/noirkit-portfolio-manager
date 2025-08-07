"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link"
    | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  loading?: boolean;
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        className={cn(
          // Base styles with more rounded corners and touch-friendly sizing
          "transition-all duration-200 font-medium rounded-full",
          // Ensure minimum touch target size (44px) for mobile (except for icon variant)
          variant !== "icon" && "min-h-[44px] min-w-[44px]",
          // Default variant - black bg, white text, white border
          variant === "default" &&
            "bg-black text-white border border-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-black dark:hover:bg-black dark:hover:text-white",
          // Outline variant - transparent bg, white text, white border
          variant === "outline" &&
            "bg-transparent text-foreground border border-border hover:bg-foreground hover:text-background",
          // Ghost variant - no border
          variant === "ghost" &&
            "bg-transparent text-foreground hover:bg-foreground hover:text-background border-0",
          // Destructive variant
          variant === "destructive" &&
            "bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700",
          // Secondary variant
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/80",
          // Link variant
          variant === "link" &&
            "bg-transparent text-foreground underline-offset-4 hover:underline border-0",
          // Icon variant - compact icon-only button
          variant === "icon" &&
            "bg-transparent text-foreground border border-border hover:bg-foreground hover:text-background p-0",
          // Size variants with touch-friendly dimensions
          size === "sm" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-lg",
          size === "icon" && "h-12 w-12 p-0",
          size === "default" && "h-11 px-6",
          // Enhanced hover and focus states for better accessibility
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          "active:scale-95",
          // Loading state
          loading && "opacity-50 cursor-not-allowed",
          className
        )}
        variant="outline"
        size={size}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);
CustomButton.displayName = "CustomButton";

export { CustomButton };
