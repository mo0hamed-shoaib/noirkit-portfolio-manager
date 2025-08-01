"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "info", duration?: number) => void
}

let toastContext: ToastContextType | null = null

export const useToast = () => {
  if (!toastContext) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return toastContext
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: "success" | "error" | "info", duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  toastContext = { showToast }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-900/90 border-green-500/50"
      case "error":
        return "bg-red-900/90 border-red-500/50"
      case "info":
        return "bg-blue-900/90 border-blue-500/50"
    }
  }

  return (
    <div
      className={`
        ${getBgColor()}
        border rounded-lg p-4 min-w-[300px] max-w-[400px] backdrop-blur-sm
        transform transition-all duration-300 ease-in-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-white text-sm">{toast.message}</p>
        </div>
        <button onClick={handleRemove} className="text-gray-400 hover:text-white transition-colors duration-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
