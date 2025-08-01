"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Code, Save, X, Eye, EyeOff, GripVertical } from "lucide-react"
import { usePortfolioStore } from "@/lib/store"
import type { TechStack } from "@/lib/types"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SortableList } from "@/components/ui/sortable-list"
import { useToast } from "@/components/ui/toast"
import { usePageTitle } from "@/lib/hooks/use-page-title"

export default function TechStackPage() {
  const { techStack, addTechStack, updateTechStack, deleteTechStack, reorderTechStack } = usePortfolioStore()
  const { showToast } = useToast()
  
  // Set dynamic page title
  usePageTitle({ 
    title: "Tech Stack",
    prefix: "Dashboard"
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<TechStack | null>(null)
  const [showSvgPreview, setShowSvgPreview] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [formData, setFormData] = useState<Omit<TechStack, "id">>({
    name: "",
    icon: "",
    order: techStack.length + 1,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      icon: "",
      order: techStack.length + 1,
    })
    setEditingTech(null)
    setShowSvgPreview(false)
  }

  const openModal = (tech?: TechStack) => {
    if (tech) {
      setEditingTech(tech)
      setFormData(tech)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.icon.trim()) {
      showToast("Please fill in all required fields", "error")
      return
    }

    try {
      if (editingTech) {
        await updateTechStack(editingTech.id, formData)
        showToast("Technology updated successfully!", "success")
      } else {
        await addTechStack(formData)
        showToast("Technology added successfully!", "success")
      }
      closeModal()
    } catch (error) {
      showToast("Failed to save technology", "error")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this technology?")) {
      try {
        await deleteTechStack(id)
        showToast("Technology deleted successfully!", "success")
      } catch (error) {
        showToast("Failed to delete technology", "error")
      }
    }
  }

  const handleReorder = async (reorderedTechStack: TechStack[]) => {
    try {
      await reorderTechStack(reorderedTechStack)
      showToast("Technologies reordered successfully!", "success")
    } catch (error) {
      showToast("Failed to reorder technologies", "error")
    }
  }

  const renderIcon = (iconPath: string, className = "w-8 h-8") => {
    if (!iconPath) return null
  
    // Check if it looks like a full SVG
    const isFullSvg = iconPath.trim().startsWith("<svg")
  
    try {
      if (isFullSvg) {
        return (
          <div
            className={className}
            style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.3))" }}
            dangerouslySetInnerHTML={{ __html: iconPath }}
          />
        )
      }
  
      // Else assume it's a valid path
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.3))" }}
        >
          <path d={iconPath} />
        </svg>
      )
    } catch {
      return (
        <div className={`${className} bg-red-500/20 border border-red-500 rounded flex items-center justify-center`}>
          <X className="w-4 h-4 text-red-500" />
        </div>
      )
    }
  }
  

  const renderTechStackItem = (tech: TechStack, index: number, isDragging: boolean) => (
    <div
      className={`border border-white/20 rounded-xl p-4 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-200 group ${
        isDragging ? "opacity-75 scale-105" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        {isReordering && (
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <div className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-200">
          {renderIcon(tech.icon, "w-full h-full")}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">{tech.name}</h3>
        </div>
        {!isReordering && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <CustomButton variant="ghost" size="sm" onClick={() => openModal(tech)}>
              <Edit className="w-3 h-3" />
            </CustomButton>
            <CustomButton variant="ghost" size="sm" onClick={() => handleDelete(tech.id)}>
              <Trash2 className="w-3 h-3" />
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  )

  // Popular tech stack icons for quick selection
  const popularTechIcons = [
    {
      name: "React",
      icon: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.014-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.014 1.36-.034-.44.572-.895 1.095-1.36 1.56-.465-.467-.92-.992-1.36-1.56z",
    },
    {
      name: "TypeScript",
      icon: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
    },
    {
      name: "JavaScript",
      icon: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z",
    },
    {
      name: "Node.js",
      icon: "M11.435 1.587l-8.201 4.735c-.292.168-.473.48-.473.817v9.721c0 .337.181.649.473.817l8.201 4.735c.292.168.649.168.941 0l8.201-4.735c.292-.168.473-.48.473-.817V7.139c0-.337-.181-.649-.473-.817L12.376 1.587c-.292-.168-.649-.168-.941 0zM12 2.542l7.333 4.235v8.446L12 19.458l-7.333-4.235V6.777L12 2.542zm-1.732 4.301c-2.753 0-4.429 1.188-4.429 3.139 0 2.069 1.676 2.91 4.429 2.91h.346c1.387 0 2.078.462 2.078 1.386 0 .924-.691 1.386-2.078 1.386h-.346c-1.387 0-2.078-.462-2.078-1.386H6.458c0 1.951 1.676 3.139 4.429 3.139h.346c2.753 0 4.429-1.188 4.429-3.139 0-2.069-1.676-2.91-4.429-2.91h-.346c-1.387 0-2.078-.462-2.078-1.386 0-.924.691-1.386 2.078-1.386h.346c1.387 0 2.078.462 2.078 1.386h1.732c0-1.951-1.676-3.139-4.429-3.139h-.346z",
    },
    {
      name: "Python",
      icon: "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z",
    },
    {
      name: "Next.js",
      icon: "M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C19.777 4.249 16.569.463 12.22-.938a11.351 11.351 0 0 0-2.647-.526c-.244-.018-1.943-.006-2.001.007zM16.503 7.036c.157-.007.72-.003.814.008.033.004.66.34 2.548 1.36 1.48.8 2.695 1.458 2.701 1.462.009.008-2.321 3.496-2.339 3.496-.007 0-1.03-.553-2.274-1.229l-2.263-1.229-.54-.297-.55-.302-.001-.533V7.036h.004z",
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-mono mb-2">Tech Stack</h1>
          <p className="text-gray-400">Manage your technology stack and skills</p>
        </div>
        <div className="flex gap-4">
          {techStack.length > 0 && (
            <CustomButton variant={isReordering ? "default" : "outline"} onClick={() => setIsReordering(!isReordering)}>
              {isReordering ? "Done" : "Reorder"}
            </CustomButton>
          )}
          <CustomButton onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Technology
          </CustomButton>
        </div>
      </div>

      {/* Tech Stack Grid */}
      {isReordering ? (
        <SortableList
          items={techStack}
          onReorder={handleReorder}
          renderItem={renderTechStackItem}
          keyExtractor={(tech) => tech.id}
          className="space-y-4"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {techStack.map((tech) => (
            <div
              key={tech.id}
              className="border border-white/20 rounded-xl p-4 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-200">
                  {renderIcon(tech.icon, "w-full h-full")}
                </div>
                <h3 className="text-sm font-medium text-center truncate w-full">{tech.name}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CustomButton variant="ghost" size="sm" onClick={() => openModal(tech)}>
                    <Edit className="w-3 h-3" />
                  </CustomButton>
                  <CustomButton variant="ghost" size="sm" onClick={() => handleDelete(tech.id)}>
                    <Trash2 className="w-3 h-3" />
                  </CustomButton>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {techStack.length === 0 && (
            <div className="col-span-full border border-white/20 rounded-xl p-12 text-center bg-gray-900/30">
              <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No technologies added yet</p>
              <CustomButton onClick={() => openModal()}>Add Your First Technology</CustomButton>
            </div>
          )}
        </div>
      )}

      {/* Tech Stack Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl bg-black border border-white text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTech ? "Edit Technology" : "Add New Technology"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Technology Name *</Label>
              <CustomInput
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., React, TypeScript, Node.js"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="icon">SVG Icon Path *</Label>
                <CustomButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSvgPreview(!showSvgPreview)}
                >
                  {showSvgPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {showSvgPreview ? "Hide" : "Show"} Preview
                </CustomButton>
              </div>

              <CustomInput
                variant="textarea"
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="Paste the SVG path data here (the 'd' attribute content)"
                rows={4}
                required
              />

              {showSvgPreview && formData.icon && (
                <div className="border border-white/20 rounded-lg p-4 bg-gray-900/50">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <div className="flex items-center justify-center">{renderIcon(formData.icon, "w-16 h-16")}</div>
                </div>
              )}
            </div>

            {/* Popular Icons Quick Select */}
            <div className="space-y-4">
              <Label>Quick Select Popular Technologies</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {popularTechIcons.map((tech) => (
                  <CustomButton
                    key={tech.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-2 h-auto py-3"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        name: tech.name,
                        icon: tech.icon,
                      }))
                    }
                  >
                    {renderIcon(tech.icon, "w-6 h-6")}
                    <span className="text-xs">{tech.name}</span>
                  </CustomButton>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <CustomButton type="submit">
                <Save className="w-4 h-4 mr-2" />
                {editingTech ? "Update Technology" : "Add Technology"}
              </CustomButton>
              <CustomButton type="button" variant="outline" onClick={closeModal}>
                Cancel
              </CustomButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
