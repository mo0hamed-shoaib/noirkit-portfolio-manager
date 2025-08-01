"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "input" | "textarea"
  rows?: number
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, variant = "input", rows, ...props }, ref) => {
    const baseStyles =
      "bg-black text-white border border-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-white/60 focus:border-white/60 transition-all duration-200"

    if (variant === "textarea") {
      return <Textarea className={cn(baseStyles, "resize-none", className)} rows={rows} {...(props as any)} />
    }

    return <Input className={cn(baseStyles, className)} ref={ref} {...props} />
  },
)
CustomInput.displayName = "CustomInput"

export { CustomInput }
