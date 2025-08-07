"use client";

import { useState } from "react";
import {
  GraduationCap,
  Award,
  ArrowRight,
  Trophy,
} from "lucide-react";
import type { Achievement } from "@/lib/types";
import { CustomButton } from "@/components/ui/custom-button";

interface ContactAchievementsSectionProps {
  achievements: Achievement[];
  onContactClick: () => void;
}



export function ContactAchievementsSection({
  achievements,
  onContactClick,
}: ContactAchievementsSectionProps) {

  

    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsAchievementModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Achievements Section - Compact Grid */}
      <section className="border border-white/20 rounded-xl p-4 bg-black relative overflow-hidden group hover:border-white/30 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-all duration-300 flex-shrink-0">
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-mono text-white font-bold">Achievements & Education</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{achievements.length} items</span>
                {achievements.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{achievements.filter(a => a.type === "education").length} Education</span>
                    <span>•</span>
                    <span>{achievements.filter(a => a.type === "achievement").length} Awards</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-6">
            <Award className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No achievements added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {achievements.slice(0, 9).map((achievement) => (
              <button
                type="button"
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 text-left min-w-0"
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {achievement.type === "education" ? (
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Award className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm text-white truncate">
                    {achievement.title}
                  </h4>
                  <span className="text-xs text-gray-500 truncate block">
                    {achievement.date}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            ))}
            {achievements.length > 9 && (
              <div className="text-center col-span-full pt-2">
                <span className="text-xs text-gray-500">+{achievements.length - 9} more items</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isAchievementModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsAchievementModalOpen(false)}
        >
          <div
            className="bg-black border border-white/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                {selectedAchievement.type === "education" ? (
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                ) : (
                  <Award className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-mono text-white font-bold">{selectedAchievement.title}</h3>
                <span className="text-sm text-gray-400">{selectedAchievement.date}</span>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              {selectedAchievement.description}
            </p>
            
            <div className="flex justify-between items-center">
              <span
                className={`text-sm px-3 py-1 rounded-full border ${
                  selectedAchievement.type === "education"
                    ? "bg-blue-400/10 text-blue-400 border-blue-400/20"
                    : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                }`}
              >
                {selectedAchievement.type === "education" ? "Education" : "Achievement"}
              </span>
              
              <CustomButton
                variant="outline"
                size="sm"
                onClick={() => setIsAchievementModalOpen(false)}
              >
                Close
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
