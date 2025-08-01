"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Mail, Save, GripVertical, Eye, Settings, Phone, MapPin } from "lucide-react"
import { usePortfolioStore } from "@/lib/store"
import type { ContactField } from "@/lib/types"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"

export default function ContactFormPage() {
  const { contactForm, personalInfo, updateContactForm } = usePortfolioStore()
  const { showToast } = useToast()
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [editingField, setEditingField] = useState<ContactField | null>(null)
  const [formData, setFormData] = useState({
    title: "Get In Touch",
    description: "Let's discuss your next project",
    showContactInfo: false,
    fields: [] as ContactField[],
  })
  const [fieldData, setFieldData] = useState<Omit<ContactField, "id">>({
    name: "",
    label: "",
    type: "text",
    required: false,
    placeholder: "",
  })

  useEffect(() => {
    if (contactForm) {
      setFormData({
        title: contactForm.title || "Get In Touch",
        description: contactForm.description || "Let's discuss your next project",
        showContactInfo: contactForm.showContactInfo || false,
        fields: contactForm.fields || [],
      })
    }
  }, [contactForm])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const resetFieldForm = () => {
    setFieldData({
      name: "",
      label: "",
      type: "text",
      required: false,
      placeholder: "",
    })
    setEditingField(null)
  }

  const openFieldModal = (field?: ContactField) => {
    if (field) {
      setEditingField(field)
      setFieldData(field)
    } else {
      resetFieldForm()
    }
    setIsFieldModalOpen(true)
  }

  const closeFieldModal = () => {
    setIsFieldModalOpen(false)
    resetFieldForm()
  }

  const handleSaveForm = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast("Please fill in the form title and description", "error")
      return
    }
    try {
      await updateContactForm(formData)
      showToast("Contact form updated successfully!", "success")
    } catch (error) {
      showToast("Failed to update contact form", "error")
    }
  }

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fieldData.name.trim() || !fieldData.label.trim()) {
      showToast("Please fill in the field name and label", "error")
      return
    }

    // Validate field name (should be lowercase, no spaces)
    const validName = fieldData.name.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (validName !== fieldData.name) {
      setFieldData((prev) => ({ ...prev, name: validName }))
      showToast("Field name has been adjusted to be lowercase and contain only letters and numbers", "info")
      return
    }

    // Check for duplicate field names
    const existingField = formData.fields.find((f) => f.name === fieldData.name && f.id !== editingField?.id)
    if (existingField) {
      showToast("A field with this name already exists. Please choose a different name.", "error")
      return
    }

    if (editingField) {
      // Update existing field
      setFormData((prev) => ({
        ...prev,
        fields: prev.fields.map((f) => (f.id === editingField.id ? { ...fieldData, id: editingField.id } : f)),
      }))
    } else {
      // Add new field
      setFormData((prev) => ({
        ...prev,
        fields: [...prev.fields, { ...fieldData, id: generateId() }],
      }))
    }
    closeFieldModal()
  }

  const handleDeleteField = (fieldId: string) => {
    if (confirm("Are you sure you want to delete this field?")) {
      setFormData((prev) => ({
        ...prev,
        fields: prev.fields.filter((f) => f.id !== fieldId),
      }))
    }
  }

  const moveField = (fieldId: string, direction: "up" | "down") => {
    const currentIndex = formData.fields.findIndex((f) => f.id === fieldId)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= formData.fields.length) return

    const newFields = [...formData.fields]
    const [movedField] = newFields.splice(currentIndex, 1)
    newFields.splice(newIndex, 0, movedField)

    setFormData((prev) => ({ ...prev, fields: newFields }))
  }

  const fieldTypeOptions = [
    { value: "text", label: "Text Input" },
    { value: "email", label: "Email Input" },
    { value: "textarea", label: "Text Area" },
  ]

  const renderPreviewField = (field: ContactField) => {
    const commonProps = {
      placeholder: field.placeholder || `Enter your ${field.label.toLowerCase()}`,
      required: field.required,
    }

    switch (field.type) {
      case "email":
        return <CustomInput type="email" {...commonProps} />
      case "textarea":
        return <CustomInput variant="textarea" rows={4} {...commonProps} />
      default:
        return <CustomInput {...commonProps} />
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-mono mb-2">Contact Form Builder</h1>
        <p className="text-gray-400">Customize your contact form fields and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Settings */}
        <div className="space-y-6">
          <div className="border border-white/20 rounded-xl p-6 bg-gray-900/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Form Settings
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Form Title</Label>
                <CustomInput
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Get In Touch"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Form Description</Label>
                <CustomInput
                  variant="textarea"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Let's discuss your next project"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showContactInfo"
                  checked={formData.showContactInfo}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, showContactInfo: checked }))}
                />
                <Label htmlFor="showContactInfo" className="text-white">
                  Show my contact information in the modal
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <CustomButton onClick={handleSaveForm}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Form Settings
                </CustomButton>
                <CustomButton variant="outline" onClick={() => setIsPreviewOpen(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Form
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="border border-white/20 rounded-xl p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Form Fields
              </h2>
              <CustomButton size="sm" onClick={() => openFieldModal()}>
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </CustomButton>
            </div>

            <div className="space-y-3">
              {formData.fields.length === 0 ? (
                <div className="text-center py-8 border border-white/10 rounded-lg bg-gray-900/30">
                  <Mail className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-4">No form fields yet</p>
                  <CustomButton size="sm" onClick={() => openFieldModal()}>
                    Add Your First Field
                  </CustomButton>
                </div>
              ) : (
                formData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-white/10 rounded-lg p-4 bg-gray-900/30 hover:bg-gray-900/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <CustomButton
                            variant="ghost"
                            size="sm"
                            onClick={() => moveField(field.id, "up")}
                            disabled={index === 0}
                            className="h-4 p-0"
                          >
                            <GripVertical className="w-3 h-3" />
                          </CustomButton>
                          <CustomButton
                            variant="ghost"
                            size="sm"
                            onClick={() => moveField(field.id, "down")}
                            disabled={index === formData.fields.length - 1}
                            className="h-4 p-0"
                          >
                            <GripVertical className="w-3 h-3" />
                          </CustomButton>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{field.label}</h4>
                            {field.required && (
                              <span className="text-xs text-red-400 bg-red-400/20 px-1 rounded">*</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{field.type}</span>
                            <span>•</span>
                            <span>name: {field.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <CustomButton variant="ghost" size="sm" onClick={() => openFieldModal(field)}>
                          <Edit className="w-3 h-3" />
                        </CustomButton>
                        <CustomButton variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                          <Trash2 className="w-3 h-3" />
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <div className="border border-white/20 rounded-xl p-6 bg-gray-900/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Preview
            </h2>

            <div className="border border-white/10 rounded-lg p-6 bg-black/50">
              <div className="mb-4">
                <h3 className="text-xl font-mono">{formData.title || "Form Title"}</h3>
                <p className="text-gray-400 text-sm mt-1">{formData.description || "Form description"}</p>
              </div>

              {/* Contact Info Preview */}
              {formData.showContactInfo &&
                personalInfo &&
                (personalInfo.email || personalInfo.phone || personalInfo.location) && (
                  <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-sm font-medium mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      {personalInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{personalInfo.email}</span>
                        </div>
                      )}
                      {personalInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{personalInfo.phone}</span>
                        </div>
                      )}
                      {personalInfo.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{personalInfo.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              <div className="space-y-4">
                {formData.fields.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">Add fields to see the preview</p>
                ) : (
                  formData.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="text-white">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </Label>
                      {renderPreviewField(field)}
                    </div>
                  ))
                )}

                {formData.fields.length > 0 && (
                  <CustomButton className="w-full mt-6">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field Modal */}
      <Dialog open={isFieldModalOpen} onOpenChange={closeFieldModal}>
        <DialogContent className="max-w-2xl bg-black border border-white text-white">
          <DialogHeader>
            <DialogTitle>{editingField ? "Edit Field" : "Add New Field"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveField} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fieldName">Field Name *</Label>
                <CustomInput
                  id="fieldName"
                  value={fieldData.name}
                  onChange={(e) => setFieldData((prev) => ({ ...prev, name: e.target.value.toLowerCase() }))}
                  placeholder="e.g., name, email, message"
                  required
                />
                <p className="text-xs text-gray-500">Used internally, lowercase letters and numbers only</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldLabel">Field Label *</Label>
                <CustomInput
                  id="fieldLabel"
                  value={fieldData.label}
                  onChange={(e) => setFieldData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Your Name, Email Address"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldType">Field Type</Label>
              <Select
                value={fieldData.type}
                onValueChange={(value: "text" | "email" | "textarea") =>
                  setFieldData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="bg-black text-white border border-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border border-white">
                  {fieldTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldPlaceholder">Placeholder Text</Label>
              <CustomInput
                id="fieldPlaceholder"
                value={fieldData.placeholder}
                onChange={(e) => setFieldData((prev) => ({ ...prev, placeholder: e.target.value }))}
                placeholder="e.g., Enter your name here..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="fieldRequired"
                checked={fieldData.required}
                onCheckedChange={(checked) => setFieldData((prev) => ({ ...prev, required: checked }))}
              />
              <Label htmlFor="fieldRequired" className="text-white">
                Required field
              </Label>
            </div>

            <div className="flex gap-4">
              <CustomButton type="submit">
                <Save className="w-4 h-4 mr-2" />
                {editingField ? "Update Field" : "Add Field"}
              </CustomButton>
              <CustomButton type="button" variant="outline" onClick={closeFieldModal}>
                Cancel
              </CustomButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md bg-black border border-white text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-mono">{formData.title}</DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <p className="text-gray-400 text-sm">{formData.description}</p>
          </div>

          {/* Contact Info in Preview */}
          {formData.showContactInfo &&
            personalInfo &&
            (personalInfo.email || personalInfo.phone || personalInfo.location) && (
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  {personalInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          <div className="space-y-4">
            {formData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-white">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </Label>
                {renderPreviewField(field)}
              </div>
            ))}

            {formData.fields.length > 0 && (
              <CustomButton className="w-full mt-6">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </CustomButton>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
