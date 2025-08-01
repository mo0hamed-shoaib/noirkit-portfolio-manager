"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Mail, Phone, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { usePortfolioStore } from "@/lib/store"
import { useToast } from "@/components/ui/toast"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { contactForm, personalInfo, fetchAllData } = usePortfolioStore()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    if (isOpen && !contactForm) {
      fetchAllData()
    }
  }, [isOpen, contactForm, fetchAllData])

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personalInfo?.id) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioOwnerId: personalInfo.id,
          formData,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({})
        showToast("Message sent successfully!", "success")
        setTimeout(() => {
          onClose()
          setSubmitStatus("idle")
        }, 2000)
      } else {
        setSubmitStatus("error")
        showToast("Failed to send message", "error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
      showToast("Failed to send message", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: any) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder || "",
      required: field.required,
      value: formData[field.name] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleInputChange(field.name, e.target.value),
    }

    switch (field.type) {
      case "textarea":
        return <CustomInput variant="textarea" {...commonProps} rows={4} />
      case "email":
        return <CustomInput {...commonProps} type="email" />
      default:
        return <CustomInput {...commonProps} type="text" />
    }
  }

  // Default contact form if none is configured
  const defaultFields = [
    { id: "1", name: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
    { id: "2", name: "email", label: "Email", type: "email", required: true, placeholder: "your@email.com" },
    { id: "3", name: "message", label: "Message", type: "textarea", required: true, placeholder: "Your message" },
  ]

  const fieldsToRender = contactForm?.fields && contactForm.fields.length > 0 ? contactForm.fields : defaultFields

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black border border-white/20 text-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-xl font-mono text-white font-bold">
            {contactForm?.title || "Get In Touch"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {contactForm?.description && (
            <p className="text-gray-400 text-sm leading-relaxed">{contactForm.description}</p>
          )}

          {submitStatus === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-green-400 text-lg font-medium mb-2">Message Sent Successfully!</div>
              <p className="text-gray-400">Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {fieldsToRender.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name} className="text-white text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}

              {contactForm?.showContactInfo && personalInfo && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <h3 className="text-sm font-medium text-white mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    {personalInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{personalInfo.email}</span>
                      </div>
                    )}
                    {personalInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{personalInfo.phone}</span>
                      </div>
                    )}
                    {personalInfo.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{personalInfo.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <CustomButton type="submit" disabled={isSubmitting} className="w-full mt-6">
                {isSubmitting ? "Sending..." : "Send Message"}
              </CustomButton>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
