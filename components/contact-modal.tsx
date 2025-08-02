"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Mail, Phone, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomInput } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { usePortfolioStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { contactForm, personalInfo, fetchAllData } = usePortfolioStore();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && !contactForm) {
      fetchAllData();
    }
  }, [isOpen, contactForm, fetchAllData]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setFormErrors({});
      setTouchedFields(new Set());
      setSubmitStatus("idle");
    }
  }, [isOpen]);

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        break;
      case "phone":
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
          return "Please enter a valid phone number";
        }
        break;
      case "message":
        if (value.length < 10) {
          return "Message must be at least 10 characters long";
        }
        if (value.length > 1000) {
          return "Message must be less than 1000 characters";
        }
        break;
    }

    return "";
  };

  const validateForm = (): boolean => {
    const fieldsToRender =
      contactForm?.fields && contactForm.fields.length > 0
        ? contactForm.fields
        : defaultFields;
    const errors: FormErrors = {};

    fieldsToRender.forEach((field) => {
      const error = validateField(field.name, formData[field.name] || "");
      if (error) {
        errors[field.name] = error;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set([...prev, fieldName]));
    const error = validateField(fieldName, formData[fieldName] || "");
    if (error) {
      setFormErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalInfo?.id) return;

    // Validate form
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioOwnerId: personalInfo.id,
          formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({});
        setFormErrors({});
        setTouchedFields(new Set());
        showToast("Message sent successfully!", "success");
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitStatus("error");
        showToast(errorData.message || "Failed to send message", "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const hasError = touchedFields.has(field.name) && formErrors[field.name];
    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder || "",
      required: field.required,
      value: formData[field.name] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleInputChange(field.name, e.target.value),
      onBlur: () => handleBlur(field.name),
      className: hasError ? "border-red-500 focus:border-red-500" : "",
    };

    switch (field.type) {
      case "textarea":
        return (
          <div className="space-y-1">
            <CustomInput variant="textarea" {...commonProps} rows={4} />
            {hasError && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" />
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
      case "email":
        return (
          <div className="space-y-1">
            <CustomInput {...commonProps} type="email" />
            {hasError && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" />
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-1">
            <CustomInput {...commonProps} type="text" />
            {hasError && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" />
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
    }
  };

  // Default contact form if none is configured
  const defaultFields = [
    {
      id: "1",
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Your name",
    },
    {
      id: "2",
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "your@email.com",
    },
    {
      id: "3",
      name: "message",
      label: "Message",
      type: "textarea",
      required: true,
      placeholder: "Your message",
    },
  ];

  const fieldsToRender =
    contactForm?.fields && contactForm.fields.length > 0
      ? contactForm.fields
      : defaultFields;

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
            <p className="text-gray-400 text-sm leading-relaxed">
              {contactForm.description}
            </p>
          )}

          {submitStatus === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-green-400 text-lg font-medium mb-2">
                Message Sent Successfully!
              </div>
              <p className="text-gray-400">
                Thank you for reaching out. I'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {fieldsToRender.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-white text-sm font-medium"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </Label>
                  {renderField(field)}
                </div>
              ))}

              {contactForm?.showContactInfo && personalInfo && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <h3 className="text-sm font-medium text-white mb-3">
                    Contact Information
                  </h3>
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

              <CustomButton
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                className="w-full mt-6 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </CustomButton>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
