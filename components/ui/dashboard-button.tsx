import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

export function DashboardButton({
  children,
  onClick,
  disabled = false,
  className,
  variant = "default",
  size = "default",
  asChild = false,
  type,
  title,
  ...props
}: DashboardButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size={size}
      asChild={asChild}
      type={type}
      title={title}
      className={cn(
        "bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono tracking-wide transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
