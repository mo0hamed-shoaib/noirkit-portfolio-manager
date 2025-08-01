"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Project, TechStack } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"
import { CustomButton } from "@/components/ui/custom-button"

interface ProjectsSectionProps {
  projects: Project[]
  techStack: TechStack[]
}

export function ProjectsSection({ projects, techStack }: ProjectsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const projectsPerPage = 3
  const totalPages = Math.ceil(projects.length / projectsPerPage)

  const goToPrevious = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1))
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const goToNext = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1))
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const goToPage = (pageIndex: number) => {
    if (isTransitioning || pageIndex === currentIndex) return
    
    setIsTransitioning(true)
    setCurrentIndex(pageIndex)
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  if (projects.length === 0) {
    return (
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-bold">My Projects</h2>
          <p className="text-gray-400 text-sm mt-1">Showcasing my latest work</p>
        </div>
        <div className="border border-white/20 rounded-xl p-12 text-center bg-gradient-to-br from-gray-900/30 to-black/30">
          <p className="text-gray-500">No projects to display yet</p>
        </div>
      </section>
    )
  }

  // Create all pages of projects for sliding effect
  const projectPages = []
  for (let i = 0; i < totalPages; i++) {
    const pageProjects = projects.slice(i * projectsPerPage, (i + 1) * projectsPerPage)
    projectPages.push(pageProjects)
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold">My Projects</h2>
          <p className="text-gray-400 text-sm mt-1">Showcasing my latest work</p>
        </div>

        {/* Enhanced Navigation Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={isTransitioning}
              className={`bg-black/50 backdrop-blur-sm border-white/30 hover:bg-white hover:text-black transition-all duration-200 ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </CustomButton>
            <span className="text-sm text-gray-400 px-2">
              {currentIndex + 1} of {totalPages}
            </span>
            <CustomButton
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={isTransitioning}
              className={`bg-black/50 backdrop-blur-sm border-white/30 hover:bg-white hover:text-black transition-all duration-200 ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </CustomButton>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Projects Carousel Container */}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projectPages.map((pageProjects, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px]">
                  {pageProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      techStackIcons={techStack} 
                    />
                  ))}
                  
                  {/* Fill empty slots with placeholder divs to maintain grid structure */}
                  {Array.from({ length: projectsPerPage - pageProjects.length }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="invisible" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Page Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`relative transition-all duration-300 ${
                  isTransitioning ? 'cursor-not-allowed' : 'hover:scale-125'
                }`}
                onClick={() => goToPage(index)}
                disabled={isTransitioning}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-white scale-110 shadow-lg" 
                      : "bg-gray-600 hover:bg-gray-400"
                  }`}
                />
                {/* Active indicator ring */}
                {index === currentIndex && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full border-2 border-white/40 scale-150 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Loading indicator during transitions */}
        {isTransitioning && (
          <div className="absolute top-4 right-4 z-10">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  )
}