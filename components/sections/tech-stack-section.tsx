"use client"

import type { TechStack } from "@/lib/types"

interface TechStackSectionProps {
  techStack: TechStack[]
}

export function TechStackSection({ techStack }: TechStackSectionProps) {
    const renderIcon = (iconPath: string, className = "w-5 h-5") => {
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
              aria-hidden="true"
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

  if (techStack.length === 0) {
    return (
      <section className="border border-white/20 rounded-xl p-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="mb-6">
          <h2 className="text-2xl font-mono text-white font-bold">My Stack</h2>
          <p className="text-gray-400 text-sm mt-1">Technologies I work with</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No technologies added yet</p>
        </div>
      </section>
    )
  }

  return (
    <section className="border border-white/20 rounded-xl p-6 bg-black relative overflow-hidden group hover:border-white/30 transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-mono text-white font-bold">My Stack</h2>
        <p className="text-gray-400 text-sm mt-1">Technologies I work with</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {techStack.map((tech, index) => (
          <div
            key={tech.id}
            className="group/tech cursor-pointer"
            title={tech.name}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-10 h-10 text-white/80 hover:text-white hover:scale-110 transition-all duration-300 animate-fade-in">
              {renderIcon(tech.icon, "w-full h-full")}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}