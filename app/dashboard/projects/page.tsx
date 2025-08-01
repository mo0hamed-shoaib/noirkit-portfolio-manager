"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Edit, Trash2, ExternalLink, Github, Upload, X, GripVertical } from "lucide-react"
import { usePortfolioStore } from "@/lib/store"
import type { Project } from "@/lib/types"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SortableList } from "@/components/ui/sortable-list"
import { useToast } from "@/components/ui/toast"
import { usePageTitle } from "@/lib/hooks/use-page-title"
import Image from "next/image"

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, reorderProjects, techStack } = usePortfolioStore()
  const { showToast } = useToast()
  
  // Set dynamic page title
  usePageTitle({ 
    title: "Projects",
    prefix: "Dashboard"
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    deployLink: "",
    githubLink: "",
    techStack: [],
    images: [],
    order: projects.length + 1,
  })
  const [techStackInput, setTechStackInput] = useState("")

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      deployLink: "",
      githubLink: "",
      techStack: [],
      images: [],
      order: projects.length + 1,
    })
    setTechStackInput("")
    setEditingProject(null)
  }

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData(project)
      setTechStackInput((project.techStack || []).join(", "))
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
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData)
        showToast("Project updated successfully!", "success")
      } else {
        await addProject(formData)
        showToast("Project added successfully!", "success")
      }
      closeModal()
    } catch (error) {
      showToast("Failed to save project", "error")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id)
        showToast("Project deleted successfully!", "success")
      } catch (error) {
        showToast("Failed to delete project", "error")
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleTechStackChange = (value: string) => {
    setTechStackInput(value)
    const techArray = value
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, techStack: techArray }))
  }

  const handleReorder = async (reorderedProjects: Project[]) => {
    try {
      await reorderProjects(reorderedProjects)
      showToast("Projects reordered successfully!", "success")
    } catch (error) {
      showToast("Failed to reorder projects", "error")
    }
  }

  const renderTechIcon = (techName: string) => {
    const tech = (techStack || []).find((t) => t.name.toLowerCase() === techName.toLowerCase())
    if (tech?.icon) {
      // Handle full SVG or just path data
      if (tech.icon.includes("<svg")) {
        return <div className="w-4 h-4" dangerouslySetInnerHTML={{ __html: tech.icon }} />
      } else {
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d={tech.icon} />
          </svg>
        )
      }
    }
    return <span className="text-xs font-bold">{techName.charAt(0).toUpperCase()}</span>
  }

  const renderProjectItem = (project: Project, index: number, isDragging: boolean) => (
    <div
      className={`border border-white/20 rounded-xl p-4 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-200 group ${
        isDragging ? "opacity-75 scale-105" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {isReordering && (
          <div className="cursor-grab active:cursor-grabbing mt-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}

        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 w-24">
          {project.images && project.images.length > 0 && project.images[0] ? (
            <Image
              src={project.images[0] || "/placeholder.svg"}
              alt={project.name}
              width={96}
              height={54}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No image</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2 truncate">{project.name}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {(project.techStack || []).slice(0, 3).map((tech, techIndex) => (
              <div key={techIndex} className="flex items-center gap-1 px-2 py-1 bg-white/10 text-xs rounded">
                {renderTechIcon(tech)}
                <span>{tech}</span>
              </div>
            ))}
            {(project.techStack || []).length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-xs rounded">
                +{(project.techStack || []).length - 3} more
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {project.deployLink && (
                <CustomButton variant="ghost" size="sm" asChild>
                  <a href={project.deployLink} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CustomButton>
              )}
              {project.githubLink && (
                <CustomButton variant="ghost" size="sm" asChild>
                  <a href={project.githubLink} target="_blank" rel="noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </CustomButton>
              )}
            </div>
            {!isReordering && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CustomButton variant="ghost" size="sm" onClick={() => openModal(project)}>
                  <Edit className="w-4 h-4" />
                </CustomButton>
                <CustomButton variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-4 h-4" />
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-mono mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <div className="flex gap-4">
          {projects.length > 0 && (
            <CustomButton variant={isReordering ? "default" : "outline"} onClick={() => setIsReordering(!isReordering)}>
              {isReordering ? "Done" : "Reorder"}
            </CustomButton>
          )}
          <CustomButton onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </CustomButton>
        </div>
      </div>

      {/* Projects List */}
      {isReordering ? (
        <SortableList
          items={projects}
          onReorder={handleReorder}
          renderItem={renderProjectItem}
          keyExtractor={(project) => project.id}
          className="space-y-4"
        />
      ) : (
        <div className="space-y-4">{projects.map((project, index) => renderProjectItem(project, index, false))}</div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="border border-white/20 rounded-xl p-12 text-center bg-gray-900/30">
          <div className="w-12 h-12 bg-gray-500 rounded mx-auto mb-4 flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No projects added yet</p>
          <CustomButton onClick={() => openModal()}>Add Your First Project</CustomButton>
        </div>
      )}

      {/* Project Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl bg-black border border-white text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <CustomInput
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <CustomInput
                variant="textarea"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deployLink">Deploy Link (Optional)</Label>
                <CustomInput
                  id="deployLink"
                  value={formData.deployLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deployLink: e.target.value }))}
                  placeholder="https://your-project.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubLink">GitHub Link (Optional)</Label>
                <CustomInput
                  id="githubLink"
                  value={formData.githubLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, githubLink: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <CustomInput
                id="techStack"
                value={techStackInput}
                onChange={(e) => handleTechStackChange(e.target.value)}
                placeholder="React, TypeScript, Node.js"
              />
              <p className="text-xs text-gray-500">Use exact names from your Tech Stack to display icons properly</p>
            </div>

            <div className="space-y-2">
              <Label>Project Images</Label>
              <div className="space-y-4">
                <CustomButton type="button" variant="outline" asChild>
                  <label className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </CustomButton>

                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <CustomButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-black/50"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </CustomButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <CustomButton type="submit">{editingProject ? "Update Project" : "Add Project"}</CustomButton>
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
