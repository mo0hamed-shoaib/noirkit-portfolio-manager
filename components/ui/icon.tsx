"use client";

import * as React from "react";
import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps extends LucideProps {
  icon: LucideIcon;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "muted" | "primary" | "success" | "warning" | "error";
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const variantClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export function Icon({
  icon: IconComponent,
  size = "md",
  variant = "default",
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        "transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

// Predefined icon components for common use cases
export function SocialIcon({
  icon: IconComponent,
  className,
  ...props
}: Omit<IconProps, "icon"> & { icon: LucideIcon }) {
  return (
    <Icon
      icon={IconComponent}
      size="sm"
      variant="muted"
      className={cn(
        "hover:text-foreground transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

export function TechIcon({
  icon: IconComponent,
  className,
  ...props
}: Omit<IconProps, "icon"> & { icon: LucideIcon }) {
  return (
    <Icon
      icon={IconComponent}
      size="md"
      variant="default"
      className={cn(
        "hover:scale-110 transition-transform duration-200",
        className
      )}
      {...props}
    />
  );
}

export function ActionIcon({
  icon: IconComponent,
  className,
  ...props
}: Omit<IconProps, "icon"> & { icon: LucideIcon }) {
  return (
    <Icon
      icon={IconComponent}
      size="sm"
      variant="default"
      className={cn(
        "hover:text-primary transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}
