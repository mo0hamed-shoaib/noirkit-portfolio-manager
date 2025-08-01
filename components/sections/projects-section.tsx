"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react";
import type { Project, TechStack } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomInput } from "@/components/ui/custom-input";

interface ProjectsSectionProps {
  projects: Project[];
  techStack: TechStack[];
}

export function ProjectsSection({ projects, techStack }: ProjectsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechFilter, setSelectedTechFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const projectsPerPage = 3;

  // Get unique technologies from all projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.techStack.forEach((tech) => techSet.add(tech.toLowerCase()));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on search and tech filter
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchTerm === "" ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTech =
        selectedTechFilter === "" ||
        project.techStack.some(
          (tech) => tech.toLowerCase() === selectedTechFilter.toLowerCase()
        );

      return matchesSearch && matchesTech;
    });
  }, [projects, searchTerm, selectedTechFilter]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const goToPrevious = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToPage = (pageIndex: number) => {
    if (isTransitioning || pageIndex === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(pageIndex);

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: string) => {
    setSelectedTechFilter(newFilter);
    setCurrentIndex(0);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setCurrentIndex(0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTechFilter("");
    setCurrentIndex(0);
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
        <div className="border border-white/20 rounded-xl p-12 text-center bg-gradient-to-br from-gray-900/30 to-black/30">
          <p className="text-gray-500">No projects to display yet</p>
        </div>
      </section>
    );
  }

  // Create all pages of filtered projects for sliding effect
  const projectPages = [];
  for (let i = 0; i < totalPages; i++) {
    const pageProjects = filteredProjects.slice(
      i * projectsPerPage,
      (i + 1) * projectsPerPage
    );
    projectPages.push(pageProjects);
  }

  const hasActiveFilters = searchTerm !== "" || selectedTechFilter !== "";

  return (
    <section>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-mono font-bold">My Projects</h2>
            <p className="text-gray-400 text-sm mt-1">
              Showcasing my latest work
              {hasActiveFilters && (
                <span className="text-white/60 ml-2">
                  ({filteredProjects.length} of {projects.length})
                </span>
              )}
            </p>
          </div>

          {/* Filter Toggle Button */}
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-black/50 backdrop-blur-sm border-white/30 hover:bg-white hover:text-black transition-all duration-200"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </CustomButton>
        </div>

        {/* Search and Filter Controls */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-900/30 rounded-lg border border-white/10">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <CustomInput
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Technology Filter */}
              <div className="sm:w-48">
                <select
                  value={selectedTechFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:border-white/60 transition-colors"
                  aria-label="Filter by technology"
                >
                  <option value="">All Technologies</option>
                  {allTechnologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech.charAt(0).toUpperCase() + tech.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </CustomButton>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedTechFilter && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white">
                    Tech: {selectedTechFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={isTransitioning}
              className={`bg-black/50 backdrop-blur-sm border-white/30 hover:bg-white hover:text-black transition-all duration-200 ${
                isTransitioning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
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
                isTransitioning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
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

        {/* Enhanced Page Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`relative transition-all duration-300 ${
                  isTransitioning ? "cursor-not-allowed" : "hover:scale-125"
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

        {/* No results message */}
        {filteredProjects.length === 0 && hasActiveFilters && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No projects match your current filters.
            </p>
            <CustomButton
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="hover:scale-105"
            >
              Clear Filters
            </CustomButton>
          </div>
        )}
      </div>
    </section>
  );
}
