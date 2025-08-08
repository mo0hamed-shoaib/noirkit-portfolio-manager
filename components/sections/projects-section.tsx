"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project, TechStack } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { CustomButton } from "@/components/ui/custom-button";

interface ProjectsSectionProps {
  projects: Project[];
  techStack: TechStack[];
}

export function ProjectsSection({ projects, techStack }: ProjectsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projectsPerPage = 3;

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex === currentIndex) return;
    setCurrentIndex(pageIndex);
  };

  if (projects.length === 0) {
    return (
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-bold">My Projects</h2>
          <p className="text-gray-400 text-sm mt-1">
            Showcasing my latest work
          </p>
        </div>
        <div className="border border-white/20 rounded-xl p-12 text-center bg-black">
          <p className="text-gray-500">No projects to display yet</p>
        </div>
      </section>
    );
  }

  // Create all pages of projects for sliding effect
  const projectPages = [];
  for (let i = 0; i < totalPages; i++) {
    const pageProjects = projects.slice(
      i * projectsPerPage,
      (i + 1) * projectsPerPage
    );
    projectPages.push(pageProjects);
  }

  return (
    <section className="border border-white/20 rounded-xl p-6 bg-black/20 group hover:border-white/30 transition-all duration-300">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-mono font-bold">My Projects</h2>
            <p className="text-gray-400 text-sm mt-1">
              Showcasing my latest work
            </p>
          </div>

          {/* Navigation Controls - Moved to opposite side of "My Projects" */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
                             <CustomButton
                 variant="outline"
                 size="sm"
                 onClick={goToPrevious}
                 className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
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
                 className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
               >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </CustomButton>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Projects Carousel Container */}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projectPages.map((pageProjects, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4 min-h-[200px]">
                  {pageProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      techStackIcons={techStack}
                    />
                  ))}

                  {/* Fill empty slots with placeholder divs to maintain grid structure */}
                  {Array.from({
                    length: projectsPerPage - pageProjects.length,
                  }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="invisible" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Progress Bar */}
        {totalPages > 1 && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-gray-400">
                {currentIndex + 1} of {totalPages}
              </span>
              <div className="flex-1 max-w-xs bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ width: `${((currentIndex + 1) / totalPages) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}


      </div>
    </section>
  );
}